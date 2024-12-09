import Image from 'next/image';
import tr3 from '/public/images/travel/campgreen.jpg';
import tr1 from '/public/images/travel/tr1.webp';

const TravelPortfolio = () => {
    return (
        <section className=" py-16 px-6 ">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Content */}
                <div className="flex flex-col justify-center">
                    <h4 className="text-green-700 font-semibold tracking-wide uppercase">Go to Travel</h4>
                    <h1 className="text-4xl font-bold text-gray-300 mt-2">
                        Explore & Discover the Touch of <span className="text-green-600">Nature</span>
                    </h1>
                    <p className="text-gray-200 mt-4 leading-relaxed">
                        Gravida rutrum quisque non tellus orci. Maecenas ultricies mi eget mauris. Nulla
                        facilisi cras odio. Lacus sed turpis tincidunt id aliquet.
                    </p>
                    <p className="text-gray-200 mt-2 leading-relaxed">
                        Est ante in nibh mauris. Sagittis purus sit amet volutpat consequat mauris nunc
                        congue nisi.
                    </p>
                    <div>


                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-md mt-6 inline-flex items-center">
                            Read More <span className="ml-2">🌿</span>
                        </button>
                    </div>
                </div>
                {/* Right Images */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Left Side: Two Images */}
                    <div className="flex flex-col justify-end gap-3 ">
                        <Image
                            src={tr1} // Replace with your image path
                            alt="Travel Image 1"
                            className="rounded-lg rounded-ss-3xl"
                            width={300}
                            height={200}
                        />
                        <Image
                            src={tr1} // Replace with your image path
                            alt="Travel Image 2"
                            className="rounded-lg rounded-ee-3xl"
                            width={300}
                            height={200}
                        />
                    </div>

                    {/* Right Side: Single Image */}
                    <div className="flex ">
                        <Image
                            src={tr3} // Replace with your image path
                            alt="Travel Image 3"
                            className="rounded-lg rounded-ee-3xl"
                            width={400}
                            height={600}
                        />
                    </div>
                </div>


            </div>
        </section>
    );
};

export default TravelPortfolio;
