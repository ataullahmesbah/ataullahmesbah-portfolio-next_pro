'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function SEOFAQSection() {
    const [leftActiveIndex, setLeftActiveIndex] = useState(null);
    const [rightActiveIndex, setRightActiveIndex] = useState(null);

    const toggleFAQ = (side, index) => {
        if (side === 'left') {
            setLeftActiveIndex(leftActiveIndex === index ? null : index);
        } else {
            setRightActiveIndex(rightActiveIndex === index ? null : index);
        }
    };

    const leftQuestions = [
        {
            q: 'What is GEO (Generative Engine Optimization) and do you offer it?',
            a: 'Yes! GEO optimizes content for AI search engines like Google\'s SGE. I implement GEO strategies to ensure your content appears in AI-generated answers and conversational search results.',
        },
        {
            q: 'How do you optimize for Google\'s SGE (Search Generative Experience)?',
            a: 'I use comprehensive content strategies, E-E-A-T signals, and technical optimizations that help Google\'s AI understand and feature your content in generative search results.',
        },
        {
            q: 'What is AEO (Answer Engine Optimization) and how is it different?',
            a: 'AEO focuses on capturing featured snippets and direct answers, while GEO targets AI-generated responses. I combine both for maximum visibility in all search formats.',
        },
        {
            q: 'Do you provide international SEO services for global businesses?',
            a: 'Absolutely! I specialize in international SEO including hreflang implementation, geo-targeting, multi-language content, and global technical SEO strategies.',
        },
        {
            q: 'What types of technical SEO do you specialize in?',
            a: 'I handle Core Web Vitals, site architecture, schema markup, mobile optimization, speed optimization, and crawlability issues for better search performance.',
        },
        {
            q: 'How long does SEO take to show significant results?',
            a: 'Initial improvements in 4-8 weeks, with substantial growth typically in 3-6 months. Competitive niches may take longer, but we track progress consistently.',
        },
    ];

    const rightQuestions = [
        {
            q: 'Do you offer e-commerce SEO for online stores?',
            a: 'Yes! I specialize in e-commerce SEO including product page optimization, category structure, technical SEO for stores, and international e-commerce strategies.',
        },
        {
            q: 'What makes your SEO approach different from others?',
            a: 'I combine traditional SEO excellence with modern AI-search optimization (GEO/SGE), focusing on future-proof strategies that work in both current and emerging search environments.',
        },
        {
            q: 'Do you provide local SEO services?',
            a: 'Yes, I offer comprehensive local SEO including Google Business Profile optimization, local citations, review management, and location-based content strategies.',
        },
        {
            q: 'What is included in your SEO packages?',
            a: 'My packages include technical audit, keyword research, on-page optimization, content strategy, link building, and ongoing performance tracking with regular reports.',
        },
        {
            q: 'How do you measure SEO success and ROI?',
            a: 'I track organic traffic growth, keyword rankings, conversion rates, revenue attribution, and use advanced analytics to demonstrate clear ROI for your investment.',
        },
        {
            q: 'Do you work with businesses in competitive industries?',
            a: 'Yes, I have experience in competitive niches and use advanced strategies including content clusters, topical authority, and strategic link building to achieve rankings.',
        },
    ];

    // Schema Markup for SEO FAQ
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [...leftQuestions, ...rightQuestions].map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a.replace(/<[^>]+>/g, ''),
            },
        })),
    };

    return (
        <>
            <section className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-b-gray-800">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12" data-aos="fade-in">
                        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3">
                            SEO Services FAQ
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto" data-aos="fade-in" data-aos-delay="100">
                            Expert answers about GEO, SGE, AEO, and comprehensive SEO strategies
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column - Modern SEO Focus */}
                        <div className="space-y-4">
                            {leftQuestions.map((item, index) => {
                                const isActive = leftActiveIndex === index;
                                return (
                                    <div
                                        key={`faq-left-${index}`}
                                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                        id={`faq-left-${index}`}
                                    >
                                        <button
                                            onClick={() => toggleFAQ('left', index)}
                                            className={`w-full flex justify-between items-center p-4 sm:p-5 text-left transition-colors ${isActive ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'
                                                }`}
                                            aria-expanded={isActive}
                                            aria-controls={`faq-answer-left-${index}`}
                                            aria-label={`Toggle ${item.q}`}
                                        >
                                            <span className="text-white font-medium text-xs sm:text-sm mr-4 text-left">
                                                {item.q}
                                            </span>
                                            <div className="flex-shrink-0 ml-2">
                                                <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'
                                                        }`}
                                                >
                                                    {isActive ? (
                                                        <FiMinus aria-hidden="true" className="transform rotate-0 transition-transform duration-300 ease-in-out" />
                                                    ) : (
                                                        <FiPlus aria-hidden="true" className="transform rotate-0 transition-transform duration-300 ease-in-out" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                        <div
                                            id={`faq-answer-left-${index}`}
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[400px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
                                                }`}
                                            role="region"
                                            aria-labelledby={`faq-left-${index}`}
                                        >
                                            <div className="p-4 sm:p-5 pt-0 text-gray-300 text-xs sm:text-sm">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right Column - Services & Results Focus */}
                        <div className="space-y-4">
                            {rightQuestions.map((item, index) => {
                                const isActive = rightActiveIndex === index;
                                return (
                                    <div
                                        key={`faq-right-${index}`}
                                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-indigo-500/50"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                        id={`faq-right-${index}`}
                                    >
                                        <button
                                            onClick={() => toggleFAQ('right', index)}
                                            className={`w-full flex justify-between items-center p-4 sm:p-5 text-left transition-colors ${isActive ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'
                                                }`}
                                            aria-expanded={isActive}
                                            aria-controls={`faq-answer-right-${index}`}
                                            aria-label={`Toggle ${item.q}`}
                                        >
                                            <span className="text-white font-medium text-xs sm:text-sm mr-4 text-left">
                                                {item.q}
                                            </span>
                                            <div className="flex-shrink-0 ml-2">
                                                <div
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'
                                                        }`}
                                                >
                                                    {isActive ? (
                                                        <FiMinus aria-hidden="true" className="transform rotate-0 transition-transform duration-300 ease-in-out" />
                                                    ) : (
                                                        <FiPlus aria-hidden="true" className="transform rotate-0 transition-transform duration-300 ease-in-out" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                        <div
                                            id={`faq-answer-right-${index}`}
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[400px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'
                                                }`}
                                            role="region"
                                            aria-labelledby={`faq-right-${index}`}
                                        >
                                            <div className="p-4 sm:p-5 pt-0 text-gray-300 text-xs sm:text-sm">
                                                {item.a}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </>
    );
}