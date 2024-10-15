'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaCaretUp, FaCaretDown } from 'react-icons/fa';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const closeDropdown = () => {
        setIsDropdownOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
        if (isDropdownOpen) closeDropdown(); // Ensure the dropdown closes when the mobile menu closes
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // Close mobile menu when clicking outside of it
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                closeMobileMenu();
            }
        };
        if (isMobileMenuOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isMobileMenuOpen]);

    // Function to apply active class based on current path
    const isActiveLink = (path) => {
        return pathname === path ? 'text-gray-400' : 'text-white';
    };

    return (
        <div className="bg-gray-900 py-5 border-b border-b-gray-800">
            <nav className="flex poppins-regular container mx-auto justify-between text-white items-center px-4">
                {/* Logo */}
                <Link href="/">
                    <h3 className="text-2xl amsfonts">mesbah TX</h3>
                </Link>

                {/* Mobile Menu Icon */}
                <div className="lg:hidden">
                    <button onClick={toggleMobileMenu} className="focus:outline-none text-2xl">
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Links */}
                <div
                    ref={menuRef} // Reference for outside click handling
                    className={`fixed top-0 right-0 h-full bg-gray-900 text-white w-64 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        } transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-auto lg:flex lg:items-center lg:bg-transparent lg:translate-x-0 lg:h-auto`}
                >
                    <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-4 px-6 py-8 lg:py-0 lg:px-0">
                        <Link href="/" className={`${isActiveLink('/')} px-4`} onClick={closeMobileMenu}>
                            Home
                        </Link>

                        {/* Services Dropdown */}
                        <div className="inline-block relative">
                            <button onClick={toggleDropdown} className="flex items-center focus:outline-none px-4">
                                Marketing Services
                                {isDropdownOpen ? <FaCaretUp className="ml-1" /> : <FaCaretDown className="ml-1" />}
                            </button>

                            {isDropdownOpen && (
                                <div
                                    className="absolute left-0 mt-2 w-96 bg-gray-700 shadow-lg rounded-lg py-2 z-20"
                                    onMouseLeave={closeDropdown}
                                >
                                    <Link
                                        href="/web-development"
                                        className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                        onClick={closeMobileMenu}
                                    >
                                        Web Development
                                    </Link>
                                    <Link
                                        href="/seo"
                                        className="block px-4 py-2 w-full text-gray-100 hover:bg-gray-800"
                                        onClick={closeMobileMenu}
                                    >
                                        Search Engine Optimization
                                    </Link>
                                    <Link
                                        href="/affiliate-program"
                                        className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                        onClick={closeMobileMenu}
                                    >
                                        Affiliate Program
                                    </Link>
                                </div>
                            )}
                        </div>

                        <Link href="/blog" className={`${isActiveLink('/blog')} px-4`} onClick={closeMobileMenu}>
                            Blog
                        </Link>
                        <Link href="/letter" className={`${isActiveLink('/blog')} px-4`} onClick={closeMobileMenu}>
                            Letter
                        </Link>
                        <Link href="/about" className={`${isActiveLink('/about')} px-4`} onClick={closeMobileMenu}>
                            About
                        </Link>
                        <Link href="/contact" className={`${isActiveLink('/contact')} px-4`} onClick={closeMobileMenu}>
                            Contact
                        </Link>
                        <Link href="/login" className={`${isActiveLink('/login')} px-4`} onClick={closeMobileMenu}>
                            Login
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
