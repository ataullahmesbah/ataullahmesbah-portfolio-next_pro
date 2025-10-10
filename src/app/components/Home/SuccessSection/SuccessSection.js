'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGlobeAmericas, FaUsers, FaCheckCircle, FaUserFriends, FaChartLine, FaCode, FaPenAlt, FaArrowRight, FaRocket, FaStar } from 'react-icons/fa';
import { FiPlay } from 'react-icons/fi';

const SuccessSection = () => {
  const stats = [
    { icon: <FaGlobeAmericas className="text-2xl" />, value: "23+", label: "Global Reach" },
    { icon: <FaUsers className="text-2xl" />, value: "41+", label: "Happy Clients" },
    { icon: <FaCheckCircle className="text-2xl" />, value: "65+", label: "Projects" },
    { icon: <FaUserFriends className="text-2xl" />, value: "11+", label: "Team Members" },
  ];

  const projects = [
    {
      title: "SEO Excellence",
      description: "Boost online visibility with top-tier SEO strategies for organic growth.",
      icon: <FaChartLine className="text-2xl" />,
      link: "/seo",
      features: ["#1 Rankings", "400% Traffic", "90% ROI"],
      color: "purple"
    },
    {
      title: "Web Development",
      description: "Create stunning, high-performance websites that convert.",
      icon: <FaCode className="text-2xl" />,
      link: "/web-development",
      features: ["99.9% Uptime", "2s Load Time", "Mobile First"],
      color: "blue"
    },
    {
      title: "Content Mastery",
      description: "Engage audiences with compelling content that drives results.",
      icon: <FaPenAlt className="text-2xl" />,
      link: "/content-creation",
      features: ["10M+ Views", "85% Engagement", "Viral Content"],
      color: "pink"
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        gradient: "from-purple-600 to-indigo-700",
        light: "from-purple-600/10 to-indigo-700/10",
        border: "border-purple-600/20",
        text: "text-purple-300",
        accent: "from-purple-500 to-indigo-600"
      },
      blue: {
        gradient: "from-blue-600 to-cyan-700",
        light: "from-blue-600/10 to-cyan-700/10",
        border: "border-blue-600/20",
        text: "text-blue-300",
        accent: "from-blue-500 to-cyan-600"
      },
      pink: {
        gradient: "from-pink-600 to-rose-700",
        light: "from-pink-600/10 to-rose-700/10",
        border: "border-pink-600/20",
        text: "text-pink-300",
        accent: "from-pink-500 to-rose-600"
      }
    };
    return colors[color] || colors.purple;
  };

  return (
    <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Digital Triumph</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mb-3 rounded-full" />
          <p className="text-base text-gray-200 max-w-xl mx-auto font-light">Innovate, grow, succeed</p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Stats + CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            {/* Stats */}
            <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-5 border border-gray-600/20 shadow-lg">
              <div className="flex items-center gap-2 mb-5">
                <FaRocket className="text-xl text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Our Impact</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <div className="bg-gray-900/30 backdrop-blur-sm p-3 rounded-lg border border-gray-600/30 hover:border-cyan-400/30 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="flex items-center gap-2 relative z-10">
                        <div className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300">{stat.icon}</div>
                        <div>
                          <h4 className="text-xl font-bold text-white">{stat.value}</h4>
                          <p className="text-gray-200 text-xs">{stat.label}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* New CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-5 border border-gray-600/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-700/20 border border-purple-600/20 text-purple-300 group-hover:scale-105 transition-transform duration-300">
                  <FaStar className="text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300">Ready to Transform?</h3>
                  <p className="text-gray-200 text-xs">Schedule a free consultation to skyrocket your business.</p>
                </div>
              </div>
              <Link
                href="/contact"
                className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-600/30 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-gray-800/80 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden w-fit"
              >
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full group-hover:h-10 transition-all duration-300" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                </motion.div>
                <span className="relative text-sm">Get Started</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Projects */}
          <div className="space-y-5">
            {projects.map((project, index) => {
              const colors = getColorClasses(project.color);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-gray-800/20 backdrop-blur-lg rounded-2xl p-5 border border-gray-600/20 shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-1.5 rounded-lg ${colors.light} border ${colors.border} ${colors.text} group-hover:scale-105 transition-transform duration-300`}>
                        {project.icon}
                      </div>
                      <div>
                        <h3 className={`text-base font-bold text-white group-hover:${colors.text} transition-all duration-300`}>{project.title}</h3>
                        <p className="text-gray-200 text-xs mt-1">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.features.map((feature, idx) => (
                        <span key={idx} className={`px-1.5 py-0.5 ${colors.light} border ${colors.border} rounded-md ${colors.text} text-xs`}>
                          {feature}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={project.link}
                      className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-600/30 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-gray-800/80 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden w-fit"
                    >
                      <div className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b ${colors.accent} rounded-r-full group-hover:h-10 transition-all duration-300`} />
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <motion.div
                        animate={{ rotate: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                      </motion.div>
                      <span className="relative text-sm">Explore</span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessSection;