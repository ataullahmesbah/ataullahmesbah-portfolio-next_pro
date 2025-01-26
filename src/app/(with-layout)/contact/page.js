
import ContactForm from '@/app/components/ContactForm/ContactForm';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaMedium, FaEnvelope, FaPhone, FaStopCircle, FaStumbleuponCircle, FaPray, FaMagic, FaFontAwesomeLogoFull, FaEdge } from 'react-icons/fa';


export const metadata = {
    title: 'Contact | Ataullah Mesbah',
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies."
}


// 
const page = () => {
    return (
        <div className="min-h-screen border-b border-b-gray-700"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>

            {/* Banner Section */}
            <div className='py-16 border-b border-b-gray-700'>
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

                        <p className="mt-2 text-gray-200">Connect with me via email, phone, or follow me on social media.</p>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12 ">




                        {/* Email */}
                        <div className="flex flex-col items-center text-center p-4 bg-gray-800 border-e-purple-600 border-e-4 shadow-md shadow-blue-500 hover:shadow-2xl hover:shadow-blue-500 rounded-lg   transition-transform transform hover:scale-105 duration-1000 w-full lg:w-1/3 text-white">
                            <FaEnvelope className="text-4xl text-gray-300" />
                            <h4 className="text-xl font-semibold mt-4">Email</h4>
                            <p className="mt-2 text-gray-300">info@ataullahmesbah.com</p>
                        </div>
                        {/* Phone */}


                        <div className="flex flex-col items-center text-center p-4 bg-gray-800 border-e-purple-600 border-e-4 shadow-md shadow-blue-500 hover:shadow-2xl hover:shadow-blue-500 rounded-lg   transition-transform transform hover:scale-105 duration-1000 w-full lg:w-1/3 text-white ">
                            <FaPhone className="text-4xl text-gray-100" />
                            <h4 className="text-xl font-semibold mt-4">Phone</h4>
                            <p className="mt-2 text-gray-200">+8809638844036</p>
                        </div>
                        {/* Social Media */}
                        <div className="flex flex-col items-center text-center p-4 bg-gray-800 border-e-purple-600 border-e-4 shadow-md shadow-blue-500 hover:shadow-2xl hover:shadow-blue-500 rounded-lg   transition-transform transform hover:scale-105 duration-1000 w-full lg:w-1/3 text-white ">
                            <FaEdge className="text-4xl text-gray-300" />
                            <h4 className="text-xl font-semibold">Follow Me</h4>
                            <div className="flex space-x-6 mt-4">
                                <a href='https://www.facebook.com/ataullahmesbah10' target="_blank" rel="noopener noreferrer">
                                    <FaFacebook className="text-3xl text-gray-500 hover:text-gray-400" />
                                </a>
                                <a href='https://x.com/ataullah_mesbah' target="_blank" rel="noopener noreferrer">
                                    <FaTwitter className="text-3xl text-gray-500 hover:text-gray-400" />
                                </a>
                                <a href="https://www.linkedin.com/in/ataullah-mesbah/" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="text-3xl text-gray-500 hover:text-gray-400" />
                                </a>
                                <a href='https://medium.com/@ataullahmesbah' target="_blank" rel="noopener noreferrer">
                                    <FaMedium className="text-3xl text-gray-500 hover:text-gray-400" />
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
