'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function WebFAQ() {
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
            q: 'What is custom web development and why should I choose it?',
            a: 'Custom web development involves building a website specifically tailored to your business needs. It provides full control over design, features, scalability, and performance, unlike template-based solutions.',
        },
        {
            q: 'How long does it take to develop a custom website?',
            a: 'Typically, a standard custom website takes 4-8 weeks, while complex ecommerce or enterprise-level applications may take 8-16 weeks, depending on design complexity and feature requirements.',
        },
        {
            q: 'Do you provide full-stack development services?',
            a: 'Yes! I provide end-to-end full-stack development using technologies like Node.js, React, Next.js, and MongoDB to build scalable, secure, and production-ready websites.',
        },
        {
            q: 'Can you build an ecommerce website?',
            a: 'Absolutely. I specialize in ecommerce platforms with custom product management, payment gateway integration, and secure checkout systems tailored to your business.',
        },
        {
            q: 'Do you handle website performance and speed optimization?',
            a: 'Yes, I optimize website speed and core web vitals including loading time, responsiveness, and overall performance to ensure high user experience and SEO benefits.',
        },
        {
            q: 'Do you offer WordPress or CMS solutions?',
            a: 'Yes, I can build custom WordPress websites or integrate CMS solutions while maintaining performance, security, and scalability tailored to your content needs.',
        },
    ];

    const rightQuestions = [
        {
            q: 'Do you provide ongoing website maintenance and support?',
            a: 'Yes, all custom web development packages include post-launch support, updates, security monitoring, and long-term maintenance options to keep your site up-to-date.',
        },
        {
            q: 'Can you integrate third-party APIs and services?',
            a: 'Absolutely. I integrate REST APIs, payment gateways, analytics, CRM systems, and other third-party tools to extend your website functionality.',
        },
        {
            q: 'Is SEO included in your web development services?',
            a: 'Yes, every custom website is built with SEO-friendly architecture, meta tags, schema markup, and performance optimization to boost your search engine visibility.',
        },
        {
            q: 'Do you build responsive websites for all devices?',
            a: 'Yes, all websites are fully responsive and mobile-friendly, ensuring optimal user experience across desktops, tablets, and smartphones.',
        },
        {
            q: 'Can you develop enterprise-level or scalable applications?',
            a: 'Yes, I build enterprise-grade web applications with scalable architecture, microservices, secure authentication, and advanced database design to handle growth and high traffic.',
        },
        {
            q: 'How do you ensure website security?',
            a: 'I implement best security practices including SSL, secure authentication, database protection, code reviews, and regular updates to protect against vulnerabilities and cyber threats.',
        },
    ];


    // Schema Markup for Web Development FAQ
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-3">
                            Web Development Services FAQ
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto" data-aos="fade-in" data-aos-delay="100">
                            Expert answers about custom web development, full-stack solutions, ecommerce platforms, website performance, and security.
                        </p>
                    </div>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column - Core Web Concepts */}
                        <div className="space-y-4">
                            {leftQuestions.map((item, index) => {
                                const isActive = leftActiveIndex === index;
                                return (
                                    <div
                                        key={`faq-left-${index}`}
                                        className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50 transition-all duration-300 hover:border-purple-500/50"
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
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-400'
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

                        {/* Right Column - Implementation & Strategy */}
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