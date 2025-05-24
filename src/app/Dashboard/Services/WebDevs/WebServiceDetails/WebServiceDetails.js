import { motion } from "framer-motion";
import { FaCode, FaServer, FaMobileAlt, FaChartLine } from "react-icons/fa";

const iconComponents = {
  frontend: FaCode,
  backend: FaServer,
  mobile: FaMobileAlt,
  analytics: FaChartLine
};

const WebServiceDetails = ({ title, services, index }) => {
  const Icon = iconComponents[title.toLowerCase()] || FaCode;
  
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-100px" }}
      className="py-12 px-4 sm:px-6 bg-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          whileInView={{ x: 0 }}
          initial={{ x: -50 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8"
        >
          <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 mr-4">
            <Icon className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            {title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={`${service.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="p-8">
                <div className="flex items-start mb-4">
                  <div className="bg-purple-500/10 p-2 rounded-lg mr-4">
                    <span className="text-purple-400 font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {service.name}
                  </h3>
                </div>
                <p className="text-gray-300 pl-14">{service.description}</p>
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-md" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WebServiceDetails;