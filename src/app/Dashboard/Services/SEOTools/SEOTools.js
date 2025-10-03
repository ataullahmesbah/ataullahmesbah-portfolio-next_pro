'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SEOTools = () => {
    const services = [
        { name: "E-commerce SEO", icon: "🛒" },
        { name: "Technical SEO", icon: "⚙️" },
        { name: "Keyword Research", icon: "🔍" },
        { name: "International SEO", icon: "🌎" },
        { name: "Local SEO", icon: "📍" },
        { name: "On-Page SEO", icon: "📄" },
        { name: "Off-Page SEO", icon: "🔗" },
        { name: "Link Building", icon: "⛓️" },
        { name: "GEO Optimization", icon: "⚡" },
        { name: "SEO Audit", icon: "📊" },
        { name: "SGE Optimization", icon: "🤖" },
        { name: "E-E-A-T Optimization", icon: "🎯" },
        { name: "Content Strategy", icon: "🚀" },
        { name: "Performance Analytics  ", icon: "📈" },
        { name: "Mobile-First SEO", icon: "📱" }
    ];

    return (


        <section className="py-10 bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >

                     <p className="text-gray-200 text-base md:text-lg mb-6 md:px-6 lg:px-10">
                        Comprehensive solutions to boost your online visibility and organic growth. Explore our <Link href="/blog" className="text-indigo-400">SEO Blog</Link> for tips, learn about <Link href="/seo/geo-sge-optimization" className="text-indigo-400">GEO-SGE Optimization</Link>, or check <a href="https://developers.google.com/search/docs" className="text-indigo-400">Google’s SEO Guidelines</a> for best practices.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="
                                h-full bg-gray-800/60 hover:bg-gray-800/80
                                p-5 rounded-xl border border-gray-700
                                group-hover:border-purple-500/60
                                transition-all duration-300
                                flex flex-col items-center justify-center
                                text-center min-h-[120px]
                                shadow-lg hover:shadow-xl hover:shadow-purple-500/10
                            ">
                                <span className="text-2xl mb-2">{service.icon}</span>
                                <h3 className="font-medium text-white text-sm sm:text-base">
                                    {service.name}
                                </h3>
                            </div>

                            {/* Glow effect */}
                            <div className="
                                absolute inset-0 rounded-xl
                                pointer-events-none
                                opacity-0 group-hover:opacity-100
                                transition-opacity duration-300
                                z-10
                                bg-gradient-to-br from-purple-500/10 to-transparent
                            " />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

    );
};

export default SEOTools; 