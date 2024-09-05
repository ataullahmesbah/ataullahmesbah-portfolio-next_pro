import Image from 'next/image';
import Link from 'next/link';

import mesbah from '/public/images/mesbah_pro.jpg'

const AboutUs = () => {
    return (
        <section id="about" className="py-20 bg-gray-100">
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
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
                            About Ataullah Mesbah
                        </h2>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            I’m Ataullah Mesbah, a passionate developer, SEO expert, and traveler. I love creating dynamic web applications and exploring new places. With my skills in software development and a strong problem-solving approach, I specialize in crafting intuitive and efficient digital solutions.
                        </p>
                        <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                            My tech journey has been both challenging and rewarding, offering me opportunities to work across diverse industries. Whether it’s building a sleek custom website, optimizing for search engines, or working with Node.js, Next.js, Redux, and React Native, I’m committed to delivering high-quality results.
                        </p>
                        {/* Get Started button */}
                        <div className="flex justify-center lg:justify-start">
                            <Link href="/about">
                                <button className="mt-4 bg-sky-800 text-white py-3 px-6 rounded-lg hover:bg-opacity-80 transition duration-300">
                                    Get in Touch
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
