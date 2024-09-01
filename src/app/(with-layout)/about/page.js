import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Sponser from "@/app/components/Sponser/Sponser";

export const metadata = {
    title: "About | Ataullah Mesbah",
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies.",
};

const page = () => {
    return (
        <>
            {/* Main Hero Section */}
            <div className="bg-sky-900 bg-gradient-to-br from-sky-700 via-sky-800 to-sky-950 flex items-center py-16 px-6 text-white">
                <div className="mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Left Side */}
                    <div className="text-center lg:text-left space-y-6">
                        <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
                            Welcome,
                        </h1>
                        <h4 className="text-2xl lg:text-4xl tracking-wide font-semibold">
                            I’m Ataullah Mesbah
                        </h4>
                        <p className="text-lg lg:text-2xl max-w-md mx-auto lg:mx-0">
                            Empowering Brands through Expert SEO and Global Insights
                        </p>
                        <div className="flex justify-center lg:justify-start items-center mt-6">
                            <button className="bg-gray-100 text-base text-sky-900 px-6 py-3 rounded-full hover:bg-gray-200 transition-all duration-200 ease-in-out flex items-center space-x-3 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-300">
                                <span className="font-semibold">BOOK A CALL</span>
                                <FaArrowRight className="text-sky-900" />
                            </button>
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="relative group hover:scale-105 transition-transform duration-200 ease-in-out">
                            <Image
                                src="https://i.ibb.co/gR2V4cn/image.jpg"
                                alt="Ataullah Mesbah"
                                width={500}
                                height={500}
                                className="rounded-full w-80 h-80 lg:w-96 lg:h-96 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
                            />
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sky-800 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 ease-in-out"></div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Sponsor Section */}
            <div className="">
                <Sponser />
            </div>

            {/* Who is Mesbah Section */}
            <section className="bg-blue-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-10">
                    {/* Right Side */}
                    <div className="lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="border-4 p-3 rounded-full border-gray-600">
                            <Image
                                src="https://i.ibb.co/gR2V4cn/image.jpg"
                                alt="Ataullah Mesbah"
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="rounded-full w-72 h-72 max-w-xs lg:max-w-md"
                            />
                        </div>
                    </div>

                    {/* Left Side */}
                    <div className="lg:w-1/2 space-y-6">
                        <header>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="border-l-4 border-sky-800 h-10"></div>
                                <h1 className="text-3xl font-bold">Who is Ataullah Mesbah?</h1>
                            </div>
                            <h2 className="text-lg font-semibold">
                                SEO Expert & World Explorer | Global Innovator and Visionary.
                            </h2>
                        </header>
                        <p>
                            With over 100 successful projects for companies and clients across
                            various industries, Ataullah’s expertise spans web development,
                            search engine optimization, and affiliate marketing. His
                            professional prowess is matched only by his love for travel, which
                            has taken him across the globe, discovering new cultures,
                            landscapes, and inspirations along the way.
                        </p>
                        <p>
                            As someone who has both lived in a remote village and thrived in
                            international business, Ataullah Mesbah is a symbol of
                            determination and global perspective, always seeking new horizons.
                        </p>
                    </div>
                </div>
            </section>

            {/* SEO Expert Section */}
            <section className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-10">
                    {/* Left Side */}
                    <div className="lg:w-1/2 space-y-4">
                        <h4 className="text-2xl font-bold text-gray-800">
                            SEO Expert, Web Developer & World Traveler - Ataullah Mesbah
                        </h4>
                        <p className="text-base text-gray-700">
                            Ataullah Mesbah, born in the serene village of Shirajpur, laid the
                            foundation of his education in local schools and colleges. His
                            journey into digital marketing began in 2018, where he honed his
                            skills in SEO using industry-leading tools like Ahrefs, Moz, and
                            SEMrush.
                        </p>
                        <p className="text-base text-gray-700">
                            Passionate about SEO, Ataullah has developed a deep understanding
                            of Google’s algorithms and SEO strategies. His expertise enables
                            him to craft tailored solutions that ensure high-ranking results,
                            making him a go-to expert for SEO optimization.
                        </p>
                        <p className="text-base text-gray-700">
                            In 2020, Ataullah expanded his horizons by delving into web
                            development. Today, he excels at creating and optimizing websites,
                            seamlessly integrating his SEO knowledge to build sites that not
                            only look great but perform exceptionally well in search rankings.
                        </p>
                        <p className="text-base text-gray-700">
                            Beyond his technical expertise, Ataullah is also a seasoned
                            traveler, exploring diverse cultures and gaining new inspirations
                            that fuel his innovative approach to both SEO and web development.
                        </p>
                    </div>

                    {/* Right Side */}
                    <div className="lg:w-1/2 flex justify-center lg:justify-end">
                        <div className="border-4 p-3 rounded-md border-gray-600">
                            <Image
                                src="https://i.ibb.co/gR2V4cn/image.jpg"
                                alt="Ataullah Mesbah"
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="rounded-md w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:96 lg:h-96"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default page;
