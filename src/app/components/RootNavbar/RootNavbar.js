import Link from "next/link";
import { FaAddressCard, FaFacebookF, FaLinkedinIn, FaMediumM, FaTwitter, FaYoutube } from "react-icons/fa";

const RootNavbar = () => {
    return (
        <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center py-3 px-1 sm:px-6 md:px-8 lg:px-12 space-y-2 md:space-x-3 sm:space-y-0">
            {/* Email */}
            <div className="text-center sm:text-left">
                <h3 className="text-sm sm:text-base">
                    info@ataullahmesbah.com
                </h3>
            </div>

            {/* Address */}
            <div className="flex justify-center sm:justify-start items-center gap-2">
                <FaAddressCard className="text-lg" />
                <h3 className="  text-xs">
                    3 Muirfield Cresent, E14 9SZ, Bangladesh
                </h3>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-end items-center space-x-4 text-lg">
                <Link href='https://www.facebook.com/ataullah.mesbah.7' target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                    <FaFacebookF />
                </Link>
                <Link href='https://medium.com/@ataullahmesbah' target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                    <FaMediumM />
                </Link>
                <Link href='https://x.com/ataullah_mesbah' target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                    <FaTwitter />
                </Link>
                <Link href='https://www.youtube.com/@mesbahoffwego' target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                    <FaYoutube />
                </Link>
                <Link href="https://www.linkedin.com/in/ataullah-mesbah/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                    <FaLinkedinIn />
                </Link>
            </div>
        </nav>
    );
};

export default RootNavbar;
