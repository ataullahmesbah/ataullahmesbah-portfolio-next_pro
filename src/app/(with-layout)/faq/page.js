'use client';

import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import Link from 'next/link';

export default function FAQSection() {
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
    { q: 'Which tech do you use?', a: 'Next.js, React, Node.js, MongoDB, Tailwind CSS.' },
    { q: 'Do you build custom, full-stack websites?', a: 'Yes, tailored frontend and backend solutions.' },
    { q: 'Are your websites mobile-responsive?', a: 'Yes, built with mobile-first design.' },
    { q: 'Do you offer maintenance?', a: 'Yes, optional maintenance packages available.' },
    { q: 'Do you optimize existing websites for SEO?', a: 'Yes, with on-page, off-page, and technical SEO.' },
    { q: 'How long for SEO results?', a: 'Typically 3-6 months for noticeable results.' },
  ];

  const rightQuestions = [
    { q: 'Can you rank my site on Google?', a: 'I use white-hat SEO to boost visibility (no guarantees).' },
    { q: 'Can you build online shops?', a: 'Yes, with SSLCOMMERZ, Stripe, or PayPal.' },
    { q: 'Shopify or custom code?', a: 'Custom solutions preferred, Shopify also supported.' },
    { q: 'Can I manage products?', a: 'Yes, via user-friendly admin panels.' },
    { q: 'How to contact you?', a: 'Use the <a href="/contact" className="text-indigo-400 hover:underline">Contact page</a> or LinkedIn/email.' },
    { q: 'Available for freelance?', a: 'Yes, for freelance and remote roles.' },
  ];

  // Schema Markup for FAQ
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
      <section className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto" data-aos="fade-in" data-aos-delay="100">
              Everything you need to know about my services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column */}
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
                      className={`w-full flex justify-between items-center p-4 sm:p-5 text-left transition-colors ${isActive ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'}`}
                      aria-expanded={isActive}
                      aria-controls={`faq-answer-left-${index}`}
                      aria-label={`Toggle ${item.q}`}
                    >
                      <span className="text-white font-medium text-xs sm:text-base mr-4 text-left">
                        {item.q}
                      </span>
                      <div className="flex-shrink-0 ml-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-600 ease-in-out ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'}`}>
                          {isActive ? (
                            <FiMinus className="transform rotate-0 transition-transform duration-600 ease-in-out" />
                          ) : (
                            <FiPlus className="transform rotate-0 transition-transform duration-600 ease-in-out" />
                          )}
                        </div>
                      </div>
                    </button>
                    <div
                      id={`faq-answer-left-${index}`}
                      className={`overflow-hidden transition-all duration-700 ease-in-out ${isActive ? 'max-h-[400px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}`}
                    >
                      <div className="p-4 sm:p-5 pt-0 text-gray-300 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: item.a }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column */}
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
                      className={`w-full flex justify-between items-center p-4 sm:p-5 text-left transition-colors ${isActive ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'}`}
                      aria-expanded={isActive}
                      aria-controls={`faq-answer-right-${index}`}
                      aria-label={`Toggle ${item.q}`}
                    >
                      <span className="text-white font-medium text-xs sm:text-base mr-4 text-left">
                        {item.q}
                      </span>
                      <div className="flex-shrink-0 ml-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-600 ease-in-out ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'}`}>
                          {isActive ? (
                            <FiMinus className="transform rotate-0 transition-transform duration-600 ease-in-out" />
                          ) : (
                            <FiPlus className="transform rotate-0 transition-transform duration-600 ease-in-out" />
                          )}
                        </div>
                      </div>
                    </button>
                    <div
                      id={`faq-answer-right-${index}`}
                      className={`overflow-hidden transition-all duration-700 ease-in-out ${isActive ? 'max-h-[400px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}`}
                    >
                      <div className="p-4 sm:p-5 pt-0 text-gray-300 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: item.a }} />
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