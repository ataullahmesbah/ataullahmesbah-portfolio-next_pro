import { FaClinicMedical, FaMailchimp } from "react-icons/fa";
import letter1 from '/public/images/letter/nl1.jpg';
import letter2 from '/public/images/letter/nl2.jpg';
import Image from "next/image";
import DynamicButton from "@/app/components/Share/Button/DynamicButton/DynamicButton";
import Head from "next/head";
import LetterReview from "@/app/components/Share/LetterReview/LetterReview";
import Newsletters from "@/app/components/Share/Newsletter/Newsletter";
import NewsletterPage from "@/app/components/Share/NewsletterPage/NewsletterPage";

{/* This is my newsletter platform */ }

<Head>
    <title>Letter | Ataullah Mesbah</title>
    <meta name="description" content="Learn about Ataullah Mesbah, an SEO expert and world traveler, who has worked with 100+ companies and clients, and is a proud member of a leading ad agency in Canada." />
    <meta name="keywords" content="Ataullah Mesbah, SEO Expert, World Explorer, Pouvoir en ligne, Web Development, Affiliate Marketing" />
</Head>

export const metadata = {
    title: "Letter | Ataullah Mesbah",
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies.",
};


const NewsLetter = () => {
    return (
        <div className="min-h-screen border-b border-b-gray-700"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>

            {/* Banner Section */}
            <div className='py-16 border-b border-b-gray-700'>
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

                                        <a href='/' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition font-semibold duration-200 text-xl">Join For Just $5</a>
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
                <div className="space-y-4 md:space-y-6 text-center lg:text-left lg:flex-1 px-4">
                    <h6 className="text-gray-300 text-lg sm:text-xl md:text-2xl amsfonts">The Power of</h6>
                    <p className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-400">
                        Insightful Newsletters
                    </p>
                    <p className="font-thin text-sm sm:text-base md:text-xl text-gray-300">
                        Unlock the secrets to SEO success, business growth, and digital mastery with newsletters that deliver actionable insights every month.
                    </p>
                    <p className="font-thin text-sm sm:text-base md:text-xl text-gray-300">
                        Stay ahead of the curve with expert tips, case studies, and innovative ideas tailored for entrepreneurs, marketers, and visionaries.
                    </p>
                </div>

                {/* Right Side Images */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto lg:flex-1">
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

            {/* Section - 3 */}
            <div className="bg-gray-800">
                <div className="max-w-3xl mx-auto text-center justify-center py-12 space-y-10 px-2">

                    <p className="text-left text-gray-200 font-thin text-xl italic">
                        Experience the value of tailored, expert-driven content that empowers your journey. Each letter delivers impactful strategies for your business, SEO, and personal growth.
                    </p>
                    <p className="text-left text-gray-200 font-thin text-xl italic">
                        From mastering search engine rankings to discovering innovative business hacks, our newsletters provide you with tools to thrive in a competitive landscape. Each letter is crafted with care to inspire and inform.
                    </p>

                    <DynamicButton
                        text="Join For Just $5"
                        alignment="center"
                        className="text-xl font-semibold"
                    />
                </div>
            </div>


            {/* section - 4 */}

            <section className="bg-black text-white py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-center text-4xl font-bold mb-8">How Does It Work?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border border-white p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Step 1</h3>
                            <p className="font-bold mb-2">Share Your Idea</p>
                            <p>
                                Submit your business idea or project for analysis. I ll review it
                                to understand your goals and objectives.
                            </p>
                        </div>
                        <div className="border border-white p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Step 2</h3>
                            <p className="font-bold mb-2">Content Creation</p>
                            <p>
                                Based on your requirements, Ill create high-quality content and
                                implement SEO strategies tailored to your business.
                            </p>
                        </div>
                        <div className="border border-white p-6 rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Step 3</h3>
                            <p className="font-bold mb-2">Results & Feedback</p>
                            <p>
                                Monitor the results, refine strategies, and continue optimizing
                                to ensure your web presence grows effectively.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* "Client Says" */}

            <LetterReview />


            {/* NewsLetter Hacks */}

            <Newsletters />



            <NewsletterPage />







        </div>
    );
};

export default NewsLetter;