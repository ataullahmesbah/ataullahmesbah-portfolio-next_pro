'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaReact, FaPlane, FaStar, FaCode, FaSuitcase } from 'react-icons/fa';
import { SiNextdotjs, SiTailwindcss } from 'react-icons/si';

const RightSideBanner = () => {
  const [activeItem, setActiveItem] = useState(null);

  const techStack = [
    { icon: <SiNextdotjs className="text-2xl" />, name: "Next.js", color: "bg-gray-700 border-gray-500" },
    { icon: <FaReact className="text-2xl" />, name: "React", color: "bg-blue-900/50 border-blue-400" },
    { icon: <SiTailwindcss className="text-2xl" />, name: "Tailwind", color: "bg-cyan-900/50 border-cyan-400" },
    { icon: <FaPlane className="text-2xl" />, name: "Travel", color: "bg-green-900/50 border-green-400" },
    { icon: <FaStar className="text-2xl" />, name: "Featured", color: "bg-yellow-900/50 border-yellow-400" },
    { icon: <FaCode className="text-2xl" />, name: "Projects", color: "bg-purple-900/50 border-purple-400" },
    { icon: <FaSuitcase className="text-2xl" />, name: "Work", color: "bg-red-900/50 border-red-400" },
  ];

  return (
    <div className="w-full lg:w-1/2 flex justify-center items-center ">
      <div className="relative w-full max-w-md h-full">
        {/* Center Display */}
        <motion.div 
          className="absolute inset-0 m-auto w-40 h-40 bg-gray-800/80 backdrop-blur-sm rounded-xl border-2 border-cyan-400/50 shadow-lg flex items-center justify-center z-10"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center p-4">
            <p className="text-sm text-cyan-400 mb-1">Specializing in</p>
            <h3 className="text-xl font-bold text-white">
              {activeItem?.name || "My Skills"}
            </h3>
          </div>
        </motion.div>

        {/* Circular Tech Items */}
        {techStack.map((tech, index) => {
          const angle = (index * 360) / techStack.length;
          const radian = (angle * Math.PI) / 180;
          const radius = 140;
          const x = radius * Math.cos(radian);
          const y = radius * Math.sin(radian);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{ opacity: 1, x, y }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.2,
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                borderColor: '#22d3ee'
              }}
              className={`absolute left-1/2 top-1/2 w-16 h-16 -mt-8 -ml-8 rounded-full border-2 ${tech.color} flex items-center justify-center cursor-pointer shadow-md transition-all`}
              onMouseEnter={() => setActiveItem(tech)}
              onMouseLeave={() => setActiveItem(null)}
            >
              <motion.div
                animate={{ rotate: activeItem === tech ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {tech.icon}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Animated Background Circle */}
        <motion.div 
          className="absolute inset-0 m-auto w-72 h-72 rounded-full border border-dashed border-gray-600/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default RightSideBanner;