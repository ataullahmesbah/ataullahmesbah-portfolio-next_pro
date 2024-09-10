
import ContactForm from '@/app/components/ContactForm/ContactForm';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaMedium, FaEnvelope, FaPhone, FaStopCircle } from 'react-icons/fa';


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



            <div className=''>
                <ContactForm />


            </div>


            <section className="max-w-6xl mx-auto p-6 lg:p-12">


                {/* Contact Information Section */}
                <div className="mt-12 space-y-8">
                    <div className="text-center">
                      
                        <p className="mt-2 text-gray-700">Connect with me via email, phone, or follow me on social media.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
                        {/* Email */}
                        <div className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-md border-t-8  w-full lg:w-1/3 border-2 border-t-indigo-800">
                            <FaEnvelope className="text-4xl text-blue-700" />
                            <h4 className="text-xl font-semibold mt-4">Email</h4>
                            <p className="mt-2 text-gray-700">info@ataullahmesbah.com</p>
                        </div>
                        {/* Phone */}
                        <div className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-md border-t-8  w-full lg:w-1/3 border-2 border-t-indigo-800">
                            <FaPhone className="text-4xl text-blue-700" />
                            <h4 className="text-xl font-semibold mt-4">Phone</h4>
                            <p className="mt-2 text-gray-700">+1 (555) 123-4567</p>
                        </div>
                        {/* Social Media */}
                        <div className="flex flex-col items-center text-center p-4 bg-gray-100 rounded-lg shadow-md border-t-8  w-full lg:w-1/3 border-2 border-t-indigo-800">
                        <FaStopCircle className="text-4xl text-blue-700" />
                            <h4 className="text-xl font-semibold">Follow Me</h4>
                            <div className="flex space-x-6 mt-4">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className="text-3xl text-gray-600 hover:text-blue-600" />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <FaTwitter className="text-3xl text-gray-600 hover:text-blue-400" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="text-3xl text-gray-600 hover:text-blue-600" />
                                </a>
                                <a href="https://medium.com" target="_blank" rel="noopener noreferrer">
                                    <FaMedium className="text-3xl text-gray-600 hover:text-gray-500" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


                
            </section>
        </div>
    );
};

export default page;
