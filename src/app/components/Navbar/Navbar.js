'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaCaretUp, FaCaretDown, FaUserGraduate, FaUserCircle } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

const Navbar = () => {
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);

    const { data: session, status } = useSession();



    const toggleServicesDropdown = () => {
        setIsServicesDropdownOpen((prevState) => !prevState);
        setIsUserDropdownOpen(false); // Close user dropdown when services dropdown is opened
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen((prevState) => !prevState);
        setIsServicesDropdownOpen(false); // Close services dropdown when user dropdown is opened
    };

    const closeAllDropdowns = () => {
        setIsServicesDropdownOpen(false);
        setIsUserDropdownOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
        closeAllDropdowns(); // Close all dropdowns when mobile menu is toggled
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const closeUserDropdown = () => {
        setIsUserDropdownOpen(false);
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
                                <button onClick={toggleServicesDropdown} className="flex items-center focus:outline-none px-4">
                                    Marketing Services
                                    {isServicesDropdownOpen ? <FaCaretUp className="ml-1" /> : <FaCaretDown className="ml-1" />}
                                </button>

                                {isServicesDropdownOpen && (
                                    <div
                                        className="absolute left-0 mt-2 w-96 bg-gray-700 shadow-lg rounded-lg py-2 z-20"
                                        onMouseLeave={closeAllDropdowns}
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





                            <div className="">
                                {/* User Profile Dropdown */}
                                {session ? (
                                    <div className="relative">
                                        {/* Icon Button to Open Dropdown */}
                                        <button onClick={toggleUserDropdown} className="flex items-center focus:outline-none px-4">
                                            <div className="flex flex-col items-center">
                                                {session?.user?.image ? (
                                                    <Image
                                                        src={session.user.image}
                                                        alt="User Profile"
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full items-center w-8 h-8 border-2 border-gray-400 object-cover"
                                                    />
                                                ) : (
                                                    <FaUserGraduate className="text-2xl text-gray-300" />
                                                )}

                                            </div>
                                        </button>

                                        {/* Dropdown Content */}
                                        {isUserDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-lg py-2 z-20">
                                                {/* Show Image Inside Dropdown */}
                                                <div className="flex flex-col items-center p-4">
                                                    {session?.user?.image ? (
                                                        <Image
                                                            src={session.user.image}
                                                            alt="User Profile"
                                                            width={50}
                                                            height={50}
                                                            className="rounded-full w-12 h-12 border-2 border-gray-400 object-cover"
                                                        />
                                                    ) : (
                                                        <FaUserGraduate className="text-2xl text-gray-300" />
                                                    )}
                                                    <div className="text-white mt-2">{session.user.name}</div>
                                                    <div className="text-sm text-gray-400">Mr. {session.user.role}</div>
                                                </div>

                                                {/* Role-Based Links */}
                                                {session.user.role === "admin" && (
                                                    <Link
                                                        href="/admin-dashboard"
                                                        className="block px-4 py-2 text-white hover:bg-gray-800"
                                                        onClick={closeUserDropdown}
                                                    >
                                                        Admin Dashboard
                                                    </Link>
                                                )}
                                                {session.user.role === "moderator" && (
                                                    <Link
                                                        href="/moderator-dashboard"
                                                        className="block px-4 py-2 text-white hover:bg-gray-800"
                                                        onClick={closeUserDropdown}
                                                    >
                                                        Moderator Dashboard
                                                    </Link>
                                                )}
                                                {session.user.role === "user" && (
                                                    <Link
                                                        href="/user-dashboard"
                                                        className="block px-4 py-2 text-white hover:bg-gray-800"
                                                        onClick={closeUserDropdown}
                                                    >
                                                        User Dashboard
                                                    </Link>
                                                )}

                                                {/* Profile & Logout */}
                                                <Link
                                                    href="/profile"
                                                    className="block px-4 py-2 text-white hover:bg-gray-800"
                                                    onClick={closeUserDropdown}
                                                >
                                                    Profile
                                                </Link>

                                                <button
                                                    onClick={() => signOut({ callbackUrl: "/" })}
                                                    className="block w-full px-4 py-2 text-left text-white hover:bg-gray-800"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex space-x-4">
                                        <Link href="/login" className="px-4 text-white">
                                            Login
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }

    return <></>;
};

export default Navbar;