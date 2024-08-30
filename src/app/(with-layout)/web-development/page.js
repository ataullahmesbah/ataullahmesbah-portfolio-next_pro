

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
        <section>
            <div className="bg-blue-50 ">
                <div className="bg-sky-100 poppins-regular py-16 shadow-md shadow-gray-300">
                    {/* Main Container */}
                    <div className="space-y-6  max-w-4xl mx-auto text-center justify-center mb-10">
                        <h1 className="lg:text-5xl text-3xl font-bold text-gray-800">Web Development Services</h1>
                        <p className="text-gray-700 text-lg">
                            Your website’s infrastructure is crucial for its optimal performance. We offer comprehensive support, whether enhancing your in-house development team’s efforts or building a new web property from the ground up. Our focus includes increasing page speed, ensuring seamless user experiences, and providing ongoing maintenance to keep your site current and optimized.
                        </p>
                        <Link href="/contact">
                            <button className="mt-4 px-8 py-3 bg-sky-700 text-white rounded-full hover:bg-opacity-75 hover:bg-sky-800 transition duration-300 ease-in-out">
                                Contact Ataullah Mesbah Today
                            </button>
                        </Link>
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
                                    <div className="bg-sky-100 p-4 rounded-full">
                                        {/* Add an Icon Here */}
                                        <svg className="w-6 h-6 text-sky-700" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2a10 10 0 11-10 10A10 10 0 0112 2m0-2a12 12 0 1012 12A12 12 0 0012 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{service.title}</h3>
                                        <p className="text-gray-600">{service.description}</p>
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
                    <div>
                        {/* TO DO List */}
                        <WebPackage />
                    </div>
                    <div>
                        {/* TO DO List */}
                        <ContactAssistance />
                    </div>





                </div>
            </div>
        </section>
    );
};

export default page;
