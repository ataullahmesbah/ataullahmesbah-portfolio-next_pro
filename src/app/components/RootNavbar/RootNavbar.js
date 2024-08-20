import Link from "next/link";
import { FaAddressCard, FaFacebookSquare, FaMediumM, FaTwitter, FaYoutube } from "react-icons/fa";

const RootNavbar = () => {
    return (
        <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-8 lg:px-12">

            {/* Email */}
            <div className="text-center sm:text-left mb-2 sm:mb-0">
                <h3 className="text-sm sm:text-base">
                    info@ataullahmesbah.com
                </h3>
            </div>

            {/* Address */}
            <div className="text-center sm:text-left flex items-center gap-2 mb-2 sm:mb-0">
                <FaAddressCard className="text-lg" />
                <h3 className="text-sm sm:text-base">
                    3 Muirfield Cresent, E14 9SZ, Bangladesh
                </h3>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center sm:justify-end items-center space-x-4 text-lg">
                <Link href='https://facebook.com' aria-label="Facebook">
                    <FaFacebookSquare />
                </Link>
                <Link href='https://medium.com' aria-label="Medium">
                    <FaMediumM />
                </Link>
                <Link href='https://twitter.com' aria-label="Twitter">
                    <FaTwitter />
                </Link>
                <Link href='https://youtube.com' aria-label="YouTube">
                    <FaYoutube />
                </Link>
            </div>

        </nav>
    );
};

export default RootNavbar;