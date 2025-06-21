'use client';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import React, { useRef } from 'react';
import { FaPython, FaNodeJs } from 'react-icons/fa';
import { SiPostgresql, SiRedis } from 'react-icons/si';
import { HiShieldCheck } from 'react-icons/hi';
import { TbWorld } from 'react-icons/tb';
import { FiZap, FiLink } from 'react-icons/fi';

// Service Card Component
const ServiceCard = ({ icon, title, aX, aY }) => (
  <motion.div
    style={{ x: aX, y: aY }}
    className="group p-4 bg-gray-800/60 border border-white/10 rounded-xl shadow-2xl backdrop-blur-lg flex items-center gap-3 transform transition-all duration-300 hover:!scale-110 hover:shadow-blue-500/30"
  >
    <div className="text-2xl text-blue-400 transition-colors group-hover:text-blue-300">{icon}</div>
    <span className="font-semibold text-gray-200">{title}</span>
  </motion.div>
);

// Animated Path Component for precise control
const AnimatedPath = ({ d, stroke, dash, delay, marker, midpointIcon }) => {
    const pathRef = useRef(null);
    const [midpoint, setMidpoint] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        if (pathRef.current && midpointIcon) {
            const path = pathRef.current;
            const mid = path.getPointAtLength(path.getTotalLength() / 2);
            setMidpoint({ x: mid.x, y: mid.y });
        }
    }, [midpointIcon]);

    return (
        <>
            <motion.path
                ref={pathRef}
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={dash}
                markerEnd={marker}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: delay, ease: "circOut" }}
            />
            {midpointIcon && (
                <motion.foreignObject
                    x={midpoint.x - 12} y={midpoint.y - 12}
                    width="24" height="24"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: delay + 0.7 }}
                >
                    <div className="midpoint-icon">{midpointIcon}</div>
                </motion.foreignObject>
            )}
        </>
    );
};

const RightSideBanner = () => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const mX = useSpring(useTransform(x, [-1, 1], [-15, 15]), springConfig);
  const mY = useSpring(useTransform(y, [-1, 1], [-15, 15]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    x.set(((e.clientX - left) / width) * 2 - 1);
    y.set(((e.clientY - top) / height) * 2 - 1);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const cardX = (factor) => useSpring(useTransform(mX, (v) => v * factor), springConfig);
  const cardY = (factor) => useSpring(useTransform(mY, (v) => v * factor), springConfig);
  
  return (
    <>
      <style jsx>{`
        .world-icon-wrapper { animation: pulse-glow 3s infinite ease-in-out; }
        .midpoint-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 24px;
          height: 24px;
          background-color: rgba(30, 41, 59, 0.8); /* bg-slate-800 */
          border-radius: 9999px;
          color: #60a5fa; /* text-blue-400 */
          box-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
          animation: pulse-icon 2.5s infinite ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 3px rgba(96, 165, 250, 0.4)); }
          50% { filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.8)); }
        }
        @keyframes pulse-icon {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
      `}</style>

      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
        className="w-full h-[500px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
      >
        <motion.div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
            
          {/* SVG Container for Connections */}
          <motion.svg className="absolute inset-0 w-full h-full" style={{ transform: "translateZ(-30px)" }}>
            <defs>
              <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#60a5fa" /></linearGradient>
              <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#a78bfa" /></linearGradient>
              <marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="url(#purple-gradient)" /></marker>
            </defs>
            
            {/* Instruction-based Paths */}
            <AnimatedPath d="M 90 200 V 50" stroke="url(#blue-gradient)" dash="8 8" delay={0.2} />
            <AnimatedPath d="M 90 205 H 280 V 75" stroke="url(#purple-gradient)" dash="1 8" delay={0.4} marker="url(#arrow-head)" />
            <AnimatedPath d="M 300 65 V 15" stroke="url(#blue-gradient)" dash="8 8" delay={0.6} />
            <AnimatedPath d="M 310 75 V 225 H 480" stroke="url(#purple-gradient)" dash="1 8" delay={0.8} marker="url(#arrow-head)" />
            <AnimatedPath d="M 500 220 V 170" stroke="url(#blue-gradient)" dash="8 8" delay={1.0} />
            <AnimatedPath d="M 100 215 H 120 V 400" stroke="url(#blue-gradient)" dash="none" delay={1.2} marker="url(#arrow-head)" midpointIcon={<FiZap size={12} />} />
            <AnimatedPath d="M 320 80 V 250 H 420 V 430" stroke="url(#purple-gradient)" dash="none" delay={1.4} marker="url(#arrow-head)" midpointIcon={<FiLink size={12}/>}/>
          </motion.svg>
          
          {/* World Icons at path ends */}
          <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay: 1.8}} className="absolute world-icon-wrapper" style={{left: '16%', top: '8%'}}><TbWorld className="text-xl text-blue-300"/></motion.div>
          <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay: 2.2}} className="absolute world-icon-wrapper" style={{left: '50%', top: '1%'}}><TbWorld className="text-xl text-blue-300"/></motion.div>
          <motion.div initial={{opacity:0, scale:0.5}} animate={{opacity:1, scale:1}} transition={{delay: 2.6}} className="absolute world-icon-wrapper" style={{right: '15%', top: '32%'}}><TbWorld className="text-xl text-blue-300"/></motion.div>

          {/* Service Cards (Rendered on top of lines) */}
          <div className="absolute z-10" style={{top: '35%', left: '10%'}}><ServiceCard icon={<HiShieldCheck />} title="Gateway" aX={cardX(1.1)} aY={cardY(1.1)} /></div>
          <div className="absolute z-10" style={{top: '10%', left: '45%'}}><ServiceCard icon={<FaNodeJs />} title="Frontend" aX={cardX(0.7)} aY={cardY(0.7)} /></div>
          <div className="absolute z-10" style={{top: '40%', right: '10%'}}><ServiceCard icon={<FaPython />} title="Backend" aX={cardX(1)} aY={cardY(1)} /></div>
          <div className="absolute z-10" style={{bottom: '15%', left: '18%'}}><ServiceCard icon={<SiPostgresql />} title="Database" aX={cardX(0.8)} aY={cardY(0.8)} /></div>
          <div className="absolute z-10" style={{bottom: '10%', right: '25%'}}><ServiceCard icon={<SiRedis />} title="Cache" aX={cardX(1.2)} aY={cardY(1.2)} /></div>

        </motion.div>
      </motion.div>
    </>
  );
};

export default RightSideBanner;
