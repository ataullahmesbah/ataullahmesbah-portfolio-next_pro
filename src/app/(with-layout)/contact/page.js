
import ContactForm from '@/app/components/ContactForm/ContactForm';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaMedium, FaEnvelope, FaPhone } from 'react-icons/fa';

export const metadata = {
    title: 'Contact | Ataullah Mesbah',
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies."
}


// 
const page = () => {
    return (
        <div className="">
            {/* Banner Section */}
            <div className='bg-gradient-to-r from-sky-800 via-sky-950 to-sky-700 py-16 shadow-md shad'>
                <div className="max-w-7xl mx-auto rounded-lg p-6 lg:p-12 space-y-6 poppins-regular">
                    {/* Breadcrumb Links */}
                    <div className=" mb-4 flex justify-center space-x-4 text-white">
                        {/* Add Next.js Links for Home and Contact */}
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                        <span>||</span>
                        <Link href="/contact" className="hover:underline">
                            Contact
                        </Link>
                    </div>

                    {/* Title and Description */}
                    <div className="text-center mb-6 lg:mb-0 text-white space-y-6">
                        <h2 className="text-3xl lg:text-5xl font-bold ">
                            Let’s Start a Conversation
                        </h2>
                        <p className="mt-4 text-lg lg:text-xl text-gray-100">
                            Have any questions or want to connect? Feel free to reach out. I’m here to help!
                        </p>
                    </div>
                </div>
            </div>


            <section className="max-w-7xl mx-auto p-6 lg:p-12">
                <ContactForm />


                <div className="max-w-3xl mx-auto py-12 px-6">
                    {/* Contact Us Title */}
                   

                    {/* Contact Cards Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Care */}
                        <div className="border-2 border-indigo-800 rounded-lg p-6 text-center justify-center hover:shadow-lg transition-all duration-300 border-t-8 shadow-md shadow-violet-900">
                            <h2 className="text-xl font-semibold mb-2">Customer Care</h2>
                            <p className="text-gray-700 mb-4">
                                Our support team is spread all over the world to give you fast responses.
                            </p>
                            <div className="mt-0">
                                <button className="bg-indigo-500 text-white py-2 px-6 rounded-full mb-2 hover:bg-indigo-600">
                                    Submit a Request
                                </button>
                                <br />
                                <Link href="/faq" className="text-indigo-600 hover:underline">
                                    Frequently Asked Questions
                                </Link>
                            </div>
                        </div>

                        {/* Sales & Marketing */}
                        <div className="border-2 border-green-400 rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 border-t-8 shadow-md shadow-green-500">
                            <h2 className="text-xl font-semibold mb-2">Sales & Marketing</h2>
                            <p className="text-gray-700 mb-4">
                                Get in touch with our Sales & Marketing team to see how we can work together.
                            </p>
                            <div className="mb-4">
                                <button className="bg-green-500 text-white py-2 px-6 rounded-full mb-2 hover:bg-green-600">
                                    Contact Sales
                                </button>
                                <br />
                                <Link href="/plans" className="text-green-600 hover:underline">
                                    View Plans
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>





                {/* Contact Information Section */}
                <div className="mt-12 space-y-8">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800">Contact Information</h3>
                        <p className="mt-2 text-gray-700">Feel free to reach out through any of the following channels:</p>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8">
                        {/* Email */}
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md w-full lg:w-1/3">
                            <FaEnvelope className="text-4xl text-blue-500" />
                            <h4 className="text-xl font-semibold mt-4">Email</h4>
                            <p className="mt-2 text-gray-700">info@ataullahmesbah.com</p>
                        </div>
                        {/* Phone */}
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md w-full lg:w-1/3">
                            <FaPhone className="text-4xl text-blue-500" />
                            <h4 className="text-xl font-semibold mt-4">Phone</h4>
                            <p className="mt-2 text-gray-700">+1 (555) 123-4567</p>
                        </div>
                        {/* Social Media */}
                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-md w-full lg:w-1/3">
                            <h4 className="text-xl font-semibold">Follow Me</h4>
                            <div className="flex space-x-6 mt-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className="text-3xl text-blue-700 hover:text-blue-500" />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <FaTwitter className="text-3xl text-blue-400 hover:text-blue-300" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="text-3xl text-blue-800 hover:text-blue-600" />
                                </a>
                                <a href="https://medium.com" target="_blank" rel="noopener noreferrer">
                                    <FaMedium className="text-3xl text-gray-800 hover:text-gray-600" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Frequently Asked Questions Section */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-800 text-center">Frequently Asked Questions</h3>
                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold text-gray-800">Q1: How can I contact you?</h4>
                            <p className="mt-2 text-gray-700">You can contact me through email or phone, or by connecting on social media.</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold text-gray-800">Q2: What services do you offer?</h4>
                            <p className="mt-2 text-gray-700">I offer SEO, web development, and travel consulting services. Feel free to reach out for more details.</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                            <h4 className="text-lg font-semibold text-gray-800">Q3: Where are you based?</h4>
                            <p className="mt-2 text-gray-700">I am currently based in Canada, working with clients worldwide.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default page;
