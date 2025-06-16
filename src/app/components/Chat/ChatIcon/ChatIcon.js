// portfolio/app/components/ChatIcon.jsx


// portfolio/app/components/ChatIcon.jsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, User, Shield } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

const getPersistentUserId = () => {
  if (typeof window === 'undefined') return null;
  let userId = localStorage.getItem('chatUserId');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('chatUserId', userId);
  }
  return userId;
};

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [chatStatus, setChatStatus] = useState('pending');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [persistentUserId, setPersistentUserId] = useState(null);

  useEffect(() => {
    setPersistentUserId(getPersistentUserId());
  }, []);

  useEffect(() => {
    if (!persistentUserId) return;

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      path: '/socket.io',
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 10000,
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('init-chat', { persistentUserId });
      console.log(`✅ Socket Connected: ${socketRef.current.id}`);
    });

    socketRef.current.on('connect_error', (err) => {
      setIsConnected(false);
      console.error(`❌ Socket Connect Error: ${err.message}`);
      toast.error(`Connection failed: ${err.message}`);
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('⚠️ Socket Disconnected');
      toast.warn('Disconnected from server');
    });

    socketRef.current.on('chat-history', (chat) => {
      console.log('📜 Chat history:', chat);
      setMessages(chat.messages || []);
      setChatStatus(chat.status);
    });

    socketRef.current.on('chat-accepted', (chat) => {
      console.log('✅ Chat accepted:', chat);
      setChatStatus('active');
      setMessages(chat.messages || []);
      toast.success('Admin has joined the chat!');
    });

    socketRef.current.on('new-message', (message) => {
      console.log('📩 New message:', message);
      setMessages((prev) => [...prev, message]);
    });

    socketRef.current.on('error', ({ message }) => {
      console.error(`❌ Server Error: ${message}`);
      toast.error(message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [persistentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && isConnected) {
      const optimisticMessage = { sender: 'user', content: input, _id: Date.now(), timestamp: new Date() };
      setMessages((prev) => [...prev, optimisticMessage]);
      socketRef.current.emit('user-message', { persistentUserId, content: input.trim() });
      setInput('');
      toast.success('Message sent!');
    } else if (!isConnected) {
      toast.error('Not connected to server');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield className="text-indigo-500" />
                  {isConnected && (
                    <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white">Customer Support</h3>
                  <p className="text-xs text-gray-500">{isConnected ? 'Online' : 'Connecting...'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'admin' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Shield size={16} className="text-gray-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'user'
                        ? 'bg-indigo-500 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }`}
                  >
                    {msg.content}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
              {chatStatus === 'pending' && messages.length > 0 && (
                <div className="text-center text-xs text-gray-400 py-2">
                  একজন অ্যাডমিন দ্রুত আপনার সাথে যুক্ত হবেন।
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 flex-shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="আপনার মেসেজ লিখুন..."
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-4 text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!isConnected}
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white rounded-full p-2.5 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                disabled={!input.trim() || !isConnected}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-indigo-500 text-white rounded-full p-4 shadow-lg hover:bg-indigo-600 transition-colors"
        >
          <MessageSquare size={28} />
        </motion.button>
      )}
    </div>
  );
}