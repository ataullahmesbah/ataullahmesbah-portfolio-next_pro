'use client';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, X, User, Shield } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

// Function to get or create a persistent user ID from localStorage
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
  const persistentUserId = useRef(getPersistentUserId());
  const messageIds = useRef(new Set());

  useEffect(() => {
    if (isOpen) {
      if (!socketRef.current) {
        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
          path: '/socket.io',
          transports: ['websocket', 'polling'],
          query: { persistentUserId: persistentUserId.current },
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current.on('connect', () => {
          setIsConnected(true);
          socketRef.current.emit('init-chat', { persistentUserId: persistentUserId.current });
          console.log(`✅ Socket Connected: ${socketRef.current.id}`);
        });

        socketRef.current.on('disconnect', () => {
          setIsConnected(false);
          console.log('⚠️ Socket Disconnected');
          toast.warn('সার্ভার থেকে সংযোগ বিচ্ছিন্ন');
        });

        socketRef.current.on('chat-history', (chat) => {
          console.log('📜 Chat history received:', chat);
          const newMessages = (chat.messages || []).filter(
            (msg) => msg._id && !messageIds.current.has(msg._id.toString())
          );
          newMessages.forEach((msg) => messageIds.current.add(msg._id.toString()));
          setMessages(newMessages);
          setChatStatus(chat.status);
        });

        socketRef.current.on('new-message', (message) => {
          console.log('📩 New message:', message);
          if (message._id && !messageIds.current.has(message._id.toString())) {
            messageIds.current.add(message._id.toString());
            setMessages((prev) => [...prev, message]);
          }
        });

        socketRef.current.on('chat-accepted', (chat) => {
          console.log('✅ Chat accepted:', chat);
          setChatStatus('active');
          toast.success('অ্যাডমিন চ্যাটে যুক্ত হয়েছেন!');
        });

        socketRef.current.on('error', ({ message }) => {
          console.error(`❌ Server Error: ${message}`);
          toast.error(message);
        });
      }
    } else {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() && isConnected) {
      const tempId = Date.now().toString();
      const optimisticMessage = { sender: 'user', content: input, _id: tempId, timestamp: new Date() };
      messageIds.current.add(tempId);
      setMessages((prev) => [...prev, optimisticMessage]);

      try {
        // Save to database via API first
        const res = await fetch('/api/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: persistentUserId.current, content: input.trim(), sender: 'user' }),
        });
        const data = await res.json();
        if (!data.success) {
          console.error('❌ API save error:', data.message, data.error);
          toast.error(`মেসেজ সেভ করতে ব্যর্থ: ${data.message}`);
          setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
          messageIds.current.delete(tempId);
          return;
        }
        console.log('✅ API save success:', data.chat);

        // Send via Socket.IO only if API save is successful
        socketRef.current.emit('user-message', { persistentUserId: persistentUserId.current, content: input.trim() });
        toast.success('মেসেজ পাঠানো হয়েছে!');
      } catch (err) {
        console.error('❌ API save error:', err.message, err.stack);
        toast.error(`মেসেজ সেভ করতে ব্যর্থ: ${err.message}`);
        setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
        messageIds.current.delete(tempId);
      }

      setInput('');
    } else {
      toast.error(isConnected ? 'দয়া করে একটি মেসেজ লিখুন' : 'সার্ভারের সাথে সংযোগ নেই');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-[95vw] max-w-[400px] h-[80vh] max-h-[600px] sm:w-96 sm:max-w-[450px] sm:h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col border border-gray-200 dark:border-gray-700"
          >
            <header className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Shield className="text-indigo-500 w-5 h-5 sm:w-6 sm:h-6" />
                  {isConnected && (
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-900"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-white">কাস্টমার সাপোর্ট</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">{isConnected ? 'অনলাইন' : 'সংযোগ হচ্ছে...'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-800 dark:hover:text-white p-1 sm:p-2 rounded-full"
              >
                <X size={16} className="sm:w-5 sm:h-5" />
              </button>
            </header>

            <main className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 sm:space-y-4 custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={msg._id || idx}
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'admin' && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <Shield size={12} className="sm:w-4 sm:h-4 text-gray-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] sm:max-w-[75%] px-3 py-2 sm:px-4 sm:py-2 rounded-2xl text-xs sm:text-sm ${msg.sender === 'user'
                        ? 'bg-indigo-500 text-white rounded-br-none'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                      }`}
                  >
                    {msg.content}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <User size={12} className="sm:w-4 sm:h-4 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
              {chatStatus === 'pending' && messages.length > 0 && (
                <div className="text-center text-[10px] sm:text-xs text-gray-400 py-2">
                  একজন অ্যাডমিন দ্রুত আপনার সাথে যুক্ত হবেন।
                </div>
              )}
              <div ref={messagesEndRef} />
            </main>

            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2 flex-shrink-0"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="আপনার মেসেজ লিখুন..."
                className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-3 sm:px-4 text-xs sm:text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!isConnected}
              />
              <button
                type="submit"
                className="bg-indigo-500 text-white rounded-full p-2 sm:p-2.5 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
                disabled={!input.trim() || !isConnected}
              >
                <Send size={14} className="sm:w-5 sm:h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="bg-indigo-500 text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-indigo-600 transition-colors"
        >
          <MessageSquare size={20} className="sm:w-7 sm:h-7" />
        </motion.button>
      )}
    </div>
  );
}   