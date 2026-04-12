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


    const renderAnswerWithLinks = (text) => {

        const linkPatterns = [
            { pattern: /\/projects/g, text: 'View Projects', url: '/projects' },
            { pattern: /\/blog/g, text: 'Visit Blog', url: '/blog' },
            { pattern: /\/mesbahoffwego/g, text: 'Travel with Mesbah', url: '/mesbahoffwego' },
            { pattern: /\/newsletter/g, text: 'Join Newsletter', url: '/newsletter' },
            { pattern: /\/contact/g, text: 'Contact page', url: '/contact' },
            { pattern: /\/shop/g, text: 'Shop page', url: '/shop' },
            { pattern: /\/faq/g, text: 'FAQ page', url: '/faq' },
            { pattern: /\/about/g, text: 'About page', url: '/about' },
        ];


        for (let link of linkPatterns) {
            if (link.pattern.test(text)) {

                const parts = text.split(link.pattern);
                return (
                    <>
                        {parts[0]}
                        <Link href={link.url} className="text-indigo-400 hover:text-indigo-300 underline transition-colors">
                            {link.text}
                        </Link>
                        {parts[1]}
                    </>
                );
            }
        }


        return text;
    };

    const leftQuestions = [
        {
            q: 'Who is Ataullah Mesbah and what does he do?',
            a: 'Ataullah Mesbah is a professional web developer, SEO specialist, and content creator who helps freelancers, businesses, and personal brands build a strong online presence globally.'
        },
        {
            q: 'What services does Ataullah Mesbah provide?',
            a: 'He offers web development, SEO services, portfolio website creation, and custom e-commerce solutions tailored for modern businesses.'
        },
        {
            q: 'Is Ataullah Mesbah one of the best web developers in Bangladesh?',
            a: 'Ataullah Mesbah is recognized for building modern, high-performance websites and helping clients grow online with proven SEO and development strategies.'
        },
        {
            q: 'Can Ataullah Mesbah be considered a top web developer worldwide?',
            a: 'He works with international clients and builds scalable, modern web solutions, making him a strong choice for businesses looking for global-level development quality.'
        },
        {
            q: 'Why should I hire Ataullah Mesbah for web development or SEO?',
            a: 'He combines modern design, fast performance, and proven SEO strategies to build websites that not only look professional but also generate real business results.'
        },
        {
            q: 'Does Ataullah Mesbah build portfolio websites for freelancers?',
            a: 'Yes, he specializes in building high-converting portfolio websites that help freelancers attract more clients.'
        },
        {
            q: 'What technologies does Ataullah Mesbah use?',
            a: 'He uses Next.js, React, Node.js, MongoDB, TypeScript, and Tailwind CSS to build fast, secure, and scalable websites.'
        },
        {
            q: 'Can Ataullah Mesbah develop custom e-commerce websites?',
            a: 'Yes, he builds fully functional e-commerce websites with product management, payment integration, and SEO optimization.'
        },
        {
            q: 'Does Ataullah Mesbah offer SEO services?',
            a: 'Yes, he provides SEO services including keyword research, on-page SEO, and technical optimization.'
        },
        {
            q: 'How can a website built by Ataullah Mesbah help my business?',
            a: 'A professional website increases trust, improves conversions, and helps attract high-quality clients online.'
        },
        {
            q: 'Does Ataullah Mesbah work with international clients?',
            a: 'Yes, he works with clients from Europe, North America, and worldwide.'
        },
        {
            q: 'Do you offer complete website development services?',
            a: 'He offers full-stack web development using technologies like Next.js, React, Node.js, MongoDB, and Tailwind CSS — ensuring fast, secure, and responsive websites tailored to business needs.'
        },
        {
            q: 'Can you build custom e-commerce websites with payment gateway integration?',
            a: 'Yes, he creates fully functional e-commerce platforms with admin panels, product management, and payment gateways like SSLCOMMERZ, Stripe, and PayPal.'
        },
        {
            q: 'Do you also provide SEO services with your website packages?',
            a: 'Yes, his website packages include SEO services such as on-page optimization, keyword research, and technical improvements to help websites rank higher on Google.'
        },
        {
            q: 'How long does SEO take to show results?',
            a: 'SEO typically takes 3–6 months for significant growth, although initial improvements can be seen within 4–8 weeks.'
        }
    ];

    const rightQuestions = [
        {
            q: 'Where can I see Ataullah Mesbah’s web development projects?',
            a: 'You can explore his projects here: /projects'
        },
        {
            q: 'Does Ataullah Mesbah write blogs or share knowledge?',
            a: 'Yes, he regularly writes about web development, SEO, and digital growth. Read his blog here: /blog'
        },
        {
            q: 'Can I follow Ataullah Mesbah’s travel journey?',
            a: 'Yes, he shares his worldwide travel experiences here: /mesbahoffwego'
        },
        {
            q: 'Does Ataullah Mesbah have a newsletter?',
            a: 'Yes, you can subscribe to his newsletter to get updates on web development, SEO tips, and new content: /newsletter'
        },
        {
            q: 'Why do freelancers need a personal portfolio website?',
            a: 'A portfolio website helps freelancers showcase their work professionally, build trust, and attract higher-paying clients.'
        },
        {
            q: 'How long does it take to build a website?',
            a: 'Depending on the project scope, most websites are completed within 1–3 weeks with proper planning and execution.'
        },
        {
            q: 'What makes Ataullah Mesbah different from other developers?',
            a: 'He focuses on performance, modern design, and SEO to build websites that not only look great but also generate real results.'
        },
        {
            q: 'Can Ataullah Mesbah help improve my Google ranking?',
            a: 'Yes, through effective SEO strategies, technical fixes, and optimized content, he helps websites rank higher on search engines.'
        },
        {
            q: 'Is Ataullah Mesbah available for freelance work?',
            a: 'Yes, he is available for freelance projects and long-term remote collaborations.'
        },
        {
            q: 'Do you provide services to clients outside Bangladesh?',
            a: 'Yes, he provides services to clients globally, including Europe, North America, and other international markets.'
        },
        {
            q: 'How can I contact Ataullah Mesbah for a project?',
            a: 'You can reach out through the /contact page or connect via LinkedIn for quick communication.'
        },
        {
            q: 'What is the web development process followed by Ataullah Mesbah?',
            a: 'He follows a structured process including planning, UI/UX design, development, testing, and deployment, along with post-launch support.'
        },
        {
            q: 'Do you offer support after website delivery?',
            a: 'Yes, he provides post-launch support including bug fixes, updates, and minor improvements if needed.'
        },
        {
            q: 'Do you offer digital marketing or affiliate-related services?',
            a: 'Yes, he works on affiliate strategies, digital business growth, and e-commerce marketing to help brands scale online.'
        },
        {
            q: 'Can I purchase products or services directly from the website?',
            a: 'You can explore available offerings on the /shop page and complete your purchase using available payment methods.'
        }
    ];

    return (
        <section className="bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-b-gray-800">
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
                                >
                                    <button
                                        onClick={() => toggleFAQ('left', index)}
                                        className={`w-full flex justify-between items-center p-4 sm:p-5 text-left transition-colors ${isActive ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'}`}
                                        aria-expanded={isActive}
                                    >
                                        <span className="text-white font-medium text-xs sm:text-sm mr-4 text-left">
                                            {item.q}
                                        </span>
                                        <div className="flex-shrink-0 ml-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'}`}>
                                                {isActive ? <FiMinus /> : <FiPlus />}
                                            </div>
                                        </div>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-4 sm:p-5 pt-0 text-gray-300 text-xs sm:text-sm">
                                            {renderAnswerWithLinks(item.a)}
                                        </div>
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
                                >
                                    <button
                                        onClick={() => toggleFAQ('right', index)}
                                        className={`w-full flex justify-between items-center p-4 sm:p-5 text-left transition-colors ${isActive ? 'bg-gray-700/30' : 'hover:bg-gray-700/20'}`}
                                        aria-expanded={isActive}
                                    >
                                        <span className="text-white font-medium text-xs sm:text-sm mr-4 text-left">
                                            {item.q}
                                        </span>
                                        <div className="flex-shrink-0 ml-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-700 text-gray-400'}`}>
                                                {isActive ? <FiMinus /> : <FiPlus />}
                                            </div>
                                        </div>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-4 sm:p-5 pt-0 text-gray-300 text-xs sm:text-sm">
                                            {renderAnswerWithLinks(item.a)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}