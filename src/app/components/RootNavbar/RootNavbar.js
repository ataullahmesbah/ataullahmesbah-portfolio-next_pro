import Link from "next/link";
import { FaAddressCard, FaFacebookSquare, FaMediumM, FaTwitter, FaYoutube } from "react-icons/fa";


const RootNavbar = () => {
    return (
        <nav className="flex max-w-7xl mx-auto justify-between items-end py-2">

            <div>
                <h3 className="">
                    info@ataullahmesbah.com
                </h3>
            </div>
            <div>
                <h3 className="flex gap-4 items-center">
                    <FaAddressCard />
                    3 Muirfield Cresent, E14 9SZ, Bangladesh

                </h3>
            </div>

            <div className="space-x-6 font-semibold flex justify-between items-centerF">

                <Link href='/'>
                    <FaFacebookSquare />

                </Link>
                <Link href='/'>
                    <FaMediumM />

                </Link>
                <Link href='/'>
                    <FaTwitter />

                </Link>

                <Link href='/'>
                    <FaYoutube />

                </Link>




            </div>

        </nav>
    );
};

export default RootNavbar;