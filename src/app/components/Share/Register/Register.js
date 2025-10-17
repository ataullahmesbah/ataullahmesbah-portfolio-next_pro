import Image from "next/image";
import Link from "next/link";
import { FaBackward, FaForward, FaUserPlus, FaShieldAlt } from "react-icons/fa";
import Registerform from "../Registerform/Registerform";

export const metadata = {
    title: 'Sign Up | ataullah mesbah',
    description: 'Create your account and join our community',
};

const Register = () => {
    return (
        <>
            {/* ✅ FIXED BACKGROUND - FULL HEIGHT */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* ✅ MAIN CONTENT - FULL HEIGHT */}
            <div className="min-h-screen relative z-10">
                
                {/* Header Navigation - FIXED POSITION */}
                <div className=" left-0 right-0 z-50 bg-gray-900/30 backdrop-blur-md border-b border-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link href='/' className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 group">
                                <div className="p-2 bg-gray-800 rounded-lg  transition-colors duration-300">
                                    <FaBackward className="text-sm" />
                                </div>
                                <span className="text-sm font-medium">Back to Home</span>
                            </Link>
                            <Link href='/login' className="flex items-center gap-3 text-gray-300 hover:text-white transition-all duration-300 group">
                                <span className="text-sm font-medium">Already have an Account</span>
                                <div className="p-2 bg-gray-800 rounded-lg  transition-colors duration-300">
                                    <FaForward className="text-sm" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ✅ CONTENT WRAPPER - CENTERED WITH PROPER SPACING */}
                <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
                    <div className="w-full max-w-6xl">
                        {/* Welcome Card */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl w-full max-w-md">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4 flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-lg">
                                        <FaUserPlus className="text-2xl text-white" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
                                    <div className="flex items-center justify-center gap-2 text-purple-400 mb-4">
                                        <FaShieldAlt className="text-sm" />
                                        <p className="text-sm font-semibold">Secure Registration</p>
                                    </div>
                                    <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-transparent rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Register Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Register Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                                    <Registerform />
                                </div>
                            </div>

                            {/* Social Register Sidebar */}
                            <div className="flex flex-col">
                                <div className="hidden lg:flex items-center justify-center my-8 w-full">
                                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                                    <span className="mx-4 text-gray-400 font-medium text-xs uppercase tracking-wider">Quick Sign Up</span>
                                    <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                                </div>

                                <div className="w-full space-y-4">
                                    <button className="w-full flex items-center justify-center gap-3 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-lg border border-gray-600/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/30 group">
                                        <div className="p-2 bg-white rounded-lg">
                                            <Image width={20} height={20} src="https://i.ibb.co/SKdhz0J/image.png" alt="Google" className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-medium">Continue with Google</span>
                                    </button>

                                    <button className="w-full flex items-center justify-center gap-3 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-lg border border-gray-600/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/30 group">
                                        <div className="p-2 bg-blue-600 rounded-lg">
                                            <Image width={20} height={20} src="https://i.ibb.co/9qXCrfs/image.png" alt="Facebook" className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-medium">Continue with Facebook</span>
                                    </button>

                                    <button className="w-full flex items-center justify-center gap-3 bg-gray-700/50 hover:bg-gray-600/50 backdrop-blur-lg border border-gray-600/50 rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:border-gray-500/30 group">
                                        <div className="p-2 bg-gray-800 rounded-lg">
                                            <Image width={20} height={20} src="https://i.ibb.co/JnD2t8y/image.png" alt="Github" className="w-5 h-5" />
                                        </div>
                                        <span className="text-white font-medium">Continue with Github</span>
                                    </button>
                                </div>

                                <div className="mt-6 p-4 bg-gray-800/40 rounded-xl border border-gray-700/30 text-center">
                                    <p className="text-gray-400 text-sm">🔒 Secure & Encrypted Registration</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-12 text-center space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-center gap-6">
                                    <Link href='/terms-of-service' className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm">Terms</Link>
                                    <Link href='/privacy-policy' className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm">Privacy</Link>
                                    <Link href='/security' className="text-gray-500 hover:text-gray-300 transition-colors duration-300 text-sm">Security</Link>
                                </div>
                                <p className="text-gray-600 text-sm">Protected by reCAPTCHA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;