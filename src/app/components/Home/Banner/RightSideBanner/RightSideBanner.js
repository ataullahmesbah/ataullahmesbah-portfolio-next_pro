'use client';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaPython } from 'react-icons/fa';
import { SiPostgresql } from 'react-icons/si';
import { IoLogoJavascript } from 'react-icons/io5';
import { VscGithubAlt } from 'react-icons/vsc';
import { TbWorld } from 'react-icons/tb';
import { HiShieldCheck } from 'react-icons/hi';
import { FiDatabase } from 'react-icons/fi';

const RightSideBanner = () => {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.5 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 100, 
        damping: 10 
      } 
    }
  };

  // Service data
  const services = [
    {
      id: 1,
      icon: <IoLogoJavascript className="text-yellow-400 text-xl" />,
      title: "frontend",
      url: "frontend-prod.up.railway.app",
      position: "top-0 right-[10%]"
    },
    {
      id: 2,
      icon: <VscGithubAlt className="text-purple-400 text-xl" />,
      title: "ackee analytics",
      url: "ackee-prod.up.railway.app",
      position: "top-[20%] left-0"
    },
    {
      id: 3,
      icon: <HiShieldCheck className="text-blue-400 text-xl" />,
      title: "api gateway",
      url: "api-prod.up.railway.app",
      position: "top-[32%] right-0"
    },
    {
      id: 4,
      icon: <FaPython className="text-blue-400 text-xl" />,
      title: "backend",
      url: "",
      position: "bottom-[18%] right-[15%]"
    },
    {
      id: 5,
      icon: <SiPostgresql className="text-blue-400 text-xl" />,
      title: "postgres",
      url: "",
      position: "bottom-0 left-[15%]",
      subItem: <div className="flex items-center gap-1 text-sm text-gray-400 mt-2 pt-2 border-t border-gray-700">
        <FiDatabase /> pg-data
      </div>
    }
  ];

  return (
    <motion.div 
      className="relative w-full lg:w-3/5 h-[600px] lg:h-[600px]" 
      variants={container} 
      initial="hidden" 
      animate="visible"
    >
      <div className="absolute inset-0 rounded-xl bg-gray-800/50 border border-gray-700/50 backdrop-blur-sm overflow-hidden">
        {/* Decorative Elements */}
        <TbWorld className="absolute text-2xl text-gray-600 top-[-40px] right-[20%]" />
        <TbWorld className="absolute text-2xl text-gray-600 top-[18%] right-[-2%]" />
        <TbWorld className="absolute text-2xl text-gray-600 top-[-40px] left-[20%]" />
        
        <div className="absolute top-[-20px] left-[22%] [writing-mode:vertical-rl] text-xs text-gray-700 leading-loose">vvvvvvvvvvvvvvv</div>
        <div className="absolute top-[-20px] right-[22%] [writing-mode:vertical-rl] text-xs text-gray-700 leading-loose">vvvvvvvvvvvvvvv</div>
        <div className="absolute top-[22%] right-0 [writing-mode:vertical-rl] text-xs text-gray-700 leading-loose">vvvvvvvvvvvvvvv</div>

        <HiShieldCheck className="absolute text-2xl text-blue-400 top-[28%] right-[40%] p-2 rounded-full bg-blue-900/30 shadow-lg" />
        <FiDatabase className="absolute text-2xl text-blue-400 bottom-[25%] left-[30%] p-2 rounded-full bg-blue-900/30 shadow-lg" />

        {/* SVG Connections */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d="M 420 50 C 350 70, 320 120, 300 150" stroke="#33333d" strokeWidth="1.5" fill="none" />
          <path d="M 110 130 C 180 140, 220 120, 280 150" stroke="#33333d" strokeWidth="1.5" fill="none" />
          <path d="M 460 195 C 400 200, 320 200, 300 160" stroke="#33333d" strokeWidth="1.5" fill="none" />
          <path d="M 415 340 C 350 330, 280 320, 260 290" stroke="#33333d" strokeWidth="1.5" fill="none" />
          <path d="M 180 430 C 200 380, 220 320, 245 295" stroke="#33333d" strokeWidth="1.5" fill="none" />
          <path d="M 295 160 C 250 200, 250 250, 255 280" stroke="#60a5fa" strokeWidth="2" fill="none" strokeDasharray="4 4" filter="url(#glow)" />
        </svg>

        {/* Service Boxes */}
        {services.map((service, index) => (
          <motion.div 
            key={service.id}
            className={`absolute bg-gray-800 border border-gray-700 rounded-lg p-4 w-[220px] shadow-lg ${service.position}`}
            variants={item}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-center gap-2 mb-1">
              {service.icon}
              <span className="font-medium">{service.title}</span>
            </div>
            {service.url && (
              <p className="text-sm text-gray-400 mb-2">{service.url}</p>
            )}
            <div className="flex items-center gap-1 text-sm text-green-400">
              <FaCheckCircle /> Just deployed
            </div>
            {service.subItem}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RightSideBanner;