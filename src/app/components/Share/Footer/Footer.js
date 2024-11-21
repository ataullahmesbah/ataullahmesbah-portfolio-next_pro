import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 poppins-regular">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <h1 className="flex justify-center items-center">
                            <svg
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 700.15 57.69"
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

                        <p className="text-sm mt-2">Web Developer | SEO Specialist | Traveler</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Creating modern websites, enhancing search visibility, and discovering new horizons.
                        </p>

                    </div>



                    {/* Middle Section - Navigation Links */}
                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <h6 className="font-semibold text-white mb-2">Contact Now</h6>
                        <p className="text-sm text-gray-400 mb-2">Don’t miss our future updates! Get Subscribed Today!</p>
                        <Link href='/contact'>
                            <button className="text-sm text-white bg-opacity-30 bg-sky-900 p-1 px-2 rounded-md  ">Subscribe</button>
                        </Link>
                    </div>

                    {/* Right Section - Social Icons */}
                    <div className="md:w-1/3">
                        <ul className="flex space-x-4 justify-center md:justify-start">
                            <li>
                                <a href="https://www.facebook.com/ataullah.mesbah.7" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                                    <FaFacebookF />
                                </a>
                            </li>
                            <li>
                                <a href="https://x.com/ataullah_mesbah" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                                    <FaTwitter />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/ataullah-mesbah/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                                    <FaLinkedinIn />
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/ataullahmesbah" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                                    <FaGithub />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="mt-8 border-t border-gray-700 pt-6 text-center">
                    <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Ataullah Mesbah. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
