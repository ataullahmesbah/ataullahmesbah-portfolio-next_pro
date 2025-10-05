'use client';

import { FiX, FiArrowRight, FiTrendingUp, FiShoppingCart, FiDollarSign, FiUsers, FiClock } from 'react-icons/fi';

const EcommerceCaseStudyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const caseStudies = [
        {
            id: 1,
            title: "Fashion E-commerce Store Optimization",
            description: "Complete SEO overhaul for online fashion retailer",
            platform: "Shopify",
            before: "2.1% conversion rate, 3.8s LCP, poor product visibility",
            after: "4.8% conversion rate, 1.9s LCP, 65% more product traffic",
            results: "129% revenue growth, 45% lower bounce rate, 3x more organic sales",
            duration: "6 weeks",
            industry: "Fashion & Apparel"
        },
        {
            id: 2,
            title: "Electronics Store Product SEO",
            description: "Technical SEO and product page optimization",
            platform: "WooCommerce",
            before: "Poor product schema, slow category pages, mobile issues",
            after: "Rich product snippets, fast loading, mobile-first optimized",
            results: "84% more organic traffic, 2.3x product page conversions",
            duration: "4 weeks",
            industry: "Electronics"
        },
        {
            id: 3,
            title: "Home & Garden E-commerce GEO Optimization",
            description: "AI search optimization for home decor store",
            platform: "BigCommerce",
            before: "No AI search presence, traditional SEO only",
            after: "Featured in SGE results, product rich snippets, GEO optimized",
            results: "56% AI-generated traffic, 91% more featured snippets",
            duration: "3 weeks",
            industry: "Home & Garden"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl">

                {/* Header - Fixed for mobile */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-2xl z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Ecommerce SEO Case Studies</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                    >
                        <FiX className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                    </button>
                </div>

                {/* Case Studies Grid */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {caseStudies.map((study) => (
                        <div key={study.id} className="bg-gray-700/50 rounded-xl p-4 sm:p-6 border border-gray-600 hover:border-purple-500 transition-all">

                            {/* Header Section - Improved for mobile */}
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight">
                                        {study.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm sm:text-base mb-3">
                                        {study.description}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                                    <span className="bg-purple-500/20 text-purple-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                                        {study.industry}
                                    </span>
                                    <span className="bg-blue-500/20 text-blue-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
                                        {study.platform}
                                    </span>
                                </div>
                            </div>

                            {/* Before/After Section - Stack on mobile */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                                        BEFORE OPTIMIZATION
                                    </h4>
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                        <p className="text-red-400 text-xs sm:text-sm leading-relaxed">{study.before}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-400 text-xs sm:text-sm mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                        AFTER OPTIMIZATION
                                    </h4>
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                        <p className="text-green-400 text-xs sm:text-sm leading-relaxed">{study.after}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Results Section - Improved mobile layout */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-green-400 mb-2">
                                        <FiTrendingUp className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm font-semibold">Business Impact</span>
                                    </div>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                        {study.results}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-4">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <FiClock className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm whitespace-nowrap">{study.duration}</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold whitespace-nowrap">
                                        View Details
                                        <FiArrowRight className="w-4 h-4 flex-shrink-0" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl">
                    <div className="text-center">
                        <p className="text-gray-400 text-sm sm:text-base mb-4">
                            Ready to boost your online store sales?
                        </p>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 justify-center mx-auto transition-all w-full sm:w-auto">
                            Start Your Ecommerce SEO
                            <FiArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EcommerceCaseStudyModal;