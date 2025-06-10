'use client';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { getSession } from 'next-auth/react';

let socket;

export default function AdminChatPanel() {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [input, setInput] = useState('');

    useEffect(() => {
        const initSocket = async () => {
            const session = await getSession();
            if (!session || session.user.role !== 'admin') {
                window.location.href = '/login';
                return;
            }

            socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
                path: '/api/socket/io',
                transports: ['websocket', 'polling'],
            });

            socket.on('connect', () => {
                console.log('Admin connected to Socket.IO server:', socket.id);
            });

            socket.on('connect_error', (err) => {
                console.error('Admin Socket.IO connection error:', err.message, err.stack);
            });

            socket.on('new-chat-request', ({ userId, chatId }) => {
                setChats((prev) => {
                    if (!prev.find((chat) => chat.userId === userId)) {
                        return [...prev, { userId, chatId, status: 'pending', messages: [] }];
                    }
                    return prev;
                });
                console.log('New chat request received:', userId);
            });

            socket.on('message', ({ userId, message, sender }) => {
                setChats((prev) =>
                    prev.map((chat) =>
                        chat.userId === userId
                            ? { ...chat, messages: [...chat.messages, { sender, content: message }] }
                            : chat
                    )
                );
            });

            socket.on('chat-status', ({ userId, status }) => {
                setChats((prev) =>
                    prev.map((chat) => (chat.userId === userId ? { ...chat, status } : chat))
                );
            });

            return () => {
                if (socket) socket.disconnect();
            };
        };

        initSocket();
    }, []);

    const acceptChat = (userId) => {
        socket.emit('accept-chat', { userId });
        setActiveChat(userId);
    };

    const sendMessage = () => {
        if (input.trim() && activeChat) {
            socket.emit('admin-message', { userId: activeChat, message: input });
            setInput('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
            <h1 className="text-2xl font-bold text-purple-400 mb-4">Admin Chat Panel</h1>
            <div className="flex gap-4">
                <div className="w-1/3 bg-gray-900 rounded-lg p-4">
                    <h2 className="text-lg mb-2 text-purple-400">Chat Requests</h2>
                    {chats.length === 0 && (
                        <p className="text-gray-400">No chat requests yet.</p>
                    )}
                    {chats.map((chat) => (
                        <motion.div
                            key={chat.userId}
                            whileHover={{ scale: 1.02 }}
                            className={`p-2 mb-2 rounded-lg cursor-pointer ${chat.status === 'pending' ? 'bg-purple-600' : 'bg-gray-800'
                                }`}
                            onClick={() => setActiveChat(chat.userId)}
                        >
                            <p className="text-sm">User: {chat.userId.slice(0, 8)}...</p>
                            <p className="text-sm">Status: {chat.status}</p>
                            {chat.status === 'pending' && (
                                <button
                                    onClick={() => acceptChat(chat.userId)}
                                    className="mt-2 bg-purple-400 text-white px-2 py-1 rounded text-sm"
                                >
                                    Accept
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
                <div className="w-2/3 bg-gray-900 rounded-lg p-4 flex flex-col">
                    {activeChat ? (
                        <>
                            <h2 className="text-lg mb-2 text-purple-400">
                                Chat with User: {activeChat.slice(0, 8)}...
                            </h2>
                            <div className="flex-1 overflow-y-auto mb-4">
                                {chats
                                    .find((chat) => chat.userId === activeChat)
                                    ?.messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`mb-2 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}
                                        >
                                            <span
                                                className={`inline-block p-2 rounded-lg ${msg.sender === 'admin' ? 'bg-purple-600' : 'bg-gray-800'
                                                    } text-sm`}
                                            >
                                                {msg.content}
                                            </span>
                                        </div>
                                    ))}
                            </div>
                            <div className="border-t border-gray-800 pt-4 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-800 text-white rounded-lg p-2 outline-none text-sm"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={sendMessage}
                                    className="bg-purple-600 text-white rounded-lg p-2 text-sm"
                                >
                                    Send
                                </motion.button>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-400">Select a chat to start messaging</p>
                    )}
                </div>
            </div>
        </div>
    );
}