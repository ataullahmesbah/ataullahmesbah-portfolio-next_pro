'use client';
import { useState, useEffect, useRef } from 'react';
import { FaClock, FaPaw, FaStar, FaGift } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';

// Game state management with Zustand
const useGameStore = create((set) => ({
  score: 0,
  characters: [],
  isCelebrating: false,
  setScore: (score) => set({ score }),
  setCharacters: (characters) => set({ characters }),
  setIsCelebrating: (isCelebrating) => set({ isCelebrating }),
  resetGame: () => set({ score: 0, characters: [], isCelebrating: false }),
}));

export default function CosmicCountdownBash() {
  const [showGame, setShowGame] = useState(false);
  const [targetDate, setTargetDate] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [error, setError] = useState('');
  const gameRef = useRef(null);
  const frameRef = useRef(null);

  const { score, characters, isCelebrating, setScore, setCharacters, setIsCelebrating, resetGame } = useGameStore();

  // Countdown and game logic
  useEffect(() => {
    if (!showGame || !targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;

      if (diff <= 0) {
        setIsCelebrating(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const spawnCharacter = () => {
      const newCharacter = {
        id: Date.now(),
        x: Math.random() * (gameRef.current?.offsetWidth - 50),
        y: Math.random() * (gameRef.current?.offsetHeight - 50),
        type: Math.random() > 0.5 ? 'cat' : 'star',
      };
      setCharacters([...characters, newCharacter]);
      setTimeout(() => {
        setCharacters(characters.filter((c) => c.id !== newCharacter.id));
      }, 2000);
    };

    const updateGame = () => {
      calculateTimeLeft();
      if (Math.random() < 0.05 * (1 + score / 1000)) {
        spawnCharacter();
      }
      frameRef.current = requestAnimationFrame(updateGame);
    };

    frameRef.current = requestAnimationFrame(updateGame);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [showGame, targetDate, characters, score, setCharacters]);

  // Handle character click
  const handleCharacterClick = (id) => {
    setScore(score + 10);
    setCharacters(characters.filter((c) => c.id !== id));
  };

  // Handle date input
  const handleDateSubmit = (e) => {
    e.preventDefault();
    const inputDate = e.target.elements.date.value;
    const target = new Date(inputDate);
    const now = new Date();
    if (target <= now) {
      setError('Please select a future date!');
      return;
    }
    setError('');
    setTargetDate(inputDate);
    setShowGame(true);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Header Section */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900 rounded-2xl shadow-lg shadow-blue-500/20 p-6 mb-8 flex flex-col md:flex-row justify-between items-center"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white flex items-center gap-3">
            <FaClock className="text-blue-400" />
            Cosmic Countdown Bash!
          </h1>
          <p className="text-blue-200 mt-2 text-sm md:text-base">
            Set a date and party with glowing characters!
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowGame(!showGame)}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300 shadow-md shadow-blue-500/30"
        >
          <FaStar /> {showGame ? 'Hide Party' : 'Start Party'}
        </motion.button>
      </motion.header>

      {/* Date Input or Game Area */}
      <AnimatePresence>
        {!showGame ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-gray-900 rounded-2xl shadow-lg shadow-blue-500/20 p-6 mb-8 max-w-md mx-auto"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Set Your Countdown Date</h2>
            <form onSubmit={handleDateSubmit}>
              <input
                type="date"
                name="date"
                className="w-full p-3 border-2 border-blue-700 rounded-lg bg-gray-800 text-white focus:outline-none focus:border-blue-400"
                required
              />
              {error && <p className="text-red-400 mt-2">{error}</p>}
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold mt-4"
              >
                Start Countdown!
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-10"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-white">
                <FaPaw className="text-blue-400" /> Cosmic Party
              </h2>
              <div className="text-lg sm:text-xl font-semibold text-white">
                Score: <span className="text-blue-400">{score}</span>
              </div>
            </div>

            <div
              ref={gameRef}
              className="relative w-full h-64 sm:h-80 md:h-96 bg-gradient-to-b from-black to-blue-950 rounded-2xl overflow-hidden border-2 border-blue-800 shadow-inner shadow-blue-500/20"
            >
              {/* Animated Glowing Stars Background */}
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-300 rounded-full"
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

              {/* Countdown Display */}
              <motion.div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center"
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: [
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.8)',
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                  ],
                  transition: { duration: 1, repeat: Infinity },
                }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-white">
                  {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </p>
                <p className="text-sm text-blue-200">Until {new Date(targetDate).toLocaleDateString()}</p>
              </motion.div>

              {/* Funny Characters */}
              {characters.map((char) => (
                <motion.div
                  key={char.id}
                  className={`absolute w-12 h-12 cursor-pointer ${
                    char.type === 'cat' ? 'text-blue-400' : 'text-yellow-300'
                  }`}
                  style={{ left: `${char.x}px`, top: `${char.y}px` }}
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: char.type === 'cat' ? [0, 360] : [0, -360],
                    boxShadow: [
                      '0 0 10px rgba(59, 130, 246, 0.5)',
                      '0 0 20px rgba(59, 130, 246, 0.8)',
                      '0 0 10px rgba(59, 130, 246, 0.5)',
                    ],
                    transition: { duration: 1.5, repeat: Infinity },
                  }}
                  onClick={() => handleCharacterClick(char.id)}
                >
                  {char.type === 'cat' ? (
                    <FaPaw className="text-4xl" />
                  ) : (
                    <FaStar className="text-4xl" />
                  )}
                </motion.div>
              ))}

              {/* Celebration Screen */}
              <AnimatePresence>
                {isCelebrating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center"
                  >
                    <div className="bg-gray-900 p-8 rounded-2xl text-center shadow-xl shadow-blue-500/30">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
                        🎉 Cosmic Celebration! 🎉
                      </h3>
                      <p className="mb-4 text-lg text-blue-200">Party Score: {score}</p>
                      <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          resetGame();
                          setShowGame(false);
                          setTargetDate('');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition-colors duration-300"
                      >
                        New Countdown
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}