import Image from "next/image";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const SEOTabs = () => {
    // State to store SEO services data
    const [seoServices, setSeoServices] = useState([]);

    // Fetch SEO services data from the JSON file
    useEffect(() => {
        fetch("/seotabs.json")
            .then((response) => response.json())
            .then((data) => setSeoServices(data))
            .catch((error) => console.error("Error fetching SEO services:", error));
    }, []);

    return (
        <main className="p-4 poppins-regular">
            {/* SEO Section Title and Description */}
            <div className="text-left mb-8">
                <h3 className="text-3xl font-bold mb-2">Search Engine Optimization (SEO)</h3>
                <p className="text-gray-600">Rank high in search engines and get more visitors with SEO.</p>
            </div>

            {/* SEO Services and Right Section Wrapper */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Left Section: SEO Services */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8">
                    {seoServices.map((service) => (
                        <div
                            key={service.id}
                            className="flex flex-col space-y-4 bg-gray-200 hover:text-cyan-600 items-center justify-center shadow-md shadow-red-500 rounded-lg p-4 text-center hover:shadow-md  hover:border-cyan-800  hover:shadow-cyan-500 transition duration-300 ease-linear transform  hover:scale-105"
                        >
                            <Image
                                className="w-12 h-12"
                                src={service.image}
                                alt={service.title}
                                width={50}
                                height={50}
                            />
                            <h3 className="text-sm text-gray-800 font-semibold">{service.title}</h3>
                        </div>
                    ))}
                </div>

                {/* Right Section: SEO Knowledge and CRM Work */}
                <div className="lg:w-1/2 space-y-6">
                    <div className="bg-white shadow-lg p-6 rounded-lg text-left">
                        <h3 className="text-2xl font-bold text-sky-800">
                            Why Choose Me As Your SEO Consultant?
                        </h3>
                        <p className="text-gray-700 mt-4">
                            As a leading SEO consultant, Ataullah Mesbah provides white hat, data-driven SEO and advanced SEO campaigns designed to deliver measurable results, both in organic rankings and ROI.
                        </p>
                        <ul className="list-none pl-0 mt-4 text-gray-700 space-y-2">
                            {[
                                "Custom-tailored SEO strategies to meet your business needs",
                                "Proven track record of improving organic search rankings",
                                "Focus on ethical, white-hat SEO practices",
                                "Comprehensive SEO audits and competitor analysis",
                                "Continuous monitoring and reporting to track progress"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center group">
                                    <FaCheckCircle className="text-sky-800 mr-2" />
                                    <span className="group-hover:text-sky-800 transition-colors duration-300">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SEOTabs;
