import Image from 'next/image';
import Link from 'next/link';
import mesbah from '/public/images/mesbah_pro.jpg';

const AboutUs = () => {
    return (
        <section id="about" className="py-16 bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
                    {/* Left Side: Optimized Image */}
                    <div className="w-full lg:w-2/5">
                        <div className="relative rounded-lg overflow-hidden aspect-square max-w-md mx-auto">
                            <Image
                                src={mesbah}
                                alt="Ataullah Mesbah"
                                fill
                                placeholder='blur'
                                className="object-cover"
                                sizes="(max-width: 768px) 80vw, 40vw"
                            />
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="w-full lg:w-3/5 text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-sky-500 mb-5">
                            About Ataullah Mesbah
                        </h2>

                        <div className="space-y-5 text-gray-300 leading-relaxed">
                            <p className="text-base sm:text-lg">
                                A Full Stack Developer and SEO Specialist with 6+ years of experience creating high-performance digital solutions that drive business growth.
                            </p>
                            <p className="text-base sm:text-lg">
                                Specializing in <span className="text-purple-400 font-medium">Next.js</span>, <span className="text-purple-400 font-medium">React</span>, and <span className="text-purple-400 font-medium">Node.js</span>, I combine technical expertise with strategic thinking to deliver measurable results for clients worldwide.
                            </p>
                            <p className="text-base sm:text-lg">
                                My global perspective, shaped by travels to 15+ countries, informs innovative approaches to solving complex digital challenges.
                            </p>
                        </div>
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