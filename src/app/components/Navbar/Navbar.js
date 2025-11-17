'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBars, FaTimes, FaCaretUp, FaCaretDown, FaUserGraduate, FaShoppingCart } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import CartSlider from '@/app/Dashboard/Shop/CartSlider/CartSlider';
import MainLogo from '../Share/MainLogo/MainLogo';

const Navbar = () => {
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isInsightsDropdownOpen, setIsInsightsDropdownOpen] = useState(false); // ✅ আলাদা state
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const pathname = usePathname();
    const menuRef = useRef(null);
    const { data: session, status } = useSession();
    const [isSEODropdownOpen, setIsSEODropdownOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    // Conversion rates for CartSlider
    const conversionRates = {
        USD: 120, // 1 USD = 120 BDT
        EUR: 130, // 1 EUR = 130 BDT
        BDT: 1,
    };

    // Check if the device is desktop (for hover effects)
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Handlers for Services dropdown hover
    let servicesTimeout;
    const handleServicesEnter = () => {
        clearTimeout(servicesTimeout);
        setIsServicesDropdownOpen(true);
    };
    const handleServicesLeave = () => {
        servicesTimeout = setTimeout(() => {
            setIsServicesDropdownOpen(false);
            setIsSEODropdownOpen(false); // Close SEO dropdown when Services dropdown closes
        }, 300);
    };

    // Handlers for Insights dropdown hover
    let insightsTimeout;
    const handleInsightsEnter = () => {
        clearTimeout(insightsTimeout);
        setIsInsightsDropdownOpen(true);
    };
    const handleInsightsLeave = () => {
        insightsTimeout = setTimeout(() => {
            setIsInsightsDropdownOpen(false);
        }, 300);
    };

    // Handlers for SEO dropdown hover
    let seoTimeout;
    const handleSEOEnter = () => {
        clearTimeout(seoTimeout);
        setIsSEODropdownOpen(true);
    };
    const handleSEOLeave = () => {
        seoTimeout = setTimeout(() => {
            setIsSEODropdownOpen(false);
        }, 300);
    };

    // Update cart count from localStorage
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
        };
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);
        return () => {
            window.removeEventListener('storage', updateCartCount);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    // Toggle Services dropdown for mobile
    const toggleServicesDropdown = () => {
        setIsServicesDropdownOpen((prevState) => !prevState);
        setIsInsightsDropdownOpen(false); // ✅ Close insights when services opens
        setIsUserDropdownOpen(false);
        setIsCartOpen(false);
        setIsSEODropdownOpen(false);
    };

    // Toggle Insights dropdown for mobile
    const toggleInsightsDropdown = () => {
        setIsInsightsDropdownOpen((prevState) => !prevState);
        setIsServicesDropdownOpen(false); // ✅ Close services when insights opens
        setIsUserDropdownOpen(false);
        setIsCartOpen(false);
        setIsSEODropdownOpen(false);
    };

    // Toggle SEO dropdown for mobile
    const toggleSEODropdown = () => {
        setIsSEODropdownOpen((prevState) => !prevState);
        setIsUserDropdownOpen(false);
        setIsCartOpen(false);
    };

    // Toggle User dropdown
    const toggleUserDropdown = () => {
        setIsUserDropdownOpen((prevState) => !prevState);
        setIsServicesDropdownOpen(false);
        setIsInsightsDropdownOpen(false); // ✅ Close insights
        setIsSEODropdownOpen(false);
        setIsCartOpen(false);
    };

    // Close all dropdowns
    const closeAllDropdowns = () => {
        setIsServicesDropdownOpen(false);
        setIsInsightsDropdownOpen(false); // ✅ Close insights
        setIsSEODropdownOpen(false);
        setIsUserDropdownOpen(false);
        setIsCartOpen(false);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
        closeAllDropdowns();
    };

    // Close mobile menu
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsServicesDropdownOpen(false);
        setIsInsightsDropdownOpen(false); // ✅ Close insights
        setIsSEODropdownOpen(false);
    };

    // Close user dropdown
    const closeUserDropdown = () => {
        setIsUserDropdownOpen(false);
    };

    // Close mobile menu when clicking outside
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
            <div className="bg-gray-900 py-5 border-b border-gray-800">
                <nav className="flex poppins-regular container mx-auto justify-between text-white items-center px-4">
                    {/* Logo */}
                    <Link href="/">
                        <h1 className="flex justify-center items-center ">
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
                      font-family: BritannicBold, Britannic;
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


                            {/* <MainLogo /> */}
                        </h1>
                    </Link>

                    {/* Mobile Menu Icon and Cart */}
                    <div className="lg:hidden flex items-center space-x-4">
                        {cartCount > 0 && (
                            <button onClick={() => setIsCartOpen(true)} className="relative">
                                <FaShoppingCart className="text-2xl text-white" />
                                <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </button>
                        )}
                        <button onClick={toggleMobileMenu} className="focus:outline-none text-2xl">
                            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>

                    {/* Links */}
                    <div
                        ref={menuRef}
                        className={`fixed top-0 right-0 h-full bg-gray-900 text-white w-64 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                            } transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-auto lg:flex lg:items-center lg:bg-transparent lg:translate-x-0 lg:h-auto`}
                    >
                        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-2 px-6 py-8 lg:py-0 lg:px-0">
                            <Link href="/" className={`${isActiveLink('/')} px-4`} onClick={closeMobileMenu}>
                                Home
                            </Link>

                            {/* Services Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={isDesktop ? handleServicesEnter : null}
                                onMouseLeave={isDesktop ? handleServicesLeave : null}
                            >
                                <button
                                    onClick={!isDesktop ? toggleServicesDropdown : null}
                                    className="flex items-center focus:outline-none px-4"
                                >
                                    Marketing Services
                                    {isServicesDropdownOpen ? <FaCaretUp className="ml-1" /> : <FaCaretDown className="ml-1" />}
                                </button>

                                {isServicesDropdownOpen && (
                                    <div
                                        className={`${isDesktop ? 'absolute left-0 mt-2' : 'relative'} ${isDesktop ? 'w-96' : 'w-full'
                                            } bg-gray-700 shadow-lg rounded-lg py-2 z-20`}
                                        onMouseEnter={isDesktop ? handleServicesEnter : null}
                                        onMouseLeave={isDesktop ? handleServicesLeave : null}
                                    >
                                        <Link
                                            href="/web-development"
                                            className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                            onClick={closeMobileMenu}
                                        >
                                            Web Development
                                        </Link>

                                        {/* SEO Dropdown */}
                                        <div
                                            className="relative"
                                            onMouseEnter={isDesktop ? handleSEOEnter : null}
                                            onMouseLeave={isDesktop ? handleSEOLeave : null}
                                        >
                                            <button
                                                onClick={!isDesktop ? toggleSEODropdown : null}
                                                className="flex items-center justify-between w-full px-4 py-2 text-gray-100 hover:bg-gray-800"
                                            >
                                                <span>SEO Services</span>
                                                {isSEODropdownOpen ? <FaCaretUp className="ml-1" /> : <FaCaretDown className="ml-1" />}
                                            </button>

                                            {isSEODropdownOpen && (
                                                <div
                                                    className={`${isDesktop ? 'absolute left-full top-0 ml-1' : 'relative ml-4'} ${isDesktop ? 'w-64' : 'w-full'
                                                        } bg-gray-700 shadow-lg rounded-lg py-2 z-30`}
                                                    onMouseEnter={isDesktop ? handleSEOEnter : null}
                                                    onMouseLeave={isDesktop ? handleSEOLeave : null}
                                                >
                                                    <Link
                                                        href="/seo"
                                                        className="block px-4 py-2 text-gray-100 hover:bg-gray-800 border-b border-gray-600"
                                                        onClick={closeMobileMenu}
                                                    >
                                                        SEO Strategy
                                                    </Link>
                                                    <Link
                                                        href="/seo/geo-sge-optimization"
                                                        className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                                        onClick={closeMobileMenu}
                                                    >
                                                        GEO - SGE Optimization
                                                    </Link>
                                                    <Link
                                                        href="/seo/technical-seo"
                                                        className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                                        onClick={closeMobileMenu}
                                                    >
                                                        Technical SEO
                                                    </Link>

                                                    <Link
                                                        href="/seo/ecommerce-seo"
                                                        className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                                        onClick={closeMobileMenu}
                                                    >
                                                        E-commerce SEO
                                                    </Link>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            href="/affiliate"
                                            className="block px-4 py-2 w-full text-gray-100 hover:bg-gray-800"
                                            onClick={closeMobileMenu}
                                        >
                                            Affiliate Program
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link href="/shop" className={`${isActiveLink('/shop')} px-4`} onClick={closeMobileMenu}>
                                Shop
                            </Link>
                            <Link href="/blog" className={`${isActiveLink('/blog')} px-4`} onClick={closeMobileMenu}>
                                Blog
                            </Link>

                            {/* Insights Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={isDesktop ? handleInsightsEnter : null}
                                onMouseLeave={isDesktop ? handleInsightsLeave : null}
                            >
                                <button
                                    onClick={!isDesktop ? toggleInsightsDropdown : null}
                                    className="flex items-center focus:outline-none px-4"
                                >
                                    Insights
                                    {isInsightsDropdownOpen ? <FaCaretUp className="ml-1" /> : <FaCaretDown className="ml-1" />}
                                </button>

                                {isInsightsDropdownOpen && (
                                    <div
                                        className={`${isDesktop ? 'absolute left-0 mt-2' : 'relative'} ${isDesktop ? 'w-48' : 'w-full'
                                            } bg-gray-700 shadow-lg rounded-lg py-2 z-20`}
                                        onMouseEnter={isDesktop ? handleInsightsEnter : null}
                                        onMouseLeave={isDesktop ? handleInsightsLeave : null}
                                    >
                                        <Link
                                            href="/letter"
                                            className="block px-4 py-2 text-gray-100 hover:bg-gray-800"
                                            onClick={closeMobileMenu}
                                        >
                                            Letter
                                        </Link>

                                        <Link
                                            href="/featured-story"
                                            className="block px-4 py-2 w-full text-gray-100 hover:bg-gray-800"
                                            onClick={closeMobileMenu}
                                        >
                                            Featured Story
                                        </Link>
                                        <Link
                                            href="/mesbahoffwego"
                                            className="block px-4 py-2 w-full text-gray-100 hover:bg-gray-800"
                                            onClick={closeMobileMenu}
                                        >
                                            Travel Story
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <Link href="/about" className={`${isActiveLink('/about')} px-4`} onClick={closeMobileMenu}>
                                About
                            </Link>
                            <Link href="/contact" className={`${isActiveLink('/contact')} px-4`} onClick={closeMobileMenu}>
                                Contact
                            </Link>

                            {/* Cart Icon for Desktop */}
                            {cartCount > 0 && (
                                <button onClick={() => setIsCartOpen(true)} className="relative px-4 hidden lg:block">
                                    <FaShoppingCart className="text-2xl text-white" />
                                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                </button>
                            )}

                            {/* User Profile Dropdown */}
                            {session ? (
                                <div className="relative">
                                    <button
                                        onClick={toggleUserDropdown}
                                        className="flex items-center focus:outline-none px-4"
                                    >
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

                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-700 shadow-lg rounded-lg py-2 z-20">
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
                </nav>
                <CartSlider isOpen={isCartOpen} setIsOpen={setIsCartOpen} conversionRates={conversionRates} />
            </div>
        );
    }

    return <></>;
};

export default Navbar;