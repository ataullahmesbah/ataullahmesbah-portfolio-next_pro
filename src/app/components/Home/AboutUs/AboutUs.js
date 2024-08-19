import Image from 'next/image';

const AboutUs = () => {
    return (
        <section id="about" className="py-20 bg-gray-100">
            <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center  gap-10 lg:gap-20">
                    {/* Left Side: Image with Gradient Overlay */}

                    <div className="bg-gray-300   shadow-md shadow-gray-200">

                        <Image
                            src='https://i.ibb.co/28H1fjQ/mesbah-2.png'
                            alt="Banner Image"

                            objectFit="cover"
                            width={500}
                            height={500}
                            className="opacity-65 w-72"
                        />


                    </div>

                    {/* Right Side: Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            About Ataullah Mesbah
                        </h2>
                        <p className="text-base sm:text-lg text-gray-700 mb-4">
                            Hello! I'm Ataullah Mesbah, a passionate developer, SEO expert, and traveler with a love for creating dynamic web applications and exploring new places. With a background in software development and a knack for problem-solving, I specialize in building intuitive and efficient digital solutions.
                        </p>
                        <p className="text-base sm:text-lg text-gray-700 mb-6">
                            My journey in the tech world has been both challenging and rewarding. I've had the opportunity to work on a variety of projects that span across different industries. Whether it's crafting a sleek website or optimizing it for search engines, I'm dedicated to delivering high-quality results.
                        </p>
                        <a href="#contact" className="inline-block bg-[#00CCFF] text-white py-2 px-6 rounded-lg hover:bg-opacity-80 transition duration-300">
                            Get in Touch
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
