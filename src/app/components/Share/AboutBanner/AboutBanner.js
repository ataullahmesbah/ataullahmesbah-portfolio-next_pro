'use client';

import { FaFacebook, FaTwitter, FaLinkedin, FaMedium } from "react-icons/fa";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import mesbah from '/public/images/banner/mesbah1.jpg';

const AboutBanner = () => {
    useEffect(() => {
        AOS.init({ duration: 2000 });
    }, []);

    return (
        <div
            className="relative w-full h-[70vh] lg:h-[75vh] flex items-center justify-center text-center bg-cover bg-center poppins-regular"
            style={{
                backgroundImage: `url(${mesbah.src})`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Content */}
            <div className="relative z-10 text-white px-4 lg:px-0 max-w-2xl md:max-w-4xl lg:max-w-6xl w-full " data-aos="fade-up">
                <h1 className="text-3xl md:text-4xl  font-bold mb-4">
                    Hello, I’m Ataullah Mesbah – Your Partner <br className="hidden lg:block" /> in Digital Growth
                </h1>

                <p className="text-lg md:text-xl lg:text-2xl mb-6">
                    A Passionate SEO Expert & Web Developer, dedicated to driving digital success and building innovative web solutions.
                </p>



                {/* Social Media Icons */}
                <div className="flex justify-center  gap-6 mb-6">
                    <a href="https://www.facebook.com/ataullah.mesbah.7" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition duration-300">
                        <FaFacebook size={30} />
                    </a>
                    <a href="https://x.com/ataullah_mesbah" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition duration-300">
                        <FaTwitter size={30} />
                    </a>
                    <a href="https://www.linkedin.com/in/ataullah-mesbah" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-700 transition duration-300">
                        <FaLinkedin size={30} />
                    </a>
                    <a href="https://medium.com/@ataullahmesbah" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition duration-300">
                        <FaMedium size={30} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default AboutBanner;
