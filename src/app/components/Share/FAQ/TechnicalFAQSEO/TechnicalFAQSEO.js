'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function TechnicalSEOFAQSection() {
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
            q: 'What is Core Web Vitals optimization and why is it important?',
            a: 'Core Web Vitals are Google\'s user experience metrics measuring loading performance (LCP), interactivity (FID/INP), and visual stability (CLS). I optimize these metrics to improve user experience, boost search rankings, and increase conversion rates.',
        },
        {
            q: 'How do you handle technical SEO for large e-commerce sites?',
            a: 'I implement strategic site architecture, optimize faceted navigation with canonical tags, manage crawl budget efficiently, implement proper product schema, and ensure fast loading times through code optimization and CDN implementation.',
        },
        {
            q: 'What technical issues most commonly affect SEO performance?',
            a: 'Common issues include slow page speeds, poor mobile optimization, crawl errors, duplicate content, broken links, improper redirects, missing schema markup, and JavaScript rendering problems that prevent proper indexing.',
        },
        {
            q: 'How do you optimize website speed and performance?',
            a: 'I use image optimization, code minification, browser caching, CDN implementation, server response optimization, critical CSS inlining, and lazy loading to significantly improve loading times and Core Web Vitals scores.',
        },
        {
            q: 'What is structured data and how do you implement it?',
            a: 'Structured data (schema markup) helps search engines understand your content. I implement JSON-LD schema for products, articles, local business info, FAQs, and other relevant types to enhance search appearance with rich snippets.',
        },
        {
            q: 'How do you handle mobile-first indexing optimization?',
            a: 'I ensure responsive design, optimize mobile page speeds, implement proper viewport settings, fix mobile usability issues, and test across devices to guarantee optimal performance for Google\'s mobile-first indexing.',
        },
    ];

    const rightQuestions = [
        {
            q: 'What is your process for technical SEO audits?',
            a: 'My comprehensive audit covers site architecture, performance metrics, mobile optimization, security issues, structured data, internal linking, XML sitemaps, robots.txt, and provides actionable recommendations with priority levels.',
        },
        {
            q: 'How do you fix crawl budget and indexing issues?',
            a: 'I optimize robots.txt, fix crawl errors, streamline site architecture, implement proper canonicalization, remove low-value pages from indexing, and ensure search engines can efficiently discover and index your important content.',
        },
        {
            q: 'Do you work with specific CMS platforms or frameworks?',
            a: 'Yes, I have extensive experience with WordPress, Shopify, Magento, React, Next.js, Vue.js, and custom solutions. Each platform requires specific technical SEO approaches that I implement effectively.',
        },
        {
            q: 'How long does technical SEO take to show results?',
            a: 'Initial fixes can show results in 2-4 weeks, while comprehensive technical overhauls may take 3-6 months for full impact. I provide regular progress reports and track key performance indicators throughout the process.',
        },
        {
            q: 'What ongoing technical maintenance do you provide?',
            a: 'I offer continuous monitoring, regular performance audits, Core Web Vitals tracking, security updates, broken link detection, and proactive optimization to maintain and improve your technical SEO over time.',
        },
        {
            q: 'How do you measure technical SEO success and ROI?',
            a: 'I track organic traffic growth, keyword rankings, Core Web Vitals scores, conversion rates, crawl efficiency, indexation rates, and use analytics to demonstrate clear return on investment for technical improvements.',
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                            Technical SEO FAQ
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto" data-aos="fade-in" data-aos-delay="100">
                            Expert answers about Core Web Vitals, site performance, and comprehensive technical optimization strategies
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column - Core Technical Focus */}
                        <div className="space-y-4">
                            {leftQuestions.map((item, index) => {
                                const isActive = leftActiveIndex === index;
                                return (
                                    <div
                                        key={`faq-left-${index}`}
                                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-blue-500/50"
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
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-700 text-gray-400'
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

                        {/* Right Column - Implementation & Results Focus */}
                        <div className="space-y-4">
                            {rightQuestions.map((item, index) => {
                                const isActive = rightActiveIndex === index;
                                return (
                                    <div
                                        key={`faq-right-${index}`}
                                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-cyan-500/50"
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
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'
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