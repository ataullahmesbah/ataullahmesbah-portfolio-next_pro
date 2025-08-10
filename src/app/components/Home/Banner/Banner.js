'use client';
import { motion } from 'framer-motion';
import LeftSideBanner from './LeftSideBanner/LeftSideBanner';
import RightSideBanner from './RightSideBanner/RightSideBanner';
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from 'react';

const Banner = () => {
    useEffect(() => {
        AOS.init({
            duration: 800, // animation speed
            easing: "ease-in-out",
            once: true, // একবারই animation হবে
        });
    }, []);

    return (
        <motion.div
            className="relative  w-full bg-gray-900 text-white flex items-center justify-center overflow-hidden px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Subtle Background Grid Pattern */}
            <div
                className="absolute inset-0 z-0 opacity-10"
                style={{
                    backgroundImage:
                        'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            ></div>

            {/* Radial Gradient */}
            <div className="absolute inset-0 z-10 bg-gray-900 [mask-image:radial-gradient(ellipse_at_center,transparent_10%,black)]"></div>

            {/* Content Container */}
            <div className="relative z-20 w-full max-w-7xl mx-auto py-20 flex flex-col md:flex-row gap-16 lg:gap-8 items-center">
                {/* Left Column */}
                <div
                    data-aos="zoom-out-right"
                    className="w-full md:w-5/12 lg:w-2/5"
                >
                    <LeftSideBanner />
                </div>

                {/* Right Column */}
                <div
                    data-aos="zoom-in-down"
                    className="w-full md:w-7/12 lg:w-3/5 mt-8 md:mt-0 flex justify-center"
                >
                    <RightSideBanner />
                </div>
            </div>
        </motion.div>
    );
};

export default Banner;
