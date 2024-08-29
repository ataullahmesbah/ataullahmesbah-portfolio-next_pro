import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 poppins-regular">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

                    <div className="mb-6 md:mb-0 md:w-1/3">
                        <h3 className="text-lg font-semibold">Ataullah Mesbah</h3>
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
