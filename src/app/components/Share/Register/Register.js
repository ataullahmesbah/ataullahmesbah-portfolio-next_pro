import Image from "next/image";
import Link from "next/link";
import { FaBackward, FaForward } from "react-icons/fa";
import Registerform from "../Registerform/Registerform";

export const metadata = {
    title: 'Sign Up | ataullah mesbah',
    description: '',
};

const Register = () => {
    return (
        <div className="container mx-auto py-20">

            <div className=" font-semibold flex justify-between items-center p-4">
                <Link href='/' className="flex items-center gap-4" ><FaBackward /> <h3>Back to Home</h3></Link>
                <Link href='/login' className="flex items-center gap-4"><h3>Already have an Account</h3> <FaForward /></Link>

            </div>
            {/* img optimize */}
            <section className="flex justify-center mx-auto items-center bg-gray-800 p-4">
                <div className="justify-center text-center items-center">
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
                </div>
            </section>
            {/* img optimize */}



            <h2 className="text-xl font-semibold text-center">Sign Up into Ataullah Mesbah</h2>


            {/* Log section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-between items-center mx-auto mt-8 p-4 lg:w-3/4">

                <Registerform />

                {/* Or */}

                <div className="hidden lg:flex items-center justify-center flex-col mx-auto space-y-5">
                    <div className="border-l items-center justify-center border-gray-600 h-10"></div>
                    <div className="text-gray-500">OR</div>
                    <div className="border-l items-center justify-center border-gray-600 h-10"></div>
                </div>

                {/* Social Login Section */}
                <div className="space-y-3">
                    <div className="flex items-center border-gray-700 border rounded-md justify-between px-8 mx-auto md:px-15 lg:px-16 p-2">
                        <Image width={32} height={8} src="https://i.ibb.co/SKdhz0J/image.png" alt="Login Google" />
                        <p className="text-xs font-semibold">Sign In With Google</p>
                    </div>
                    <div className="flex items-center border-gray-700 border rounded-md justify-between px-8 mx-auto md:px-15 lg:px-16 p-2">
                        <Image width={32} height={8} src="https://i.ibb.co/9qXCrfs/image.png" alt="Login Google" />
                        <p className="text-xs font-semibold">Sign In With Facebook</p>
                    </div>
                    <div className="flex items-center border-gray-700 border rounded-md justify-between px-8 mx-auto md:px-15 lg:px-16 p-2">
                        <Image width={32} height={8} src="https://i.ibb.co/JnD2t8y/image.png" alt="Login Google" />
                        <p className="text-xs font-semibold">Sign In With Github</p>
                    </div>
                </div>

            </div>

            {/* Forgotten Password */}
            <Link href='/'> <p className="text-center mt-16  uppercase font-medium">Forgotten password?</p></Link>

            <div className="text-center mt-10 mb-10">
                <p>Secure Login with reCAPTCHA subject to Google</p>
                <Link href='/terms-conditions'>
                    <p>Terms & Privacy</p>
                </Link>

            </div>




        </div>
    );
};

export default Register;