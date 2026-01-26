// portfolio/app/api/socket/route.js
import { getServerSession } from 'next-auth/next';
import Chat from '@/src/models/Chat';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbMongoose';

// In-memory store for simulating Socket.IO (for Vercel)
let clients = new Map(); // { userId: { res, timeout } }

export async function GET(req) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const persistentUserId = searchParams.get('persistentUserId');
  const isAdmin = searchParams.get('isAdmin') === 'true';

  if (!persistentUserId && !isAdmin) {
    return new Response(JSON.stringify({ error: 'Missing user ID' }), { status: 400 });
  }

  // Simulate Socket.IO connection
  const res = new Response(
    new ReadableStream({
      start(controller) {
        const clientId = isAdmin ? `admin_${Date.now()}` : persistentUserId;
        clients.set(clientId, { res: controller, timeout: null });

        // Initialize chat for users
        if (!isAdmin && persistentUserId) {
          Chat.findOneAndUpdate(
            { userId: persistentUserId },
            { $setOnInsert: { userId: persistentUserId } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          )
            .then((chat) => {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ event: 'chat-history', data: chat })}\n\n`
                )
              );
              if (chat.status === 'pending') {
                // Notify admins
                clients.forEach((client, id) => {
                  if (id.startsWith('admin_')) {
                    client.res.enqueue(
                      new TextEncoder().encode(
                        `data: ${JSON.stringify({ event: 'new-chat-request', data: chat })}\n\n`
                      )
                    );
                  }
                });
              }
            })
            .catch((err) => {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ event: 'error', data: { message: 'Failed to initialize chat' } })}\n\n`
                )
              );
            });
        }

        // Keep connection alive
        const keepAlive = () => {
          const client = clients.get(clientId);
          if (client) {
            client.res.enqueue(new TextEncoder().encode('data: {"event":"ping"}\n\n'));
            client.timeout = setTimeout(keepAlive, 15000);
          }
        };
        keepAlive();

        // Clean up on close
        req.signal.addEventListener('abort', () => {
          const client = clients.get(clientId);
          if (client) {
            clearTimeout(client.timeout);
            clients.delete(clientId);
          }
          controller.close();
        });
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    }
  );

  return res;
}

export async function POST(req) {
  await dbConnect();
  const { event, data } = await req.json();
  const { persistentUserId, userId, content } = data || {};

  if (!event) {
    return new Response(JSON.stringify({ error: 'Missing event' }), { status: 400 });
  }

  try {
    if (event === 'user-message' && persistentUserId && content) {
      const newMessage = { sender: 'user', content, timestamp: new Date() };
      await Chat.updateOne(
        { userId: persistentUserId },
        { $push: { messages: newMessage }, $set: { updatedAt: new Date() } }
      );
      clients.forEach((client, id) => {
        if (id === persistentUserId || id.startsWith('admin_')) {
          client.res.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                event: id === persistentUserId ? 'new-message' : 'new-message-for-admin',
                data: id === persistentUserId ? newMessage : { userId: persistentUserId, message: newMessage },
              })}\n\n`
            )
          );
        }
      });
    } else if (event === 'accept-chat' && userId) {
      const chat = await Chat.findOneAndUpdate(
        { userId },
        { status: 'active' },
        { new: true }
      );
      if (chat) {
        clients.forEach((client, id) => {
          if (id === userId || id.startsWith('admin_')) {
            client.res.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({
                  event: id === userId ? 'chat-accepted' : 'chat-status-update',
                  data: id === userId ? chat : { userId, status: 'active' },
                })}\n\n`
              )
            );
          }
        });
      }
    } else if (event === 'admin-message' && userId && content) {
      const newMessage = { sender: 'admin', content, timestamp: new Date() };
      await Chat.updateOne(
        { userId },
        { $push: { messages: newMessage }, $set: { status: 'active', updatedAt: new Date() } }
      );
      clients.forEach((client, id) => {
        if (id === userId || id.startsWith('admin_')) {
          client.res.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                event: id === userId ? 'new-message' : 'new-message-for-admin',
                data: id === userId ? newMessage : { userId, message: newMessage },
              })}\n\n`
            )
          );
        }
      });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
  
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}