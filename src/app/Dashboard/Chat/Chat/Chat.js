'use client';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, UserCheck, Clock, MessageCircle, User } from 'lucide-react';
import { getSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function AdminChatPanel() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const messageIds = useRef(new Set()); // To prevent duplicate messages

  // Function to fetch initial chat data once
  const fetchInitialChats = async () => {
    try {
      const res = await fetch('/api/chats');
      const data = await res.json();
      if (data.success) {
        const initialChats = data.chats || [];
        setChats(initialChats);

        // Populate messageIds set with all existing message IDs
        const allMessageIds = new Set();
        initialChats.forEach(chat => {
          chat.messages.forEach(msg => msg._id && allMessageIds.add(msg._id.toString()));
        });
        messageIds.current = allMessageIds;

        // Set the first chat as active if none is selected
        if (initialChats.length > 0 && !activeChatId) {
          setActiveChatId(initialChats[0].userId);
        }
      } else {
        toast.error('চ্যাট তালিকা লোড করতে ব্যর্থ: ' + data.message);
      }
    } catch (error) {
      console.error('❌ Fetch initial chats error:', error.stack);
      toast.error('চ্যাট তালিকা লোড করতে একটি ত্রুটি ঘটেছে।');
    }
  };

  useEffect(() => {
    // Check session and fetch initial data
    const initialize = async () => {
      const session = await getSession();
      if (!session || session.user.role !== 'admin') {
        window.location.href = '/login'; // Redirect if not an admin
        return;
      }
      await fetchInitialChats();
    };

    initialize();

    // Setup socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      query: { isAdmin: true },
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      socketRef.current.emit('join-admin-room');
      console.log('✅ Admin Socket Connected');
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('⚠️ Admin Socket Disconnected');
      toast.warn('সার্ভার থেকে সংযোগ বিচ্ছিন্ন');
    });

    // Listen for new chat requests
    socketRef.current.on('new-chat-request', (newChat) => {
      toast.info(`নতুন চ্যাট রিকোয়েস্ট: ${newChat.userId.substring(0, 8)}...`);
      setChats((prev) => {
        // Avoid adding duplicate chats
        if (prev.find(chat => chat.userId === newChat.userId)) {
          return prev;
        }
        return [newChat, ...prev];
      });
    });

    // Listen for new messages for any chat
    socketRef.current.on('new-message-for-admin', ({ userId, message }) => {
      if (message._id && !messageIds.current.has(message._id.toString())) {
        messageIds.current.add(message._id.toString());
        setChats((prev) =>
          prev.map((chat) =>
            chat.userId === userId
              ? { ...chat, messages: [...chat.messages, message], updatedAt: new Date() } // Update timestamp to bring to top
              : chat
          )
        );
      }
    });

    // Listen for chat status updates (e.g., when a chat is accepted)
    socketRef.current.on('chat-status-update', ({ userId, status }) => {
      setChats((prev) =>
        prev.map((chat) => (chat.userId === userId ? { ...chat, status } : chat))
      );
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current?.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  // Scroll to the bottom of the chat window on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChatId]); // Reruns when chats or active chat changes

  const handleAcceptChat = (userId) => {
    socketRef.current.emit('accept-chat', { userId });
    setActiveChatId(userId);
    toast.success('চ্যাটটি গ্রহণ করা হয়েছে');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && activeChatId && isConnected) {
      // Send message only via socket
      socketRef.current.emit('admin-message', {
        userId: activeChatId,
        content: input.trim(),
      });
      setInput('');
    }
  };

  const activeChat = chats.find((c) => c.userId === activeChatId);
  const pendingChats = chats.filter((c) => c.status === 'pending');
  // Sort active chats by most recent message
  const activeSortedChats = chats.filter((c) => c.status === 'active').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="flex h-screen font-sans bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <aside className="w-1/3 xl:w-1/4 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center flex-shrink-0">
          <h1 className="text-xl font-bold text-indigo-500">অ্যাডমিন প্যানেল</h1>
          <div className="flex items-center gap-2 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            {isConnected ? 'সংযুক্ত' : 'সংযোগ বিচ্ছিন্ন'}
          </div>
        </header>
        <div className="overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2 mb-2"><Clock size={14} /> পেন্ডিং রিকোয়েস্ট ({pendingChats.length})</h2>
            {pendingChats.length > 0 ? pendingChats.map((chat) => (
              <div key={chat.userId} onClick={() => setActiveChatId(chat.userId)} className="p-3 my-2 rounded-lg cursor-pointer bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/40">
                <p className="font-semibold truncate text-sm">ইউজার আইডি: {chat.userId.substring(0, 8)}...</p>
                <button onClick={(e) => { e.stopPropagation(); handleAcceptChat(chat.userId); }} className="text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 rounded-full px-3 py-1 mt-2">চ্যাট গ্রহণ করুন</button>
              </div>
            )) : <p className="text-sm text-gray-400 mt-2">কোনো পেন্ডিং রিকোয়েস্ট নেই।</p>}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-500 uppercase flex items-center gap-2 mb-2"><UserCheck size={14} /> সক্রিয় চ্যাট ({activeSortedChats.length})</h2>
            {activeSortedChats.length > 0 ? activeSortedChats.map((chat) => (
              <div key={chat.userId} onClick={() => setActiveChatId(chat.userId)} className={`p-3 my-2 rounded-lg cursor-pointer transition-colors ${activeChatId === chat.userId ? 'bg-gray-200 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800/50'}`}>
                <p className="font-semibold truncate text-sm">ইউজার আইডি: {chat.userId.substring(0, 8)}...</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.messages.slice(-1)[0]?.content || 'কোনো মেসেজ নেই'}</p>
              </div>
            )) : <p className="text-sm text-gray-400 mt-2">কোনো সক্রিয় চ্যাট নেই।</p>}
          </div>
        </div>
      </aside>
      <main className="w-2/3 xl:w-3/4 h-full flex flex-col bg-gray-50 dark:bg-gray-950/50">
        {activeChat ? (
          <>
            <header className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-gray-900 flex-shrink-0">
              <h2 className="font-bold">চ্যাট করুন <span className="text-indigo-500">{activeChat.userId.substring(0, 8)}</span> এর সাথে</h2>
            </header>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {activeChat.messages.map((msg, idx) => (
                <div key={msg._id || idx} className={`flex items-end gap-2 ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center flex-shrink-0"><User size={16} className="text-gray-500" /></div>}
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${msg.sender === 'admin' ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 rounded-bl-none shadow-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center gap-4 flex-shrink-0">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="অ্যাডমিন হিসেবে আপনার উত্তর লিখুন..." className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500" disabled={!isConnected} />
              <button type="submit" className="bg-indigo-500 text-white rounded-lg p-3 hover:bg-indigo-600 disabled:bg-indigo-300 transition-colors" disabled={!input.trim() || !isConnected}><Send size={20} /></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center text-gray-500">
            <MessageCircle size={64} className="mb-4 text-gray-300 dark:text-gray-700" />
            <h2 className="text-xl font-semibold">একটি চ্যাট নির্বাচন করুন</h2>
            <p>মেসেজিং শুরু করার জন্য তালিকা থেকে একটি চ্যাট নির্বাচন করুন।</p>
          </div>
        )}
      </main>
    </div>
  );
}
