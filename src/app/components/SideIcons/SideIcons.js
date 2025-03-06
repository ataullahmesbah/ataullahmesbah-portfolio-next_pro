'use client';

import { useState, useEffect } from 'react';
import { FaLinkedin, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';

const SideIcons = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const modal = document.getElementById('side-icons-modal');
            const button = document.getElementById('side-icons-button');
            if (modal && !modal.contains(event.target) && button && !button.contains(event.target)) {
                setIsClicked(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-50">
            <div
                id="side-icons-modal"
                className={`bg-gray-800/75 opacity-55 backdrop-blur-md rounded-l-lg shadow-lg transition-all duration-500 ease-in-out overflow-hidden ${isHovered || isClicked ? 'w-48' : 'w-10'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsClicked(!isClicked)}
            >
                {/* Icon Badge */}
                <div
                    id="side-icons-button"
                    className={`flex items-center  justify-center transition-opacity duration-300 ${isHovered || isClicked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                >
                    <div className="text-white text-2xl cursor-pointer animate-spin ">+</div>
                </div>

                {/* Social Icons */}
                <div className={`flex items-center justify-center space-x-4 p-2 ${isHovered || isClicked ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}> 
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group">
                        <FaLinkedin className="text-white text-2xl hover:text-gray-400 transition duration-300" />
                        <span className="hidden group-hover:block bg-black text-white text-xs rounded-md px-2 py-1 absolute top-14 opacity-75">LinkedIn</span>
                    </a>

                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group">
                        <FaGithub className="text-white text-2xl hover:text-gray-400 transition duration-300" />
                        <span className="hidden group-hover:block bg-black text-white text-xs rounded-md px-2 py-1 absolute top-14 opacity-75">Github</span>
                    </a>

                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group">
                        <FaTwitter className="text-white text-2xl hover:text-gray-400 transition duration-300" />
                        <span className="hidden group-hover:block bg-black text-white text-xs rounded-md px-2 py-1 absolute top-14 opacity-75">Twitter</span>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group">
                        <FaInstagram className="text-white text-2xl hover:text-gray-400 transition duration-300" />
                        <span className="hidden group-hover:block bg-black text-white text-xs rounded-md px-2 py-1 absolute top-2 opacity-75">Instagram</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SideIcons;
