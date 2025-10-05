'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function GEOSGEFAQ() {
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
            q: 'What is GEO (Generative Engine Optimization) and how is it different from traditional SEO?',
            a: 'GEO optimizes content specifically for AI search engines and conversational interfaces, focusing on entity relationships, conversational queries, and AI comprehension. Unlike traditional SEO that targets keyword rankings, GEO aims to appear in AI-generated answers and conversational search results.',
        },
        {
            q: 'How do you optimize for Google\'s SGE (Search Generative Experience)?',
            a: 'I implement comprehensive SGE strategies including E-E-A-T signal optimization, conversational content structuring, entity markup, authoritative source building, and creating AI-friendly content formats that Google\'s generative AI prefers to cite and reference.',
        },
        {
            q: 'What is the difference between GEO, SGE, and AEO?',
            a: 'GEO (Generative Engine Optimization) optimizes for all AI search engines. SGE (Search Generative Experience) specifically targets Google\'s AI interface. AEO (Answer Engine Optimization) focuses on featured snippets and direct answers. I combine all three for maximum AI search visibility.',
        },
        {
            q: 'How long does it take to see results from GEO optimization?',
            a: 'Initial improvements can appear in 4-8 weeks as AI systems reprocess content, with significant results typically in 3-6 months. The timeline depends on your website\'s current authority, content quality, and competition in your industry.',
        },
        {
            q: 'What types of content work best for GEO and SGE?',
            a: 'Comprehensive, authoritative content that answers user questions thoroughly, conversational Q&A formats, structured data-rich pages, expert-authored content with clear E-E-A-T signals, and content that establishes topical authority perform best in AI search.',
        },
        {
            q: 'How do you measure success in GEO and SGE optimization?',
            a: 'I track SGE appearances, AI-generated traffic, conversational query rankings, featured snippet growth, entity recognition, and monitor your content\'s citation rate in AI-generated answers across different platforms.',
        },
    ];

    const rightQuestions = [
        {
            q: 'Do you provide GEO optimization for e-commerce sites?',
            a: 'Yes! I specialize in e-commerce GEO including product entity optimization, conversational shopping query targeting, AI-friendly product descriptions, and ensuring your products appear in AI-generated shopping recommendations and comparisons.',
        },
        {
            q: 'How does GEO work with technical SEO?',
            a: 'GEO builds upon strong technical SEO foundations. I ensure your site is technically optimized for AI crawling, implement advanced schema markup for entities, optimize site speed for AI processing, and create AI-accessible content structures.',
        },
        {
            q: 'What is E-E-A-T and why is it crucial for GEO?',
            a: 'E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) are key signals Google\'s AI uses to determine content quality. I enhance these signals through author bios, credential showcasing, citation building, and establishing your site as an authoritative source.',
        },
        {
            q: 'Can you optimize existing content for GEO, or do we need new content?',
            a: 'I can optimize existing content by restructuring for conversational queries, adding entity context, enhancing E-E-A-T signals, and updating information architecture. New content creation focuses on filling AI search opportunity gaps identified through analysis.',
        },
        {
            q: 'How do you stay updated with changing AI search algorithms?',
            a: 'I continuously monitor AI search developments, participate in SEO testing communities, analyze SGE pattern changes, and adapt strategies based on real-world performance data and Google\'s official AI search updates.',
        },
        {
            q: 'What makes your GEO approach different from other AI SEO services?',
            a: 'I combine deep technical SEO expertise with AI search specialization, use proprietary tracking for SGE performance, focus on sustainable entity-based strategies rather than quick fixes, and provide comprehensive integration with your overall SEO strategy.',
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
                        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-3">
                            GEO & SGE FAQ
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto" data-aos="fade-in" data-aos-delay="100">
                            Expert answers about AI Search Optimization, Generative Engine Optimization, and Google's Search Generative Experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column - Core GEO/SGE Concepts */}
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