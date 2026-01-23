'use client';
import { motion } from 'framer-motion';
import useAOS from '../hooks/useAOS';


const sponsors = [
  { name: 'Hyascka', category: 'Digital Services' },
  { name: 'SOOQRA ONE', category: 'E-commerce' },
  { name: 'Trekking Diaries', category: 'Adventure Community' },
  { name: 'Trek Explore Travel', category: 'Tour Operator' },
  { name: 'Mesbah Off We Go', category: 'Travel Vlog' },
  { name: 'Masterminds Sporting', category: 'Football Academy' },
  { name: 'Deen Halal', category: 'Islamic Brand' },
  { name: 'FCTB', category: 'Travel Group' }
];



const Sponser = () => {

  useAOS({ duration: 1000 });

  return (
    <section className="py-12 md:py-16 overflow-hidden relative bg-gradient-to-b from-gray-900/30 to-gray-900/10">
      {/* Section border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gray-700/50 to-transparent"></div>

      <div

        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 md:mb-12 text-center"
        >
          <h2
            data-aos="fade-up"
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-500 mb-2">
            Strategic Partners
          </h2>
          <div className="relative inline-block">
            <p
              data-aos="flip-left"
              className="text-gray-400/80 max-w-xl mx-auto text-xs md:text-sm relative z-10 px-2">
              Premium brands I’ve collaborated with to create exceptional digital experiences
            </p>
            {/* Single dotted line */}
            <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden mt-2">
              <div
                className="h-full w-full bg-repeat-x"
                style={{
                  backgroundImage: 'linear-gradient(90deg, rgba(56,182,255,0.3) 50%, transparent 50%)',
                  backgroundSize: '6px 1px'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Marquee with compact boxes */}
        <div
          data-aos="zoom-in"
          className="relative overflow-hidden py-2">
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <motion.div
                key={`sponsor-${index}`}
                className="inline-flex mx-2 px-4 py-3 bg-gray-900/60 backdrop-blur-sm rounded-lg border border-gray-800/60 items-center justify-center min-w-[160px] h-[80px] relative group hover:border-purple-400/40 hover:shadow-[0_0_15px_rgba(56,182,255,0.08)] transition-all duration-300"
                whileHover={{
                  y: -3,
                  backgroundColor: 'rgba(17, 24, 39, 0.7)',
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-center px-2">
                  <h3 className="text-base font-medium text-gray-100 ">{sponsor.name}</h3>
                  <p className="text-[11px] text-gray-400/80 mt-1 uppercase tracking-wider">{sponsor.category}</p>
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