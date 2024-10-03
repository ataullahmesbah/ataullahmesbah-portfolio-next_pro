import Image from 'next/image';
import Link from 'next/link';

import mesbah from '/public/images/mesbah_pro.jpg'

const AboutUs = () => {
    return (
        // <section id="about" className="py-20 bg-gray-100">
        <section id="about" className="py-20  ">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
                    {/* Left Side: Image with Gradient Overlay */}
                    <div className=" rounded-lg  w-full lg:w-1/2">
                        <Image
                            src={mesbah}
                            alt="Ataullah Mesbah"
                            layout="responsive"
                            width={500}
                            height={500}
                            placeholder='blur'
                            className="rounded-lg"
                        />
                    </div>

                    {/* Right Side: Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left text-white poppins-regular">
                        <h2 className="text-3xl sm:text-4xl font-bold  mb-6">
                            About Ataullah Mesbah
                        </h2>
                        <p className="text-lg text-gray-300  mb-6 leading-relaxed">
                            I’m Ataullah Mesbah, a passionate developer, SEO expert, and traveler. I love creating dynamic web applications and exploring new places. With my skills in software development and a strong problem-solving approach, I specialize in crafting intuitive and efficient digital solutions.
                        </p>
                        <p className="text-lg text-gray-300  mb-6 leading-relaxed">
                            My tech journey has been both challenging and rewarding, offering me opportunities to work across diverse industries. Whether it’s building a sleek custom website, optimizing for search engines, or working with Node.js, Next.js, Redux, and React Native, I’m committed to delivering high-quality results.
                        </p>

                        {/* Get Started button */}
                        <div className="py-5 ">
                            <div className="grid gap-8 justify-start items-start ">
                                <div className="relative group">

                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                                    <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                                        <a href='/contact' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">Get Started &rarr;</a>
                                    </button>
                                </div>
                            </div>
                        </div>





                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
