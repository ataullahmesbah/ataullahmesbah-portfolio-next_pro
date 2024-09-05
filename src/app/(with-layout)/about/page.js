
import Image from "next/image";
import Sponser from "@/app/components/Sponser/Sponser";
import AboutBanner from "@/app/components/Share/AboutBanner/AboutBanner";
import SEU from '/public/images/SEU.jpg';
import Testimonials from "@/app/components/Share/Testimonials/Testimonials";
import Link from "next/link";
import { FaArrowAltCircleRight } from "react-icons/fa";

export const metadata = {
    title: "About | Ataullah Mesbah",
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies.",
};

const page = () => {


    return (
        <>
            {/* Main Banner Section */}
            <div className="">
                <AboutBanner />
            </div>



            {/* Sponsor Section */}
            <div className="">
                <Sponser />
            </div>

            {/* Who is Ataullah Mesbah Section */}
            <section className="bg-blue-50 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-10 poppins-regular">
                    {/* left Side */}
                    <div className='w-full lg:w-1/2 flex justify-center lg:justify-end'>
                        <div className="border-2 p-3 rounded-md border-gray-600 max-w-xs sm:max-w-sm lg:max-w-md">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah"
                                layout="responsive"
                                width={500}
                                height={500}
                                objectFit="cover"
                                placeholder="blur"
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    {/* right Side */}
                    <div className="lg:w-1/2 space-y-6">
                        <header>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="border-l-4 border-sky-800 h-10"></div>
                                <h1 className="text-3xl font-bold">Who is Ataullah Mesbah?</h1>
                            </div>
                            <h2 className="text-lg font-semibold">
                                SEO Expert, Web Developer, Adventure Enthusiast & Football Aficionado.
                            </h2>
                        </header>
                        <p>
                            With over 6 years of experience, Ataullah Mesbah is an SEO expert and web developer who has completed 100+ projects across various industries, blending creativity with technical expertise.
                        </p>
                        <p>
                            Beyond the world of digital strategy, Ataullah is an avid traveler with a deep love for exploring historic and adventurous places. His travels have not only broadened his horizons but also enriched his perspective, inspiring him to bring fresh ideas to his work.
                        </p>
                        <p>
                            A passionate football enthusiast, he applies the same strategic thinking from the field to his professional endeavors, embodying a relentless pursuit of growth and innovation.
                        </p>

                    </div>
                </div>
            </section>

            {/* SEO Section */}
            <section className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-10 poppins-regular">
                    {/* Left Side */}
                    <div className="space-y-4">

                        <div className="flex items-center gap-2 mb-4">
                            <div className="border-l-4 border-sky-800 h-10"></div>
                            <h4 className="text-3xl font-bold text-gray-800">
                                SEO Expert Ataullah Mesbah
                            </h4>
                        </div>

                        <p className="text-base text-gray-700 leading-relaxed">
                            Ataullah Mesbah began his SEO journey in 2020, driven by a passion for digital marketing and a keen interest in search engine optimization. He started by mastering industry-leading tools such as Ahrefs, Moz, and SEMrush. His dedication to learning and adapting to the ever-evolving digital landscape has positioned him as a prominent figure in the SEO community.
                        </p>
                        <p className="text-base text-gray-700 leading-relaxed">
                            Over the years, Ataullah has worked with various clients across multiple industries, helping them improve their online presence and achieve higher search engine rankings. His approach combines technical SEO expertise with creative strategies to drive organic traffic and enhance user engagement.
                        </p>

                        <p className="text-base text-gray-700 leading-relaxed">
                            His commitment to excellence and his strategic approach have earned him recognition in the industry, making him a sought-after SEO consultant for businesses looking to enhance their digital footprint and achieve sustainable growth.
                        </p>
                        <Link href='/seo' className="flex gap-3 items-center text-sky-800">
                            <p className=" hover:underline">Get to Know SEO </p>

                            <FaArrowAltCircleRight />
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className='w-full flex justify-center lg:justify-end'>
                        <div className="border-2 p-3 rounded-md border-gray-600 max-w-xs sm:max-w-sm lg:max-w-md">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah"
                                layout="responsive"
                                width={500}
                                height={500}
                                placeholder="blur"
                                objectFit="cover"
                                className="rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>



            {/* Web Development */}
            <section className="bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between gap-10">
                    {/* Left Side */}
                    <div className='w-full lg:w-1/2 flex justify-center lg:justify-end'>
                        <div className="border-2 p-3 rounded-md border-gray-600 max-w-xs sm:max-w-sm lg:max-w-md">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah"
                                layout="responsive"
                                width={500}
                                height={500}
                                placeholder="blur"
                                objectFit="cover"
                                className="rounded-xl"
                            />
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="lg:w-1/2 space-y-3 poppins-regular">
                        <h4 className="text-2xl font-bold text-gray-800">
                            My Web Development Journey
                        </h4>
                        <p className="text-base text-gray-700 leading-relaxed">
                            My web development journey began with a passion for technology and a drive to create impactful digital experiences. Since starting in the field, I have immersed myself in various technologies and frameworks, including Node.js, Express, and MongoDB. My expertise extends to building custom websites, e-commerce platforms, and portfolio sites, as well as working with modern tools such as Next.js, Redux, and React Native.
                        </p>
                        <p className="text-base text-gray-700 leading-relaxed">
                            Over the years, I have tackled a range of projects from complex web applications to dynamic e-commerce solutions. My approach focuses on leveraging cutting-edge technologies to deliver robust, scalable, and user-friendly solutions tailored to client’s needs.
                        </p>
                        <p className="text-base text-gray-700 leading-relaxed">
                            My dedication to continuous learning and staying updated with the latest industry trends has allowed me to refine my skills and deliver high-quality results. Whether developing from scratch or enhancing existing systems, I strive to provide innovative solutions that drive success and exceed expectations.

                            <Link href='/web-development' className="flex gap-3 items-center text-sky-800">
                                <p className=" hover:underline">Get to Know Web Development </p>

                                <FaArrowAltCircleRight />
                            </Link>
                        </p>

                    </div>
                </div>
            </section>


            {/* Testimonials */}

            <Testimonials />
















        </>
    );
};

export default page;
