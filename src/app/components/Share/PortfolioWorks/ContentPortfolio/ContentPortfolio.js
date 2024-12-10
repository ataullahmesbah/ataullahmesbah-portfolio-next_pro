

const ContentPortfolio = () => {
    return (
        <section className="py-16 px-6 bg-gray- border-t">
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Content - Content Creation Journey */}
                <div className="flex flex-col justify-center">
                    <h4 className="text-blue-400 font-semibold tracking-wide uppercase">Content Creation</h4>
                    <h1 className="text-4xl font-bold text-gray-200 mt-2">
                        My Content Creation <span className="text-blue-500">Journey</span>
                    </h1>
                    <p className="text-gray-100 mt-4 leading-relaxed">
                        Over the years, I've embarked on a journey to create meaningful content that inspires, educates, and entertains.
                        From writing blogs to creating videos on various topics, content creation has been my passion.
                    </p>
                    <p className="text-gray-100 mt-2 leading-relaxed">
                        Through storytelling, video production, and leveraging digital platforms, I aim to connect with people and share ideas that matter.
                    </p>

                     {/* Get Started button */}
                     <div className="py-5 ">
                            <div className="grid gap-8 justify-start items-start ">
                                <div className="relative group">

                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                                    <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                                        <a href='/contact' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">Learn More <span className="ml-2">📹</span></a>
                                    </button>
                                </div>
                            </div>
                        </div>

                   
                </div>

                {/* Right Content - YouTube Videos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Video 1 */}
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            className="w-full h-48"
                            src="https://www.youtube.com/embed/vNYLJs4G56I?si=0vRivdvRCANfnsNE" // Replace 'example1' with your YouTube video ID
                            title="YouTube video 1"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <p className="text-gray-700 font-semibold text-center mt-2">Video Title 1</p>
                    </div>

                    {/* Video 2 */}
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            className="w-full h-48"
                            src="https://www.youtube.com/embed/example2" // Replace 'example2' with your YouTube video ID
                            title="YouTube video 2"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <p className="text-gray-700 font-semibold text-center mt-2">Video Title 2</p>
                    </div>

                    {/* Video 3 */}
                    <div className="rounded-lg overflow-hidden shadow-lg">
                        <iframe
                            className="w-full h-48"
                            src="https://www.youtube.com/embed/example3" // Replace 'example3' with your YouTube video ID
                            title="YouTube video 3"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <p className="text-gray-700 font-semibold text-center mt-2">Video Title 3</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContentPortfolio;


