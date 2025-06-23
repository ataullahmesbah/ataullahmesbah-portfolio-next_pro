'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { FaPython, FaNodeJs } from 'react-icons/fa';
import { SiPostgresql } from 'react-icons/si';
import { HiShieldCheck } from 'react-icons/hi';
import { FiBarChart2 } from 'react-icons/fi';

// --- Sub-Components for Clarity ---

// New "Aurora" Style Service Card
const ServiceCard = ({ icon, title, position }) => (
  <motion.div
    style={position}
    className="absolute group p-1 bg-gradient-to-br from-white/20 to-white/0 rounded-xl shadow-2xl transform -translate-x-1/2 -translate-y-1/2"
    whileHover={{ scale: 1.05, zIndex: 50 }}
    transition={{ type: 'spring', stiffness: 300, damping: 15 }}
  >
    <div className="bg-gray-800/80 backdrop-blur-md rounded-[10px] p-4 flex items-center gap-3 w-[200px]">
      <div className="p-2 bg-gray-900/50 rounded-lg text-2xl text-blue-400">
        {icon}
      </div>
      <span className="font-bold text-gray-200 tracking-wide">{title}</span>
    </div>
  </motion.div>
);

// Path component with precise styling
const AnimatedPath = ({ d, stroke, dash, delay, marker }) => (
  <motion.path
    d={d}
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeDasharray={dash}
    markerEnd={marker}
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    transition={{ duration: 2, delay, ease: [0.42, 0, 0.58, 1] }}
    style={{ animation: 'pulse-line 3s infinite ease-in-out', animationDelay: `${delay}s` }}
  />
);


// --- Main RightSideBanner Component ---

const RightSideBanner = () => {
  // A fixed-size container is essential for a predictable SVG coordinate system.
  const containerWidth = 600;
  const containerHeight = 400;

  // Pixel-based positions for cards and the central shield.
  const positions = {
    ackee: { top: 30, left: 100 },
    frontend: { top: 30, left: 300 },
    apiGateway: { top: 30, left: 500 },
    postgres: { top: 370, left: 100 },
    backend: { top: 370, left: 500 },
    shield: { top: 200, left: 300 }
  };

  return (
    <>
      {/* Custom CSS for Advanced Animations */}
      <style jsx>{`
        @keyframes pulse-shield {
          0%, 100% {
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.8));
          }
        }
        @keyframes pulse-line {
          0%, 100% { stroke-opacity: 0.7; }
          50% { stroke-opacity: 1; }
        }
        .center-shield {
          animation: pulse-shield 3s infinite ease-in-out;
        }
      `}</style>

      <motion.div
        className="relative flex items-center justify-center"
        style={{ width: containerWidth, height: containerHeight }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      >
        {/* SVG Container for all the lines and arrows */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${containerWidth} ${containerHeight}`}>
          <defs>
            <linearGradient id="blue-gradient"><stop stopColor="#3b82f6" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
            <linearGradient id="purple-gradient"><stop stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient>
            <linearGradient id="green-gradient"><stop stopColor="#22c55e" /><stop offset="100%" stopColor="#4ade80" /></linearGradient>
            <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="url(#green-gradient)" /></marker>
          </defs>
          
          {/* Paths drawn based on your precise instructions */}
          {/* 1. ackee (100,30) -> shield (300,200) - DOTTED */}
          <AnimatedPath d="M 100 30 C 150 100, 250 150, 300 200" stroke="url(#blue-gradient)" dash="1 10" delay={0.2} />
          {/* 2. frontend (300,30) -> shield (300,200) - DASHED */}
          <AnimatedPath d="M 300 30 V 200" stroke="url(#purple-gradient)" dash="10 10" delay={0.4} />
          {/* 3. backend (500,370) -> api gateway (500,30) - SOLID */}
          <AnimatedPath d="M 500 370 V 30" stroke="url(#green-gradient)" dash="none" delay={0.6} marker="url(#arrowhead)" />
        </svg>

        {/* Central Shield Icon - The focal point */}
        <motion.div
            className="absolute center-shield"
            style={{ 
                left: positions.shield.left, 
                top: positions.shield.top,
                transform: 'translate(-50%, -50%)'
            }}
        >
          <HiShieldCheck className="text-8xl text-blue-400" />
        </motion.div>
          
        {/* Service Cards rendered on top */}
        <ServiceCard icon={<FiBarChart2 />} title="ackee analytics" position={positions.ackee} />
        <ServiceCard icon={<FaNodeJs />} title="frontend" position={positions.frontend} />
        <ServiceCard icon={<HiShieldCheck />} title="api gateway" position={positions.apiGateway} />
        <ServiceCard icon={<SiPostgresql />} title="postgres" position={positions.postgres} />
        <ServiceCard icon={<FaPython />} title="backend" position={positions.backend} />
      </motion.div>
    </>
  );
};

export default RightSideBanner;
