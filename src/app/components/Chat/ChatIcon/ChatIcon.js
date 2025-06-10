'use client';
import { useState, useEffect } from 'react';
import { IoChatbubbleEllipses } from 'react-icons/io5';
import io from 'socket.io-client';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

let socket;

export default function ChatIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      path: '/api/socket/io',
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server:', socket.id);
      toast.success('Connected to chat server!');
      socket.emit('init-chat');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message, err.stack);
      toast.error('Failed to connect to chat server');
    });

    socket.on('message', ({ message, sender }) => {
      setMessages((prev) => [...prev, { sender, content: message }]);
    });

    socket.on('chat-accepted', ({ messages }) => {
      setMessages(messages);
      toast.success('Chat accepted by admin!');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      setIsSending(true);
      socket.emit('user-message', { message: input }, (response) => {
        if (response?.status === 'ok') {
          setMessages((prev) => [...prev, { sender: 'user', content: input }]);
          toast.success('Message sent!');
        } else {
          toast.error('Failed to send message');
        }
        setIsSending(false);
        setInput('');
      });
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white rounded-full p-4 shadow-lg border-2 border-purple-400"
      >
        <IoChatbubbleEllipses size={24} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-950 text-white w-80 h-96 rounded-lg shadow-lg mt-2 flex flex-col border border-gray-800"
        >
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 && (
              <p className="text-gray-400 text-center">Start chatting!</p>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    msg.sender === 'user' ? 'bg-purple-600' : 'bg-gray-800'
                  } text-sm`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isSending && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-800 text-white rounded-lg p-2 outline-none text-sm"
              disabled={isSending}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={isSending}
              className={`bg-purple-600 text-white rounded-lg p-2 ${
                isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSending ? 'Sending...' : 'Send'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}