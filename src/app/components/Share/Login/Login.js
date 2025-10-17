'use client';

import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaBackward, FaForward, FaLock, FaShieldAlt } from "react-icons/fa";
import LoginForm from "../LoginForm/LoginForm";
import { ToastContainer } from 'react-toastify';

const Login = () => {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />

            {/* Background that won't interfere with layout */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>

                {/* Animated Gradient Orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
            </div>

            {/* Main content area that works with your layout */}
            <div className="relative min-h-screen flex flex-col">
                {/* Simple Header - Not fixed/absolute */}
                <div className="bg-transparent border-b border-gray-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <Link href='/' className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group">
                                <FaBackward className="text-sm group-hover:-translate-x-1 transition-transform" />
                                <span className="text-sm font-semibold">Home</span>
                            </Link>
                            <Link href='/register' className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 group">
                                <span className="text-sm font-semibold">Create an Account</span>
                                <FaForward className="text-sm group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl w-full">
                        {/* Simplified Welcome Section */}
                        <div className="flex justify-center mb-8">
                            <div className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl">
                                        <FaLock className="text-2xl text-white" />
                                    </div>
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    Welcome Back
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    Sign in to your account
                                </p>
                            </div>
                        </div>

                        {/* Login Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            {/* Login Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl">
                                    <LoginForm />
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="space-y-6">
                                {/* Quick Access Header */}
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 text-gray-400 mb-4">
                                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-600"></div>
                                        <span className="text-xs font-semibold uppercase tracking-wider">Quick Access</span>
                                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-600"></div>
                                    </div>
                                </div>

                                {/* Social Buttons */}
                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group">
                                        <Image
                                            width={20}
                                            height={20}
                                            src="https://i.ibb.co/SKdhz0J/image.png"
                                            alt="Google"
                                            className="w-5 h-5"
                                        />
                                        <span className="text-gray-800 font-semibold text-sm">Continue with Google</span>
                                    </button>

                                    <button className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] border border-[#1877F2] rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group">
                                        <Image
                                            width={20}
                                            height={20}
                                            src="https://i.ibb.co/9qXCrfs/image.png"
                                            alt="Facebook"
                                            className="w-5 h-5"
                                        />
                                        <span className="text-white font-semibold text-sm">Continue with Facebook</span>
                                    </button>

                                    <button className="w-full flex items-center justify-center gap-3 bg-gray-900 hover:bg-black border border-gray-700 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group">
                                        <Image
                                            width={20}
                                            height={20}
                                            src="https://i.ibb.co/JnD2t8y/image.png"
                                            alt="GitHub"
                                            className="w-5 h-5"
                                        />
                                        <span className="text-white font-semibold text-sm">Continue with GitHub</span>
                                    </button>
                                </div>

                                {/* Security Badge */}
                                <div className="flex items-center justify-center gap-2 p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                    <FaShieldAlt className="text-green-400 text-sm" />
                                    <p className="text-gray-400 text-xs font-medium">
                                        Secure & Encrypted Login
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Links */}
                        <div className="mt-12 text-center space-y-6">
                            {/* Forgot Password */}
                            <div>
                                <Link href='/forgot-password'>
                                    <span className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium text-sm border-b border-transparent hover:border-purple-300 pb-1">
                                        Forgot your password?
                                    </span>
                                </Link>
                            </div>

                            {/* Legal Links */}
                            <div className="space-y-3">
                                <div className="flex justify-center gap-6 flex-wrap">
                                    <Link href='/terms-of-service'>
                                        <span className="text-gray-500 hover:text-gray-300 transition-colors duration-200 text-xs font-medium">
                                            Terms of Service
                                        </span>
                                    </Link>
                                    <Link href='/privacy-policy'>
                                        <span className="text-gray-500 hover:text-gray-300 transition-colors duration-200 text-xs font-medium">
                                            Privacy Policy
                                        </span>
                                    </Link>
                                    <Link href='/security'>
                                        <span className="text-gray-500 hover:text-gray-300 transition-colors duration-200 text-xs font-medium">
                                            Security
                                        </span>
                                    </Link>
                                </div>

                                {/* reCAPTCHA Notice */}
                                <div className="flex items-center justify-center gap-2">
                                    <FaShieldAlt className="text-gray-600 text-xs" />
                                    <p className="text-gray-600 text-xs font-medium">
                                        Protected by reCAPTCHA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;