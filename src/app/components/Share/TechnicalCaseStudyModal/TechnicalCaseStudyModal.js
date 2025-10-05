'use client';

import { FiX, FiArrowRight, FiTrendingUp, FiUsers, FiZap } from 'react-icons/fi';

const TechnicalCaseStudyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const caseStudies = [
        {
            id: 1,
            title: "E-commerce Site Speed Optimization",
            description: "Improved Core Web Vitals for a major online retailer",
            before: "LCP: 4.2s, CLS: 0.25, FID: 150ms",
            after: "LCP: 1.8s, CLS: 0.05, FID: 80ms",
            results: "42% increase in mobile conversions, 35% better bounce rate",
            duration: "3 weeks",
            industry: "E-commerce"
        },
        {
            id: 2,
            title: "News Portal Technical SEO Overhaul",
            description: "Complete technical restructuring for media website",
            before: "Poor crawlability, slow indexing, mobile issues",
            after: "Perfect crawl budget, instant indexing, mobile-first ready",
            results: "68% more organic traffic, 2x indexing speed",
            duration: "4 weeks",
            industry: "Media & Publishing"
        },
        {
            id: 3,
            title: "SaaS Platform Core Web Vitals",
            description: "Enterprise SaaS platform performance optimization",
            before: "LCP: 3.8s, INP: 280ms, low scores across all vitals",
            after: "LCP: 1.9s, INP: 120ms, all vitals in green",
            results: "55% better user engagement, 30% lower bounce rate",
            duration: "2 weeks",
            industry: "SaaS"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-white">Technical SEO Case Studies</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <FiX className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Case Studies Grid */}
                <div className="p-6 space-y-6">
                    {caseStudies.map((study) => (
                        <div key={study.id} className="bg-gray-700/50 rounded-xl p-6 border border-gray-600 hover:border-blue-500 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{study.title}</h3>
                                    <p className="text-gray-300 mb-3">{study.description}</p>
                                </div>
                                <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold">
                                    {study.industry}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-400 text-sm mb-2">BEFORE</h4>
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                        <p className="text-red-400 text-sm">{study.before}</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-400 text-sm mb-2">AFTER</h4>
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                                        <p className="text-green-400 text-sm">{study.after}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-green-400">
                                        <FiTrendingUp className="w-4 h-4" />
                                        <span className="text-sm font-semibold">Results</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{study.results}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <FiZap className="w-4 h-4" />
                                        <span className="text-sm">{study.duration}</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-semibold">
                                        View Details <FiArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 bg-gray-800/50 rounded-b-2xl">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">Ready to achieve similar results?</p>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-all">
                            Start Your Project <FiArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicalCaseStudyModal;