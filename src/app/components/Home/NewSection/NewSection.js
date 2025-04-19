'use client';
import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaUsers, FaCheckCircle, FaUserFriends, FaChartLine, FaCode, FaPenAlt } from 'react-icons/fa';
import DynamicButton from '../../Share/Button/DynamicButton/DynamicButton';

const NewSection = () => {
  const stats = [
    { icon: <FaGlobeAmericas />, value: "23+", label: "Countries" },
    { icon: <FaUsers />, value: "41+", label: "Clients" },
    { icon: <FaCheckCircle />, value: "65+", label: "Projects Completed" },
    { icon: <FaUserFriends />, value: "9+", label: "Team Members" }
  ];

  const projects = [
    {
      title: "SEO Expert Projects",
      description: "Offering top-tier SEO consultancy and services that help businesses rank higher and generate organic traffic through targeted strategies.",
      icon: <FaChartLine className="text-2xl" />,
      color: "from-purple-600 to-indigo-600"
    },
    {
      title: "Web Development",
      description: "Delivering modern and scalable web development solutions, specializing in custom websites and full-stack development for diverse industries.",
      icon: <FaCode className="text-2xl" />,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Content Creation",
      description: "Crafting engaging and compelling content that aligns with brand strategy, driving user engagement, and promoting business growth.",
      icon: <FaPenAlt className="text-2xl" />,
      color: "from-pink-600 to-rose-600"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Achievements</span> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">Projects</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Empowering businesses to reach new heights with unparalleled dedication and innovative solutions.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Statistics (50% width) */}
          <motion.div
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 h-full">
              <h3 className="text-2xl font-bold text-white mb-6">By The Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 hover:border-cyan-400 transition-all h-full"
                  >
                    <div className="text-cyan-400 mb-3 text-2xl">{stat.icon}</div>
                    <h4 className="text-4xl font-bold text-white mb-1">{stat.value}</h4>
                    <p className="text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Projects (50% width) */}
          <div className="lg:w-1/2 flex flex-col gap-6 h-full">
            {/* Top Full Width Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl overflow-hidden h-full">
                <div className="bg-gray-900/80 backdrop-blur-sm p-8 h-full flex flex-col">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
                      <FaChartLine className="text-2xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">SEO Expert Projects</h3>
                  </div>
                  <p className="text-gray-300 mb-8 flex-1">
                    Offering top-tier SEO consultancy and services that help businesses rank higher and generate organic traffic through targeted strategies.
                  </p>
                  <DynamicButton
                    text="View Projects"
                    alignment="left"
                    className="w-fit"
                  />
                </div>
              </div>
            </motion.div>

            {/* Bottom Two Cards */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1">
              {/* Web Development Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex-1"
              >
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl overflow-hidden h-full">
                  <div className="bg-gray-900/80 backdrop-blur-sm p-8 h-full flex flex-col">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        <FaCode className="text-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Web Development</h3>
                    </div>
                    <p className="text-gray-300 mb-8 flex-1">
                      Delivering modern and scalable web development solutions, specializing in custom websites and full-stack development.
                    </p>
                    <DynamicButton
                      text="View Projects"
                      alignment="left"
                      className="w-fit"
                    />
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
                <div className="bg-gradient-to-br from-pink-600 to-rose-600 rounded-2xl overflow-hidden h-full">
                  <div className="bg-gray-900/80 backdrop-blur-sm p-8 h-full flex flex-col">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                        <FaPenAlt className="text-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">Content Creation</h3>
                    </div>
                    <p className="text-gray-300 mb-8 flex-1">
                      Crafting engaging and compelling content that aligns with brand strategy and drives user engagement.
                    </p>
                    <DynamicButton
                      text="View Projects"
                      alignment="left"
                      className="w-fit"
                    />
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