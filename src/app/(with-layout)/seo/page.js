import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: 'Search Engine Optimization Services',
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies."
}

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
                <div className="max-w-7xl w-1/2 mx-auto py-8">
                    {/* Left Text Side */}
                    <div className="  justify-center items-center space-y-6 text-center  px-4">
                        <h1 className="text-4xl font-bold text-gray-800 ">Search Engine Optimization (SEO) <br />Services</h1>
                        <p className="text-gray-700 text-lg">
                            Boost your website’s visibility with our expert SEO services. We specialize in optimizing <br /> your site for search engines to ensure you rank higher <br /> and attract more visitors.
                        </p>
                        <Link href='/contact'>
                            <button className="mt-4 px-6 py-2 bg-sky-700 text-white rounded hover:bg-opacity-75 hover:bg-sky-800">
                                Contact Ataullah Mesbah Today
                            </button>
                        </Link>
                    </div>


                </div>
            </div>

            {/* SEO Audit */}

            <div className="max-w-7xl mx-auto flex flex-col  lg:flex-row items-center py-8 px-4 lg:px-8">

                {/* Left Text Side */}
                <div className="w-full justify-center space-y-6 text-center ">
                    <SEOAuditForm />
                </div>

                {/* Right Image Side */}
                <div className="w-full  flex justify-center mt-8 lg:mt-0">
                    <Image
                        src="https://i.ibb.co/d5FW2dK/image.png"  // Image link provided by you
                        alt="SEO Banner"
                        width={500}  // Set appropriate width
                        height={500} // Set appropriate height

                        className="rounded-lg max-w-full h-auto"
                    />
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
