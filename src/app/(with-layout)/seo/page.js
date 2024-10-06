import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import SEOPackage from "@/app/components/Share/SEOPackage/SEOPackage";
import SEOService from "@/app/components/Share/SEOService/SEOService";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
    title: 'Search Engine Optimization Services',
    description: "Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies."
}

const page = () => {

    return (

        <section className="min-h-screen border-b border-b-gray-800"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>
            <div className=" py-12 shadow-md border-b border-b-gray-700 poppins-regular">
                <div className="lg:max-w-3xl lg:w-1/2 mx-auto py-8">
                    {/* Left Text Side */}
                    <div className="  justify-center items-center space-y-6 text-center  px-4">
                        <h1 className="lg:text-4xl text-3xl font-bold text-gray-100 ">Search Engine Optimization (SEO) <br />Services</h1>
                        <p className="text-gray-200 text-lg">
                            Boost your website’s visibility with our expert SEO services. We specialize in optimizing your site for search engines to ensure you rank higher and attract more visitors.
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


            {/* SEO services */}
            <div className="max-w-7xl mx-auto items-center text-center poppins-regular py-8 px-4 lg:px-8 text-white text-xs md:text-base lg:text-base">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-center mx-auto">
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">E-commerce SEO</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">Technical SEO</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">Keyword Research</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">International SEO</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">Local SEO</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">On-Page SEO</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">Off-Page SEO</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">Link Building</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">SEO Consulting</div>
                    <div className="bg-gray-800 hover:bg-gray-900  p-3 rounded-md border-b-blue-400 border-b-4 shadow-blue-400 shadow-md transition-transform transform hover:scale-105 duration-1000">SEO Audit</div>
                </div>
            </div>


            <div>
                {/* TO DO LIST */}
                <SEOService />
            </div>
            <div>
                {/* TO DO LIST */}
                <SEOPackage />
            </div>
            <div >
                {/* TO DO LIST */}
                <ContactAssistance />
            </div>
        </section>
    );
};

export default page;
