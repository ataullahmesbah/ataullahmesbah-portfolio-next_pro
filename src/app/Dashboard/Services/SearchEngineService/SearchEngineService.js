'use client';

import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import SEOFAQSection from "@/app/components/Share/SEOFaqSection/SEOFaqSection";
import SEOPackage from "@/app/Dashboard/Services/SEOPackages/SEOPackages";
import SEOService from "@/app/Dashboard/Services/SEOService/SEOService";
import SEOTools from "@/app/Dashboard/Services/SEOTools/SEOTools";
import Image from "next/image";
import Link from "next/link";




const SearchEngineService = () => {

    return (

        <section className="min-h-screen border-b border-b-gray-800 poppins-regular"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>
            <div className="py-12 shadow-md border-b border-b-gray-700">
                <div className="lg:max-w-3xl lg:w-1/2 mx-auto py-8">
                    {/* Left Text Side */}
                    <div className="justify-center items-center space-y-6 text-center px-2 sm:px-4">
                        <h1 className="lg:text-4xl text-3xl font-bold text-gray-100">
                            Global SEO Expert: AI-Optimized Strategies for International Growth
                        </h1>
                        <p className="text-gray-200 text-base sm:text-lg">
                            Drive qualified global traffic with technical SEO, e-commerce optimization, and AI-search (SGE) strategies. Get a free SEO audit to boost rankings and revenue worldwide.

                        </p>
                        {/* Contact Link */}
                        <div className="py-5">
                            <div className="grid gap-8 justify-center items-center">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    <button
                                        className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center"
                                        aria-label="Contact Ataullah Mesbah for SEO services"
                                    >
                                        <Link href="/contact" className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">
                                            Contact Ataullah Mesbah Today &rarr;
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Audit */}

            <div className="max-w-7xl mx-auto flex flex-col  lg:flex-row items-center py-8 px-4 lg:px-8">

                {/* Left Text Side */}
                <div className="w-full justify-center space-y-6 text-center ">
                    <SEOAuditForm />
                </div>

                {/* Right Image Side */}
                <div className="w-full  flex justify-center mt-8 lg:mt-0">
                    <Image
                        src="https://i.ibb.co/d5FW2dK/image.png"  // Image link provided by you
                        alt="Global SEO Services - Technical SEO and AI Optimization"
                        width={500}
                        height={500}
                        className="rounded-lg max-w-full h-auto"
                    />
                </div>

            </div>




            {/* TODO Tools SEO */}
            <SEOTools />

            <div>
                {/* TO DO LIST */}
                <SEOService />
            </div>
            <div>
                {/* TO DO LIST */}
                <SEOPackage />
            </div>


            {/*  IMPORT SEO FAQ COMPONENT */}
            <SEOFAQSection />

            <div >
                {/* TO DO LIST */}
                <ContactAssistance />
            </div>
        </section>
    );
};

export default SearchEngineService;
