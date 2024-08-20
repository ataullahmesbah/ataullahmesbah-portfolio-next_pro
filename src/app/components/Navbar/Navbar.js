'use client'

import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="bg-blue-100 py-5">
            <nav className="flex amsfonts container mx-auto justify-between items-center px-4">
                {/* Logo */}
                <div>
                    <h3 className="text-2xl">
                        mesbah TX
                    </h3>
                </div>

                {/* Mobile Menu Icon */}
                <div className="lg:hidden">
                    <button onClick={toggleMobileMenu} className="focus:outline-none text-2xl">
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Links */}
                <div className={`space-x-4 lg:flex items-center ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block absolute lg:relative lg:w-auto w-full bg-blue-100 lg:bg-transparent left-0 top-16 lg:top-0 z-10 lg:z-auto lg:py-0 py-5 px-4`}>
                    <Link href='/' onClick={() => setIsMobileMenuOpen(false)}>
                        Home
                    </Link>

                    {/* Services Dropdown */}
                    <div className="inline-block relative">
                        <button onClick={toggleDropdown} className="focus:outline-none">
                            Services
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-20">
                                <Link href='/web-development' className="block px-4 py-2 text-gray-800 hover:bg-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                    Web Developer
                                </Link>
                                <Link href='/seo' className="block px-4 py-2 text-gray-800 hover:bg-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                    Search Engine Optimization
                                </Link>
                                <Link href='/affiliate-program' className="block px-4 py-2 text-gray-800 hover:bg-blue-200" onClick={() => setIsMobileMenuOpen(false)}>
                                    Affiliate Program
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link href='/about' onClick={() => setIsMobileMenuOpen(false)}>
                        About
                    </Link>
                    <Link href='/contactus' onClick={() => setIsMobileMenuOpen(false)}>
                        Contact Us
                    </Link>
                    <Link href='/login' onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
