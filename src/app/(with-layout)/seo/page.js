import Image from "next/image";

const page = () => {
    const services = [
        {
            title: "Keyword Research",
            description: "Identify the best keywords to target for maximum visibility.",
        },
        {
            title: "On-Page Optimization",
            description: "Optimize content, images, and meta tags for search engines.",
        },
        {
            title: "Technical SEO",
            description: "Improve your site’s architecture and code for better search engine crawling.",
        },
        {
            title: "Link Building",
            description: "Develop a strong backlink profile with quality links.",
        },
        // Add more services as needed
    ];

    return (

        <section >
            <div className="bg-blue-50 py-12">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center">
                    {/* Left Text Side */}
                    <div className="lg:w-1/2 space-y-6 text-center lg:text-left px-4">
                        <h1 className="text-4xl font-bold text-gray-800 uppercase">SEO Services</h1>
                        <p className="text-gray-700 text-lg">
                            Boost your website’s visibility with our expert SEO services. We specialize in optimizing your site for search engines to ensure you rank higher and attract more visitors.
                        </p>
                        <button className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Get Started
                        </button>
                    </div>

                    {/* Right Image Side */}
                    <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
                        <Image
                            src="https://i.ibb.co/DrvfD8r/image.png"  // Image link provided by you
                            alt="SEO Banner"
                            width={500}  // Set appropriate width
                            height={500} // Set appropriate height
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>



            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800  mb-8 text-center">
                        Our SEO Services
                    </h2>

                    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {services.map((service, index) => (
                            <div key={index} className="border p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h3>
                                <p className="text-gray-700">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default page;
