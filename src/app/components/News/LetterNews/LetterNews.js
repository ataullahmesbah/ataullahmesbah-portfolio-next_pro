//app/component/news/letternews/letternews.js

'use client';


import DynamicButton from "@/app/components/Share/Button/DynamicButton/DynamicButton";
import Head from "next/head";
import LetterReview from "@/app/components/Share/LetterReview/LetterReview";
import NewsletterPage from "@/app/components/Share/NewsletterPage/NewsletterPage";
import FAQSection from "../../Share/FAQSection/FAQSection";
import useAOS from "../../hooks/useAOS";
import NewsLetter from '@/app/components/News/NewsLetter/Newsletter';
import LetterHero from "../LetterHero/LetterHero";
import { FiArrowRight, FiCode, FiCompass } from "react-icons/fi";
import Link from "next/link";


const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Letter - Ataullah Mesbah",
    "description": "Subscribe to Ataullah Mesbah's newsletter for the latest updates, insights, and exclusive content. Stay connected with our community.",
    "url": "https://ataullahmesbah.com/letter",
    "publisher": {
        "@type": "Organization",
        "name": "Ataullah Mesbah",
        "url": "https://ataullahmesbah.com",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "info@ataullahmesbah.com",
            "contactType": "Customer Support"
        }
    },
    "lastReviewed": "2025-05-18"
};


const LetterNews = () => {

    useAOS({ duration: 1000 });

    return (
        <div className="min-h-screen border-b border-b-gray-700"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>

            {/* Add Head and JSON-LD Schema */}
            <Head>
                <title>Letter | Ataullah Mesbah</title>
                <meta name="description" content="Subscribe to Ataullah Mesbah's newsletter for the latest updates, insights, and exclusive content. Stay connected with our community." />
                <meta name="keywords" content="newsletter, Ataullah Mesbah, updates, insights, subscription, exclusive content" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
            </Head>

            {/* Hero Section */}
            <LetterHero />

            {/* NewsLetter Subscribe */}
            <NewsletterPage />


            {/* NewsLetter POST Page */}

            <NewsLetter />


            {/* Section - 3 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-16 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-12">
                        {/* Quote Blocks */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Tech Insights Quote */}
                            <div className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
                                <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-500/20 p-2 rounded-lg">
                                            <FiCode className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Tech Insights</h3>
                                    </div>
                                    <p className="text-gray-300 text-lg leading-relaxed italic">
                                        Experience the power of cutting-edge tech insights, from AI-driven development to scalable cloud architectures. Each newsletter unlocks expert strategies for engineers, developers, and tech leaders to build the future.
                                    </p>
                                </div>
                            </div>

                            {/* Adventure Stories Quote */}
                            <div className="group relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">
                                <div className="absolute -top-3 -left-3 w-6 h-6 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-green-500/20 p-2 rounded-lg">
                                            <FiCompass className="w-5 h-5 text-green-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">Adventure Stories</h3>
                                    </div>
                                    <p className="text-gray-300 text-lg leading-relaxed italic">
                                        From uncharted wilderness to legendary expeditions, our letters bring you gripping tales of adventure. Discover hidden trails, survival tactics, and the spirit of exploration that pushes human limits.
                                    </p>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>


            {/* section - 4 */}
            <section className="bg-gray-900 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Process</span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                            A streamlined approach to delivering exceptional digital results
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 group hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10">
                            <div className="flex items-start gap-6 mb-6">
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold rounded-2xl w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Concept Analysis</h3>
                                    <p className="font-semibold text-blue-300">Share Your Idea</p>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Submit your business idea or project for comprehensive analysis. I&#39;ll review it thoroughly to understand your unique goals and objectives.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 group hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10">
                            <div className="flex items-start gap-6 mb-6">
                                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold rounded-2xl w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Strategic Execution</h3>
                                    <p className="font-semibold text-purple-300">Content Creation</p>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                Based on your requirements, I&#39;ll craft high-quality content and implement customized SEO strategies specifically tailored to your business needs.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 transition-all duration-500 group hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/10">
                            <div className="flex items-start gap-6 mb-6">
                                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white font-bold rounded-2xl w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Performance Optimization</h3>
                                    <p className="font-semibold text-green-300">Results & Feedback</p>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">
                                We&#39;ll monitor results together, refine strategies, and continuously optimize to ensure your digital presence grows effectively and sustainably.
                            </p>
                        </div>
                    </div>

                    {/* CTA Button */}

                    <div className="mx-auto  items-center text-center">
                        <button className="  mt-12 ">
                            {/* Secondary Button */}
                            <Link
                                href="/newsletter"
                                className="group relative bg-gray-800/50 backdrop-blur-md border border-gray-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 transition-all duration-300 hover:bg-gray-700/60 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden"
                            >
                                {/* Left Accent Bar */}
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all" />

                                {/* Hover Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                <span className="relative">Start Your Project</span>
                                <FiArrowRight className="relative group-hover:translate-x-1 transition-transform duration-300" />
                            </Link>
                        </button>
                    </div>
                </div>
            </section>



            {/* "Client Says" */}

            {/* <LetterReview /> */}

            {/* FAQ's */}
            <FAQSection />


        </div>
    );
};

export default LetterNews;