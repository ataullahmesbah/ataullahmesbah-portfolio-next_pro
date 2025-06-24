'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { 
  FaReact, 
  FaPython, 
  FaPlus,
  FaChartLine,
  FaVideo,
  FaShoppingCart,
  FaPlane
} from 'react-icons/fa';
import { 
  SiPostgresql, 
  SiRailway
} from 'react-icons/si';
import { 
  HiShieldCheck,
  HiServer
} from 'react-icons/hi';
import { 
  MdOutlineCampaign 
} from 'react-icons/md';
import { 
  RiNewspaperLine
} from 'react-icons/ri';
import { 
  AiOutlineShareAlt 
} from 'react-icons/ai';

const ServiceBox = ({ icon, title, url, showDeployed = false, connections = [] }) => {
  const lineColors = [
    'border-blue-400/80',
    'border-purple-400/80',
    'border-emerald-400/80',
    'border-amber-400/80',
    'border-rose-400/80',
    'border-cyan-400/80'
  ];

  return (
    <motion.div
      className="relative w-full h-16 sm:h-20 border border-white/20 rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all duration-300 hover:border-white/40 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.03 }}
    >
      {connections.map((dir, i) => (
        <div 
          key={i}
          className={`absolute border-t border-dashed ${lineColors[i % lineColors.length]} ${
            dir === 'top' ? 'top-0 w-full' :
            dir === 'right' ? 'right-0 h-full' :
            dir === 'bottom' ? 'bottom-0 w-full' :
            'left-0 h-full'
          }`}
          style={{
            [dir === 'top' || dir === 'bottom' ? 'width' : 'height']: 'calc(100% + 16px)',
            [dir]: '-8px',
            borderWidth: '1.5px'
          }}
        />
      ))}

      <div className="text-lg sm:text-xl text-blue-300">
        {icon}
      </div>
      <h3 className="font-medium text-white text-[0.6rem] sm:text-[0.7rem] uppercase tracking-tight">
        {title}
      </h3>
      {url && (
        <p className="text-[0.45rem] sm:text-[0.55rem] text-gray-300 font-mono mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {url.replace(/(https?:\/\/)/, '')}
        </p>
      )}
      {showDeployed && (
        <div className="absolute bottom-0.5 right-1 text-[0.45rem] sm:text-[0.5rem] text-green-400">
          Deployed
        </div>
      )}
    </motion.div>
  );
};

const RightSideBanner = () => {
  return (
    <div className="w-full p-3 sm:p-4 relative">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-w-5xl mx-auto">
        
        {/* Development Services */}
        <div className="col-span-1">
          <ServiceBox
            icon={<FaReact className="text-blue-400" />}
            title="Develop"
            url="frontend-prod.up.railway.app"
            showDeployed={true}
            connections={['bottom']}
          />
        </div>
        
        <div className="col-span-1">
          <ServiceBox
            icon={<HiServer className="text-blue-400" />}
            title="Backend"
            showDeployed={true}
            connections={['bottom']}
          />
        </div>
        
        <div className="col-span-1">
          <ServiceBox
            icon={<SiPostgresql className="text-blue-400" />}
            title="Frontend"
            showDeployed={true}
            connections={['bottom']}
          />
        </div>

        {/* Analytics */}
        <div className="col-span-1">
          <ServiceBox
            icon={<FaChartLine className="text-purple-400" />}
            title="Analytics"
            url="ackee-prod.up.railway.app"
            connections={['bottom', 'right']}
          />
        </div>

        {/* Content Services */}
        <div className="col-span-1 sm:col-start-1">
          <ServiceBox
            icon={<FaVideo className="text-rose-400" />}
            title="Video Edit"
            connections={['top', 'right']}
          />
        </div>
        
        <div className="col-span-1">
          <ServiceBox
            icon={<HiShieldCheck className="text-rose-400" />}
            title="Production"
            connections={['left', 'bottom']}
          />
        </div>

        {/* Marketing */}
        <div className="col-span-1 sm:col-start-2">
          <ServiceBox
            icon={<MdOutlineCampaign className="text-amber-400" />}
            title="Marketing"
            connections={['top', 'right']}
          />
        </div>
        
        <div className="col-span-1">
          <ServiceBox
            icon={<FaPlane className="text-emerald-400" />}
            title="Travel"
            connections={['left', 'right']}
          />
        </div>

        {/* E-commerce */}
        <div className="col-span-1">
          <ServiceBox
            icon={<FaShoppingCart className="text-cyan-400" />}
            title="Ecommerce"
            connections={['top']}
          />
        </div>
        
        <div className="col-span-1">
          <ServiceBox
            icon={<AiOutlineShareAlt className="text-purple-400" />}
            title="Affiliate"
            connections={['top']}
          />
        </div>
        
        <div className="col-span-1">
          <ServiceBox
            icon={<RiNewspaperLine className="text-gray-400" />}
            title="Newsletter"
          />
        </div>
      </div>
    </div>
  );
};

export default RightSideBanner;