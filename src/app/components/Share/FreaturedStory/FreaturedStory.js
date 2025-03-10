import Image from "next/image";

const FeaturedStory = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Left Image Section */}
                <div className="w-full">
                    <Image
                        src="https://i.ibb.co/YT42Bhc2/ai43.jpg"
                        alt="Featured Story"
                        width={550}
                        height={450}
                        className="w-full rounded-md h-72 md:h-80 object-cover"
                        priority
                    />
                </div>

                {/* Right Text Section */}
                <div className="space-y-4">
                    <p className="text-sm uppercase font-semibold text-gray-500 tracking-wide">
                        Featured Story
                    </p>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                        Ten principles of Hostinger: What’s the antidote to stagnation?
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Launching a project or finding the perfect way to start a blog post can sometimes feel like an endless task, right? I know the struggle all too well. But there's one thing I've le…
                    </p>

                    {/* Author Section */}
                    <div className="flex items-center gap-4 mt-4">
                        <Image
                            src="https://i.ibb.co/YT42Bhc2/ai43.jpg"
                            alt="Author"
                            width={50}
                            height={50}
                            className="w-12 h-12 rounded-full object-cover"
                            priority
                        />
                        <div>
                            <p className="font-semibold text-gray-800">Ataullah Mesbah</p>
                            <p className="text-sm text-gray-500">Mar 06, 2025</p>

                            {/* <p className="text-gray-800">
                                {new Intl.DateTimeFormat('en-US', {
                                    month: 'short', // "Mar"
                                    day: '2-digit', // "06"
                                    year: 'numeric' // "2025"
                                }).format(new Date(blog.publishDate))}
                            </p> */}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedStory;
