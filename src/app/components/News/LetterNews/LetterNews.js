//app/component/news/letternews/letternews.js

'use client';

import { FaClinicMedical, FaMailchimp } from "react-icons/fa";
import letter1 from '/public/images/letter/nl1.jpg';
import letter2 from '/public/images/letter/nl2.jpg';
import Image from "next/image";
import DynamicButton from "@/app/components/Share/Button/DynamicButton/DynamicButton";
import Head from "next/head";
import LetterReview from "@/app/components/Share/LetterReview/LetterReview";
import NewsletterPage from "@/app/components/Share/NewsletterPage/NewsletterPage";
import LatestNewsLetter from "../NewsLetterPage/NewsLetterPage";
import FAQSection from "../../Share/FAQSection/FAQSection";
import useAOS from "../../hooks/useAOS";


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


const NewsLetter = () => {

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


            {/* Banner Section */}
            <div
                data-aos="fade-up"
                className='py-16 border-b border-b-gray-700'>
                <div className="max-w-7xl mx-auto rounded-lg p-6 lg:p-12 space-y-6 poppins-regular">
                    {/* Breadcrumb Links */}
                    <div className=" mb-4  justify-center text-center space-y-4 text-white">
                        {/* Add Next.js Links for Home and Contact */}
                        <h2 className="text-3xl lg:text-5xl font-bold ">
                            History
                        </h2>
                        <h2 className="text-3xl lg:text-5xl font-bold ">
                            Delivered By Post
                        </h2>

                        <div className="flex gap-3  justify-center items-center">
                            <FaMailchimp />
                            <p>1500+ Happy Readers</p>
                        </div>

                        {/* Get Started button */}
                        <div className="py-5 ">
                            <div className="grid gap-8 justify-center items-start ">
                                <div className="relative group">

                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                                    <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                                        <a href='/contact' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition font-semibold duration-200 text-xl">Join For Just $5</a>
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>


                </div>
            </div>


            {/* Section - 2 */}
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center poppins-regular px-4 md:px-8 lg:px-0 py-8 lg:py-16 gap-8 lg:gap-10">

                {/* Left Side Info */}
                <div
                    data-aos="flip-left"
                    className="space-y-4 md:space-y-6 text-center lg:text-left lg:flex-1 px-4">
                    <h6 className="text-gray-300 text-lg sm:text-xl md:text-2xl amsfonts">The Power of</h6>
                    <p className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-400">
                        Insightful Newsletters
                    </p>
                    <p className="font-thin text-sm sm:text-base md:text-xl text-gray-300">
                        Unlock the secrets to SEO success, business growth, and digital mastery with newsletters that deliver actionable insights every month.
                    </p>
                    <p className="font-thin text-sm sm:text-base md:text-base text-gray-300">
                        Embark on a journey through time as we uncover hidden gems of ancient civilizations, legendary explorers routes, and forgotten architectural marvels that shaped our world.
                    </p>
                </div>

                {/* Right Side Images */}
                <div
                    data-aos="flip-down"
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto lg:flex-1">
                    <Image
                        src={letter1}
                        width={280}
                        height={400}
                        alt="Newsletter example"
                        className="rounded-md w-full sm:w-[48%] lg:w-[45%] xl:w-[280px]"
                    />
                    <Image
                        src={letter2}
                        width={280}
                        height={400}
                        alt="Business idea letter"
                        className="rounded-md w-full sm:w-[48%] lg:w-[45%] xl:w-[280px]"
                    />
                </div>
            </div>

            <NewsletterPage />


            {/* NewsLetter POST Page */}

            <LatestNewsLetter />

            {/* Section - 3 */}
            <div className="bg-gray-800">
                <div className="max-w-3xl mx-auto text-center justify-center py-12 space-y-10 px-2">

                    <p className="text-left text-gray-200 font-thin text-xl italic">
                        Experience the power of cutting-edge tech insights, from AI-driven development to scalable cloud architectures. Each newsletter unlocks expert strategies for engineers, developers, and tech leaders to build the future.
                    </p>
                    <p className="text-left text-gray-200 font-thin text-xl italic">
                        From uncharted wilderness to legendary expeditions, our letters bring you gripping tales of adventure. Discover hidden trails, survival tactics, and the spirit of exploration that pushes human limits.
                    </p>

                    <DynamicButton
                        text="Join For Just $5"
                        alignment="center"
                        className="text-xl font-semibold"
                    />
                </div>
            </div>


            {/* section - 4 */}
            <section
                
                className="bg-black text-white py-16 px-4 sm:px-6">
                <div
                data-aos="fade-up"
                className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Our <span className="text-blue-400">Process</span>
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            A streamlined approach to delivering exceptional results
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-700 rounded-xl p-8 transition-all duration-300 group">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 group-hover:bg-blue-500 transition">
                                    1
                                </div>
                                <h3 className="text-xl font-bold">Concept Analysis</h3>
                            </div>
                            <p className="font-semibold text-blue-300 mb-2">Share Your Idea</p>
                            <p className="text-gray-300">
                                Submit your business idea or project for comprehensive analysis. I’ll review it thoroughly to understand your unique goals and objectives.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-700 rounded-xl p-8 transition-all duration-300 group">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 group-hover:bg-purple-500 transition">
                                    2
                                </div>
                                <h3 className="text-xl font-bold">Strategic Execution</h3>
                            </div>
                            <p className="font-semibold text-purple-300 mb-2">Content Creation</p>
                            <p className="text-gray-300">
                                Based on your requirements, I’ll craft high-quality content and implement customized SEO strategies specifically tailored to your business needs.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 bg-gray-900/50 hover:bg-gray-900/70 border border-gray-700 rounded-xl p-8 transition-all duration-300 group">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center mr-4 group-hover:bg-green-500 transition">
                                    3
                                </div>
                                <h3 className="text-xl font-bold">Performance Optimization</h3>
                            </div>
                            <p className="font-semibold text-green-300 mb-2">Results & Feedback</p>
                            <p className="text-gray-300">
                                We’ll monitor results together, refine strategies, and continuously optimize to ensure your digital presence grows effectively and sustainably.
                            </p>
                        </div>
                    </div>
                </div>
            </section>



            {/* "Client Says" */}

            <LetterReview />

            {/* FAQ's */}
            <FAQSection />


        </div>
    );
};

export default NewsLetter;