// portfolio/server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const dbConnect = require('./src/lib/dbMongoose');
const Chat = require('./src/models/Chat').default;

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  try {
    await dbConnect();
    console.log('🟢 MongoDB Connected');

    const httpServer = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      console.log(`📡 Request: ${req.method} ${req.url}`); // Debug
      handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log(`✅ Client Connected: ${socket.id}`);

      if (socket.handshake.query.isAdmin === 'true') {
        socket.join('admin-room');
        console.log(`Socket ${socket.id} joined admin-room`);
      }

      socket.on('init-chat', async ({ persistentUserId }) => {
        if (!persistentUserId) {
          console.error('❌ No persistentUserId');
          return socket.emit('error', { message: 'No user ID provided' });
        }
        socket.join(persistentUserId);
        try {
          const chat = await Chat.findOneAndUpdate(
            { userId: persistentUserId },
            { $setOnInsert: { userId: persistentUserId } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          socket.emit('chat-history', chat);
          if (chat.status === 'pending') {
            io.to('admin-room').emit('new-chat-request', chat);
          }
        } catch (err) {
          console.error('❌ Init chat error:', err.message);
          socket.emit('error', { message: 'Failed to initialize chat' });
        }
      });

      socket.on('user-message', async ({ persistentUserId, content }) => {
        try {
          const newMessage = { sender: 'user', content, timestamp: new Date() };
          await Chat.updateOne(
            { userId: persistentUserId },
            { $push: { messages: newMessage }, $set: { updatedAt: new Date() } }
          );
          io.to(persistentUserId).emit('new-message', newMessage);
          io.to('admin-room').emit('new-message-for-admin', { userId: persistentUserId, message: newMessage });
        } catch (err) {
          console.error('❌ User message error:', err.message);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('accept-chat', async ({ userId }) => {
        try {
          const chat = await Chat.findOneAndUpdate(
            { userId },
            { status: 'active' },
            { new: true }
          );
          if (chat) {
            io.to(userId).emit('chat-accepted', chat);
            io.to('admin-room').emit('chat-status-update', { userId, status: 'active' });
          }
        } catch (err) {
          console.error('❌ Accept chat error:', err.message);
          socket.emit('error', { message: 'Failed to accept chat' });
        }
      });

      socket.on('admin-message', async ({ userId, content }) => {
        try {
          const newMessage = { sender: 'admin', content, timestamp: new Date() };
          await Chat.updateOne(
            { userId },
            { $push: { messages: newMessage }, $set: { status: 'active', updatedAt: new Date() } }
          );
          io.to(userId).emit('new-message', newMessage);
          io.to('admin-room').emit('new-message-for-admin', { userId, message: newMessage });
        } catch (err) {
          console.error('❌ Admin message error:', err.message);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      socket.on('disconnect', () => {
        console.log(`⚠️ Client Disconnected: ${socket.id}`);
      });
    });

    httpServer.on('error', (err) => {
      console.error('❌ Server Error:', err.message);
      process.exit(1);
    });

    httpServer.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Startup Error:', err);
    process.exit(1);
  }
});