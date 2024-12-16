
import Image from "next/image";
import Link from "next/link";


import travelImg1 from "/public/images/travel/campgreen.jpg";
import travelImg2 from "/public/images/travel/campgreen.jpg";
import travelImg3 from "/public/images/travel/campgreen.jpg";
import travelSiteImg from "/public/images/travel/campgreen.jpg";





const page = () => {
    return (



        <div
            className="min-h-screen border-b border-gray-700"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}
        >
            {/* Header Section */}
            <section className=" py-12 px-6 text-center border-b border-gray-800 max-w-7xl mx-auto">
                <div className="container mx-auto ">
                    <h1 className="text-4xl font-bold  text-gray-200 uppercase">
                        My Travel <span className="text-green-600">Journey</span>
                    </h1>
                    <p className="text-gray-300 mt-4">
                        Explore my adventures around the globe and discover some of the most
                        breathtaking historical travel sites.
                    </p>
                </div>
            </section>

            {/* Travel Journey Section */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center justify-between">
                    {/* Left Content */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-200 mb-4">
                            My Travel Journey
                        </h2>
                        <p className="text-gray-300 leading-relaxed">
                            Over the years, I have traveled to numerous countries, exploring
                            different cultures, meeting new people, and learning about the rich
                            history behind iconic landmarks. From climbing mountains to visiting
                            ancient ruins, each trip has been a unique story in itself.
                        </p>
                        <p className="text-gray-300 mt-4 leading-relaxed">
                            My travels have taken me to places like the Great Wall of China,
                            the Taj Mahal, Machu Picchu, and the Eiffel Tower. These experiences
                            have inspired me to share my journey with the world.
                        </p>
                        <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold">
                            <Link href="/historical-sites">View Historical Sites</Link>
                        </button>
                    </div>

                    {/* Right Image */}
                    <div className="justify-end">
                        <Image
                            src={travelSiteImg}
                            alt="Travel Journey"
                            width={300}
                            height={100}
                            className="rounded-lg shadow-lg "
                        />
                    </div>
                </div>
            </section>

            {/* Historical Travel Sites Section */}
            <section className="py-16 px-6 ">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-gray-300 text-center mb-8">
                        Historical Travel Sites
                    </h2>

                    {/* Travel Site Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <Image
                                src={travelImg1}
                                alt="Historical Site 1"
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    The Great Wall of China
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    A magnificent structure that spans thousands of miles across China.
                                </p>
                                <Link
                                    href="/great-wall-of-china"
                                    className="text-green-600 mt-4 inline-block hover:underline"
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <Image
                                src={travelImg2}
                                alt="Historical Site 2"
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Taj Mahal, India
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    A stunning symbol of love and a UNESCO World Heritage Site.
                                </p>
                                <Link
                                    href="/taj-mahal"
                                    className="text-green-600 mt-4 inline-block hover:underline"
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <Image
                                src={travelImg3}
                                alt="Historical Site 3"
                                width={600}
                                height={400}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Machu Picchu, Peru
                                </h3>
                                <p className="text-gray-600 mt-2">
                                    An ancient Incan city set high in the Andes Mountains.
                                </p>
                                <Link
                                    href="/machu-picchu"
                                    className="text-green-600 mt-4 inline-block hover:underline"
                                >
                                    Learn More →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Gallery */}
            <section className="py-16 px-6">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-gray-300 text-center mb-8">
                        Travel Photo Gallery
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Image
                            src={travelImg1}
                            alt="Travel Photo 1"
                            className="rounded-lg w-full h-40 object-cover"
                        />
                        <Image
                            src={travelImg2}
                            alt="Travel Photo 2"
                            className="rounded-lg w-full h-40 object-cover"
                        />
                        <Image
                            src={travelImg3}
                            alt="Travel Photo 3"
                            className="rounded-lg w-full h-40 object-cover"
                        />
                        <Image
                            src={travelSiteImg}
                            alt="Travel Photo 4"
                            className="rounded-lg w-full h-40 object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>

    );
};

export default page;
