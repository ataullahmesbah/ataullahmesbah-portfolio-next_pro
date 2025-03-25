// src/app/components/RightSideBanner.js
'use client';

import Image from 'next/image';
import { FaFacebook, FaCog, FaLinkedin } from 'react-icons/fa'; // Font Awesome icons
import { SiBehance } from 'react-icons/si'; // Simple Icons for Behance

const RightSideBanner = () => {
    // Array of icons with their positions (angle in degrees) on the circular path
    const socialIcons = [
        { icon: <FaFacebook />, angle: 0 }, // Top
        { icon: <FaCog />, angle: 45 }, // Top-right (Settings icon)
        { icon: <SiBehance />, angle: 90 }, // Right
        { icon: <FaLinkedin />, angle: 135 }, // Bottom-right
    ];

    return (
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
            {/* Circular Image */}
            <div className="relative">
                <Image
                    src="https://i.ibb.co/gR2V4cn/image.jpg"
                    alt="Banner Image"
                    width={400}
                    height={400}
                    objectFit="cover"
                    className="rounded-full w-64 h-64 md:w-80 md:h-80"
                />

                {/* Dotted Circular Path with Icons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-10 md:translate-x-20">
                    {/* SVG for Dotted Circular Path */}
                    <svg
                        className="absolute"
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <circle
                            cx="100"
                            cy="100"
                            r="80"
                            stroke="#4B5563" // gray-600
                            strokeWidth="2"
                            strokeDasharray="5,5" // Dotted pattern
                            fill="none"
                        />
                    </svg>

                    {/* Icons on the Circular Path */}
                    {socialIcons.map((item, index) => {
                        const radius = 80; // Radius of the circular path (matches SVG circle)
                        const angle = item.angle * (Math.PI / 180); // Convert degrees to radians
                        const x = 100 + radius * Math.cos(angle); // X position (center at 100)
                        const y = 100 + radius * Math.sin(angle); // Y position (center at 100)

                        return (
                            <div
                                key={index}
                                className="absolute flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 border border-gray-600 text-white hover:bg-blue-500 hover:border-blue-500 transition-colors"
                                style={{
                                    left: `${x}px`,
                                    top: `${y}px`,
                                    transform: 'translate(-50%, -50%)', // Center the icon
                                }}
                            >
                                <span className="text-lg">{item.icon}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RightSideBanner;