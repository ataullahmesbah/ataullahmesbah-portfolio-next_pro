'use client';
import { motion } from 'framer-motion';
import { FaRocket, FaStar, FaSmileWink } from 'react-icons/fa';

const UserDashboardLayout = ({ children }) => {
  return (
    <div className="grid grid-cols-12 min-h-screen bg-gradient-to-br from-black to-blue-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="col-span-12 md:col-span-3 bg-gray-900 text-white p-6 flex flex-col justify-between"
      >
        <div>
          <motion.h2
            className="text-2xl sm:text-3xl font-extrabold mb-4 flex items-center gap-3 text-blue-200"
            animate={{
              scale: [1, 1.05, 1],
              textShadow: [
                '0 0 10px rgba(59, 130, 246, 0.5)',
                '0 0 20px rgba(59, 130, 246, 0.8)',
                '0 0 10px rgba(59, 130, 246, 0.5)',
              ],
              transition: { duration: 2, repeat: Infinity },
            }}
          >
            <FaRocket className="text-blue-400" />
            Cosmic Dashboard Party!
          </motion.h2>
          <p className="text-blue-300 mb-6">
            Yo, this dashboard is <span className="font-bold text-yellow-300">super fun</span> and ready to blast off! 🚀
          </p>
          <motion.div
            className="flex gap-4"
            animate={{
              y: [0, -10, 0],
              transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <FaStar className="text-yellow-300 text-2xl" />
            <FaSmileWink className="text-blue-400 text-2xl" />
            <FaStar className="text-yellow-300 text-2xl" />
          </motion.div>
        </div>
        <motion.div
          className="mt-4"
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
        >
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-md shadow-blue-500/30">
            Join the Cosmic Fun!
          </button>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="col-span-12 md:col-span-9 p-6 bg-gray-800 bg-opacity-80 backdrop-blur-sm"
      >
        {/* Animated Background Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
                transition: { duration: 2 + Math.random() * 3, repeat: Infinity },
              }}
            />
          ))}
        </div>
        {children} {/* Dynamic content will load here */}
      </motion.div>
    </div>
  );
};

export default UserDashboardLayout;