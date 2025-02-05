

import ContactAssistance from '@/app/components/Share/ConatctAssistance/ContactAssistance';
import DevelopmentForm from '@/app/components/Share/DevelopmentForm/DevelopmentForm';
import WebPackage from '@/app/components/Share/WebPackage/WebPackage';
import WebService from '@/app/components/Share/WebService/WebService';

import Link from 'next/link';

export const metadata = {
    title: 'Web Development Services | Custom Website Solutions',
    description: 'Explore our professional web development services, offering custom website solutions including e-commerce, portfolio sites, and real-time applications. Our expert developers use the latest technologies like Node.js, MongoDB, Next.js, and MERN stack to build responsive, SEO-friendly, and high-performance websites tailored to your business needs.',
};


const page = () => {
    return (
        <section className="min-h-screen border-b border-b-gray-800"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>
            <div className=" ">
                <div className=" poppins-regular py-16 border-b border-b-gray-700">
                    {/* Main Container */}
                    <div className="space-y-6 max-w-4xl mx-auto text-center justify-center mb-10 px-3">
                        <h1 className="lg:text-5xl text-3xl font-bold text-gray-100">Web Development Services</h1>
                        <p className="text-gray-200 text-lg">
                            Your website’s infrastructure is crucial for its optimal performance. We offer comprehensive support, whether enhancing your in-house development team’s efforts or building a new web property from the ground up. Our focus includes increasing page speed, ensuring seamless user experiences, and providing ongoing maintenance to keep your site current and optimized.
                        </p>

                        {/* Contact Link */}
                        <div className="py-5 ">
                            <div className="grid gap-8 justify-center items-center ">
                                <div className="relative group">

                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                                    <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                                        <a href='/contact' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">Contact Ataullah Mesbah Today &rarr;</a>
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 poppins-regular py-16">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pb-10">
                        {/* Service List */}
                        <div className="space-y-8">
                            {[
                                { title: 'Customized Development', description: 'Tailored solutions that meet your business needs.' },
                                { title: 'Performance Optimization', description: 'Ensuring your site loads fast and runs smoothly.' },
                                { title: 'Maintenance & Support', description: 'Continuous support to keep your site up-to-date.' },
                            ].map((service, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <div className="bg-blue-950 p-3 rounded-full drop-shadow-lg transition ease-in-out delay-150  hover:-translate-y-1 hover:scale-110 hover:bg-indigo-800 duration-1000">
                                        {/* Add an Icon Here */}
                                        <svg className="w-6 h-6 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a10 10 0 11-10 10A10 10 0 0112 2m0-2a12 12 0 1012 12A12 12 0 0012 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-100">{service.title}</h3>
                                        <p className="text-gray-300">{service.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Development Form */}
                        <DevelopmentForm />
                    </div>

                    <div>
                        {/* TO DO List */}
                    </div>

                    <div>
                        {/* TO DO List */}
                        <WebService />
                    </div>


                    {/* in generally OFF */}
                    <div>
                        
                        {/* TO DO List */}
                        <WebPackage />
                    </div>
                    
                </div>

                <div>
                        {/* TO DO List */}
                        <ContactAssistance />
                    </div>
                    
            </div>
        </section>
    );
};

export default page;
