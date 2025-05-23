import { motion } from 'framer-motion';

const SEOServiceDetails = ({ title, services }) => (
  <section className="py-10 bg-gray-900">
    <div className="max-w-6xl mx-auto px-5 sm:px-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        className="mb-7"
      >
        <h2 className="text-3xl sm:text-4xl  amsfonts text-white mb-3">
          {title}
        </h2>
        {/* <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500" /> */}
   
      </motion.div>

      {/* Services List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="p-8 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-colors duration-300 group"
          >
            <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-purple-300 transition-colors">
              {service.name}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {service.description}
            </p>
            
            {/* Decorative elements */}
            <div className="mt-6 flex items-center">
              <div className="h-px w-8 bg-gradient-to-r from-purple-500 to-transparent mr-3" />
              <div className="h-px flex-1 bg-gray-700 group-hover:bg-purple-500/30 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SEOServiceDetails;