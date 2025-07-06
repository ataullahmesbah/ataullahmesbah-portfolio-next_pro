'use client';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaUsers, FaCheckCircle, FaUserFriends, FaChartLine, FaCode, FaPenAlt } from 'react-icons/fa';
import DynamicButton from '../../Share/Button/DynamicButton/DynamicButton';

const NewSection = () => {
  const stats = [
    { icon: <FaGlobeAmericas className="text-xl sm:text-2xl md:text-3xl" />, value: "23+", label: "Countries" },
    { icon: <FaUsers className="text-xl sm:text-2xl md:text-3xl" />, value: "41+", label: "Clients" },
    { icon: <FaCheckCircle className="text-xl sm:text-2xl md:text-3xl" />, value: "65+", label: "Projects Completed" },
    { icon: <FaUserFriends className="text-xl sm:text-2xl md:text-3xl" />, value: "9+", label: "Team Members" },
  ];

  const projects = [
    {
      title: "SEO Expert Projects",
      description: "Offering top-tier SEO consultancy and services that help businesses rank higher and generate organic traffic through targeted strategies.",
      icon: <FaChartLine className="text-xl sm:text-2xl md:text-3xl" />,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "Web Development",
      description: "Delivering modern and scalable web development solutions, specializing in custom websites and full-stack development for diverse industries.",
      icon: <FaCode className="text-xl sm:text-2xl md:text-3xl" />,
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Content Creation",
      description: "Crafting engaging and compelling content that aligns with brand strategy, driving user engagement, and promoting business growth.",
      icon: <FaPenAlt className="text-xl sm:text-2xl md:text-3xl" />,
      color: "from-pink-600 to-rose-600",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-8 sm:py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-5">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Achievements</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Projects</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl mx-auto">
            Empowering businesses to reach new heights with unparalleled dedication and innovative solutions.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Left Side - Statistics */}
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-10 border border-gray-700 h-full">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6 md:mb-8">By The Numbers</h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-gray-900/50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-gray-700 hover:border-cyan-400 transition-all h-full"
                  >
                    <div className="text-cyan-400 mb-2 sm:mb-3">{stat.icon}</div>
                    <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">{stat.value}</h4>
                    <p className="text-gray-400 text-xs sm:text-sm md:text-base">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Projects */}
          <div className="md:w-1/2 flex flex-col gap-6 md:gap-8">
            {/* Top Full Width Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl md:rounded-2xl overflow-hidden h-full">
                <div className="bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 h-full flex flex-col">
                  <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                    <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                      {projects[0].icon}
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-white">{projects[0].title}</h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base flex-1">{projects[0].description}</p>
                  <DynamicButton text="View Projects" alignment="left" className="w-fit mt-4 sm:mt-6 md:mt-8" />
                </div>
              </div>
            </motion.div>

            {/* Bottom Two Cards */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 flex-1">
              {/* Web Development Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl md:rounded-2xl overflow-hidden h-full">
                  <div className="bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 h-full flex flex-col">
                    <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {projects[1].icon}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-white">{projects[1].title}</h3>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base flex-1">{projects[1].description}</p>
                    <DynamicButton text="View Projects" alignment="left" className="w-fit mt-4 sm:mt-6 md:mt-8" />
                  </div>
                </div>
              </motion.div>

              {/* Content Creation Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl md:rounded-2xl overflow-hidden h-full">
                  <div className="bg-gray-900/80 backdrop-blur-sm p-6 sm:p-8 md:p-10 h-full flex flex-col">
                    <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                        {projects[2].icon}
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl font-bold text-white">{projects[2].title}</h3>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm md:text-base flex-1">{projects[2].description}</p>
                    <DynamicButton text="View Projects" alignment="left" className="w-fit mt-4 sm:mt-6 md:mt-8" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewSection;