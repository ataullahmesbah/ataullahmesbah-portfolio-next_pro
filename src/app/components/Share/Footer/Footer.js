import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {/* Logo and Description */}
                    <div className="lg:col-span-1">
                        <div className="flex justify-center md:justify-start">
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700.15 57.69"
                                className="w-full max-w-xs h-auto"
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
                        </div>
                        <p className="text-sm mt-3 text-center md:text-left">Web Developer | SEO Specialist | Traveler</p>
                        <p className="text-xs text-gray-400 mt-2 text-center md:text-left">
                            Creating modern websites, enhancing search visibility, and discovering new horizons.
                        </p>
                    </div>



                    {/* Contact Section */}
                    <div className="lg:col-span-1">
                        <h6 className="font-semibold text-white mb-3 amsfonts text-center md:text-left">Contact Now</h6>
                        <p className="text-sm text-gray-400 mb-3 text-center md:text-left">
                            Don’t miss our future updates! Get Subscribed Today!
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <Link href='/contact'>
                                <button className="text-sm text-white bg-sky-900/30 hover:bg-sky-900/50 p-2 px-4 rounded-md transition-colors duration-200">
                                    Subscribe
                                </button>
                            </Link>
                        </div>
                    </div>



                    {/* Social Icons */}
                    <div className="lg:col-span-1">
                        <h6 className=" text-white mb-4 amsfonts text-center md:text-left">Connect With Me</h6>
                        <ul className="flex space-x-4 justify-center md:justify-start">
                            <li>
                                <a href="https://www.facebook.com/ataullahmesbah10" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                                    <FaFacebookF size={18} />
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/ataullah_mesbah" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors duration-200">
                                    <FaTwitter size={18} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/ataullah-mesbah/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors duration-200">
                                    <FaLinkedinIn size={18} />
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/ataullahmesbah" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500 transition-colors duration-200">
                                    <FaGithub size={18} />
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* Quick Links */}
                    <div className="lg:col-span-1">
                        <h6 className="font-semibold text-white mb-4 amsfonts text-center md:text-left">Quick Links</h6>
                        <ul className="space-y-1">
                            {[
                                { href: "/featured-story", label: "Feature Story" },
                                { href: "/mesbahoffwego", label: "Travel Story" },
                                { href: "/projects", label: "Projects" },
                                { href: "/blog", label: "Blog" }
                            ].map((link) => (
                                <li key={link.href} className="text-center md:text-left">
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-gray-200 transition-colors duration-200 text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className="mt-12 border-t border-gray-700 pt-6 text-center">
                    <p className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} Ataullah Mesbah. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;