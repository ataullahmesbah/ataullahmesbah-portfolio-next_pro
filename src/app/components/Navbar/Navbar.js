'use client'

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="bg-blue-100 py-5">
            <nav className="flex amsfonts container mx-auto justify-between items-center">
                {/* Logo */}
                <div>
                    <h3 className="text-2xl">
                        mesbah TX
                    </h3>
                </div>

                {/* Links */}
                <div className="space-x-4 relative">
                    <Link href='/'>
                        Home
                    </Link>

                    {/* Services Dropdown */}
                    <div className="inline-block relative">
                        <button onClick={toggleDropdown} className="focus:outline-none">
                            Services
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10">
                                <Link href='/web-development' className="block px-4 py-2 text-gray-800 hover:bg-blue-200">
                                    Web Developer
                                </Link>
                                <Link href='/seo' className="block px-4 py-2 text-gray-800 hover:bg-blue-200">
                                    Search Engine Optimization
                                </Link>
                                <Link href='/affiliate-program' className="block px-4 py-2 text-gray-800 hover:bg-blue-200">
                                    Affiliate Program
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href='/aboutus'>
                        About Us
                    </Link>
                    <Link href='/'>
                        Contact Us
                    </Link>
                    <Link href='/'>
                        Login
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
