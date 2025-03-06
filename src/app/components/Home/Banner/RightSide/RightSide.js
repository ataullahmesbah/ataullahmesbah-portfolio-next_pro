'use client';

import Image from 'next/image';
 // Icons for example
import { useState } from 'react';

import { FaLinkedin, FaGithub, FaDribbble, FaTwitter, FaInstagram } from 'react-icons/fa';

const RightSideBanner = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
            {/* Circular Image */}
            <div className="border-2 p-3 rounded-full border-gray-800 relative">
                <Image
                    src='https://i.ibb.co/gR2V4cn/image.jpg'
                    alt="Banner Image"
                    width={500}
                    height={500}
                    objectFit="cover"
                    className="rounded-full w-72 h-72 md:w-96 md:h-96"
                />

                {/* Circular Section on Right Side */}
                <div
                    className={`absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center transition-all duration-500 ${isHovered ? 'w-48' : ''}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Icons */}
                    <div className={`flex space-x-4 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-400 transition-colors duration-300"
                        >
                            <FaLinkedin className="text-2xl" />
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-400 transition-colors duration-300"
                        >
                            <FaGithub className="text-2xl" />
                        </a>
                        <a
                            href="https://dribbble.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-400 transition-colors duration-300"
                        >
                            <FaDribbble className="text-2xl" />
                        </a>
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-400 transition-colors duration-300"
                        >
                            <FaTwitter className="text-2xl" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-400 transition-colors duration-300"
                        >
                            <FaInstagram className="text-2xl" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSideBanner;