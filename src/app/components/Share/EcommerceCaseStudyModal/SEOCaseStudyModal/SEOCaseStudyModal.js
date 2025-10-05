'use client';

import { FiX, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import Link from "next/link";

const SEOCaseStudyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const caseStudies = [
        {
            id: 1,
            title: "E-commerce SEO Transformation",
            description: "65% revenue growth for online fashion store",
            results: "129% more organic traffic, 45% higher conversion rate",
            duration: "3 months",
            services: ["Technical SEO", "Ecommerce Optimization", "GEO Implementation"]
        },
        {
            id: 2,
            title: "Local Business Dominance",
            description: "From page 3 to #1 rankings for local service business",
            results: "3x more leads, 80% increase in phone calls",
            duration: "4 months",
            services: ["Local SEO", "Google Business Profile", "Citation Building"]
        },
        {
            id: 3,
            title: "AI Search Optimization Success",
            description: "Early GEO adoption for tech SaaS company",
            results: "56% AI-generated traffic, 91% featured snippet increase",
            duration: "2 months",
            services: ["GEO Optimization", "SGE Preparation", "Content Strategy"]
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white">SEO Success Stories</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <FiX className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Case Studies */}
                <div className="p-6 space-y-6">
                    {caseStudies.map((study) => (
                        <div key={study.id} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 hover:border-purple-500 transition-all">
                            <h3 className="text-xl font-bold text-white mb-2">{study.title}</h3>
                            <p className="text-gray-300 mb-4">{study.description}</p>

                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-2 text-green-400">
                                    <FiTrendingUp className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Results</span>
                                </div>
                                <p className="text-gray-300 text-sm flex-1">{study.results}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {study.services.map((service, index) => (
                                    <span key={index} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                                        {service}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">{study.duration}</span>
                                <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold">
                                    Full Case Study <FiArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">Ready to achieve similar results?</p>
                        <Link
                            href="/contact"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all justify-center w-fit"
                        >
                            Start Your SEO Journey <FiArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SEOCaseStudyModal;