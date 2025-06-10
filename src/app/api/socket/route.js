import { Server } from 'socket.io';
import { NextResponse } from 'next/server';
import Chat from '@/models/Chat';
import dbConnect from '@/lib/dbMongoose';


export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export async function GET(req, context) {
    try {
        const socketServer = context.socket.server;
        if (!socketServer.io) {
            await dbConnect();
            console.log('Initializing Socket.IO server');

            const io = new Server(socketServer, {
                path: '/api/socket/io',
                cors: {
                    origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
                    methods: ['GET', 'POST'],
                    credentials: true,
                },
            });

            io.on('connection', (socket) => {
                console.log('User connected:', socket.id);

                socket.on('init-chat', async () => {
                    try {
                        const chat = await Chat.findOneAndUpdate(
                            { userId: socket.id },
                            { $setOnInsert: { userId: socket.id, status: 'pending' } },
                            { upsert: true, new: true }
                        );
                        io.emit('new-chat-request', { userId: socket.id, chatId: chat._id });
                        console.log('New chat initialized:', chat._id);
                    } catch (err) {
                        console.error('Error initializing chat:', err.message);
                    }
                });

                socket.on('user-message', async ({ message }) => {
                    try {
                        const chat = await Chat.findOne({ userId: socket.id });
                        if (!chat) return;

                        chat.messages.push({ sender: 'user', content: message });
                        await chat.save();

                        if (chat.status === 'accepted') {
                            io.to('admin').emit('message', { userId: socket.id, message, sender: 'user' });
                        } else {
                            io.emit('new-chat-request', { userId: socket.id, chatId: chat._id });
                        }
                        console.log('User message saved:', message);
                    } catch (err) {
                        console.error('Error saving user message:', err.message);
                    }
                });

                socket.on('accept-chat', async ({ userId }) => {
                    try {
                        const chat = await Chat.findOneAndUpdate(
                            { userId },
                            { status: 'accepted' },
                            { new: true }
                        );
                        if (chat) {
                            socket.join('admin');
                            io.to(userId).emit('chat-accepted', { messages: chat.messages });
                            io.to('admin').emit('chat-status', { userId, status: 'accepted' });
                            console.log('Chat accepted for user:', userId);
                        }
                    } catch (err) {
                        console.error('Error accepting chat:', err.message);
                    }
                });

                socket.on('admin-message', async ({ userId, message }) => {
                    try {
                        const chat = await Chat.findOne({ userId });
                        if (!chat) return;

                        chat.messages.push({ sender: 'admin', content: message });
                        await chat.save();

                        io.to(userId).emit('message', { userId, message, sender: 'admin' });
                        io.to('admin').emit('message', { userId, message, sender: 'admin' });
                        console.log('Admin message saved:', message);
                    } catch (err) {
                        console.error('Error saving admin message:', err.message);
                    }
                });

                socket.on('disconnect', () => {
                    console.log('User disconnected:', socket.id);
                });
            });

            socketServer.io = io;
        }

        return new Response(JSON.stringify({ message: 'Socket.IO server initialized' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error in /api/socket:', error.message, error.stack);
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
}