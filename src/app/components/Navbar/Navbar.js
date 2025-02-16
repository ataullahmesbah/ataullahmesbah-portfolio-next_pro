'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { useAuth } from '@/providers/AuthProvider';




const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);
    const { user, logout } = useAuth();

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

    if (!pathname.includes('dashboard')) {

        return (
            <div className="bg-gray-900 py-5 border-b border-b-gray-800">
                <nav className="flex poppins-regular container mx-auto justify-between text-white items-center px-4">
                    {/* Logo */}
                    <Link href="/">

                        <h1 className="flex justify-center items-center">
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 440.15 57.69"
                                className="w-full h-auto"
                            >
                                <defs>
                                    <style>
                                        {`.cls-1, .cls-3, .cls-4 {
                                fill: #fff;
                            }
                            .cls-1 {
                                stroke: #e6e6e6;
                                stroke-miterlimit: 10;
                                stroke-width: 2px;
                            }
                            .cls-2 {
                                font-size: 31px;
                                font-family: BritannicBold, Britannic ;
                            }
                            .cls-3 {
                                font-size: 38px;
                                font-family: BritannicBold, Britannic Regular;
                            }`}
                                    </style>
                                </defs>
                                <rect
                                    className="cls-1"
                                    x="150.01"
                                    y="4.95"
                                    width="49"
                                    height="36.35"
                                    rx="8.75"
                                />
                                <text
                                    className="cls-2"
                                    transform="translate(155.72 31.58) scale(0.96 1)"
                                >
                                    am
                                </text>
                                <text
                                    className="cls-3"
                                    transform="translate(0 33.34) scale(1.03 1)"
                                >
                                    ataullah
                                </text>
                                <text className="cls-3" transform="translate(205 33.34)">
                                    mesbah
                                </text>
                                <polygon
                                    className="cls-4"
                                    points="47.06 49.22 284.59 49.22 57.65 57.69 47.06 49.22"
                                />
                            </svg>
                        </h1>


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
                        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-2 px-6 py-8 lg:py-0 lg:px-0">
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
                                        {/* <Link
                                                href="/affiliate-program"
                                                className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                                onClick={closeMobileMenu}
                                            >
                                                Affiliate Program
                                            </Link> */}
                                    </div>
                                )}
                            </div>

                            <Link href="/blog" className={`${isActiveLink('/blog')} px-4`} onClick={closeMobileMenu}>
                                Blog
                            </Link>
                            <Link href="/letter" className={`${isActiveLink('/letter')} px-4`} onClick={closeMobileMenu}>
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



                            {/* conditional user */}

                            {user ? (
                                <>
                                    {user.role === "admin" ? (
                                        <Link href="/admin/dashboard">Admin Dashboard</Link>
                                    ) : (
                                        <Link href="/user/dashboard">User Dashboard</Link>
                                    )}
                                    <button onClick={logout}>Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">Login</Link>
                                    <Link href="/register">Register</Link>
                                </>
                            )}
                            {/* conditional user end */}

                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    else {
        return <></>
    }
};
export default Navbar;
