// components/Sponser.js
'use client';

import { motion } from 'framer-motion';

const sponsors = [
  { name: 'Hyascka', category: 'Digital Services' },
  { name: 'Trekking Diaries', category: 'Adventure Community' },
  { name: 'Trek Explore Travel', category: 'Tour Operator' },
  { name: 'Mesbah Off We Go', category: 'Travel Vlog' },
  { name: 'Masterminds Sporting', category: 'Football Academy' },
  { name: 'Deen Halal', category: 'Islamic Brand' },
  { name: 'FCTB', category: 'Travel Group' }
];

const Sponser = () => {
  return (
    <section className="py-16 overflow-hidden relative ">
      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-32  to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32  to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 mb-2">
            Strategic Partners
          </h2>
          <p className="text-gray-400/80 max-w-xl mx-auto text-sm">
            Premium brands I’ve collaborated with to create exceptional digital experiences
          </p>
        </motion.div>

        {/* Enhanced Marquee */}
        <div className="relative overflow-hidden py-2">
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <motion.div
                key={`sponsor-${index}`}
                className="inline-flex mx-3 px-6 py-3 bg-gray-900 rounded-lg border border-gray-800 items-center justify-center min-w-[180px] h-[80px] relative group"
                whileHover={{
                  y: -3,
                  borderColor: '#38bdf8',
                  backgroundColor: 'rgba(17, 24, 39, 0.8)',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-center">
                  <h3 className="text-[15px] font-medium text-gray-200 leading-tight">{sponsor.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{sponsor.category}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sponser;