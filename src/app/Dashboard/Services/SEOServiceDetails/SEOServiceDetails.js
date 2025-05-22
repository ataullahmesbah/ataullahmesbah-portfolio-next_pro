import Image from 'next/image';
import { motion } from 'framer-motion';

const SEOServiceDetails = ({ title, services, index }) => (
    <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        className="py-12"
    >
        <div className="max-w-7xl mx-auto">
            <div className="mb-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-blue-300">
                    {title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {services.map((service, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="relative group overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-lg"
                    >
                        <div className="p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                                        <span className="text-purple-400 text-lg font-bold">{i + 1}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                                </div>
                                <p className="text-gray-300 mb-6">{service.description}</p>
                                <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                                    Learn More
                                </button>
                            </div>
                            
                            <div className="flex-1 relative h-48 md:h-64 rounded-lg overflow-hidden bg-gray-700">
                                {service.image ? (
                                    <Image
                                        src={service.image}
                                        alt={service.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.src = '/fallback-seo-image.jpg'; // Add a fallback image
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                        <span className="text-gray-400">Image not available</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </motion.section>
);

export default SEOServiceDetails;