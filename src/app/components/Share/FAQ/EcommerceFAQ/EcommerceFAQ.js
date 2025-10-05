'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function EcommerceFAQ() {
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
            q: 'What is GEO (Generative Engine Optimization) for e-commerce?',
            a: 'GEO optimizes your product pages and content for AI search engines like Google\'s SGE. I implement GEO strategies specifically for e-commerce to ensure your products appear in AI-generated shopping answers, conversational product searches, and AI-powered shopping assistants.',
        },
        {
            q: 'How do you optimize e-commerce sites for Google\'s SGE?',
            a: 'I use product schema optimization, conversational query targeting, enhanced product descriptions, and AI-friendly content structures that help Google\'s AI understand and feature your products in generative shopping experiences and comparison results.',
        },
        {
            q: 'What technical SEO is crucial for e-commerce success?',
            a: 'Critical technical SEO includes Core Web Vitals optimization, product schema markup, canonical tags for variants, faceted navigation handling, site speed optimization, mobile-first indexing, and crawl budget management for large product catalogs.',
        },
        {
            q: 'How do you handle SEO for large e-commerce product catalogs?',
            a: 'I implement strategic internal linking, optimize category page structures, manage pagination correctly, use canonical tags for product variants, create comprehensive product schema, and ensure efficient crawling through proper sitemap architecture.',
        },
        {
            q: 'What is your approach to e-commerce keyword research?',
            a: 'I focus on commercial intent keywords, product-specific long-tail queries, comparison terms, "best X" searches, and conversational shopping queries. I also analyze competitor product rankings and identify gaps in your market.',
        },
        {
            q: 'How do you optimize product pages for better conversions?',
            a: 'I optimize product titles, descriptions, images with alt text, implement rich snippets, improve page speed, enhance user experience, add customer reviews schema, and create compelling product content that answers common buyer questions.',
        },
    ];

    const rightQuestions = [
        {
            q: 'Do you provide local SEO for physical retail stores with e-commerce?',
            a: 'Yes! I offer integrated local e-commerce SEO including Google Business Profile optimization for stores with online sales, local inventory ads, "near me" product searches, and location-based product targeting strategies.',
        },
        {
            q: 'How do you improve e-commerce site architecture for SEO?',
            a: 'I create logical category hierarchies, optimize URL structures, implement breadcrumb navigation, handle faceted search properly, ensure smooth user journeys, and build topical authority through content clusters around product categories.',
        },
        {
            q: 'What is your strategy for international e-commerce SEO?',
            a: 'I implement hreflang tags for multi-language sites, geo-targeting in Search Console, currency and language switchers, localized content, international link building, and country-specific technical optimizations.',
        },
        {
            q: 'How do you handle duplicate content in e-commerce sites?',
            a: 'I use canonical tags for similar products, optimize parameter handling, implement noindex for search result pages, create unique product descriptions, and use structured data to clarify content relationships to search engines.',
        },
        {
            q: 'What e-commerce platforms do you specialize in?',
            a: 'I have extensive experience with Shopify, WooCommerce, BigCommerce, Magento, and custom e-commerce solutions. Each platform requires specific SEO approaches that I implement based on your technology stack.',
        },
        {
            q: 'How do you measure e-commerce SEO success and ROI?',
            a: 'I track organic revenue, product page conversions, category page performance, keyword rankings for commercial terms, organic traffic quality, return on ad spend (ROAS) from organic channels, and customer acquisition costs from SEO.',
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
                            E-commerce SEO FAQ
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto" data-aos="fade-in" data-aos-delay="100">
                            Expert answers about GEO, SGE, Technical SEO, and comprehensive e-commerce optimization strategies
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column - Technical & GEO/SGE Focus */}
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

                        {/* Right Column - Platforms, Local & Results Focus */}
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