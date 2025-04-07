import Image from "next/image";
import Link from "next/link";

const ContentPortfolio = () => {
    // Sample YouTube video data
    const featuredVideos = [
        {
            id: "vNYLJs4G56I",
            title: "Exploring Kashmir"
        },
        {
            id: "dQw4w9WgXcQ",
            title: "Adventure Vlog"
        },
        {
            id: "9bZkp7q19f0",
            title: "Travel Diaries"
        }
    ];

    return (
        <section className="py-12 px-4 sm:px-6  border-t border-gray-800">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Content - Content Creation Journey */}
                    <div className="flex flex-col justify-center">
                        <span className="text-blue-400 font-semibold text-sm tracking-wider uppercase">
                            Content Creation
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
                            My Content <span className="text-blue-500">Journey</span>
                        </h2>
                        <p className="text-gray-300 mt-4 leading-relaxed">
                            Over the years, I&apos;ve embarked on a journey to create meaningful content that inspires, educates, and entertains.
                            From writing blogs to creating videos, content creation has been my passion.
                        </p>
                        <p className="text-gray-300 mt-2 leading-relaxed">
                            Through storytelling and video production, I aim to connect with people and share ideas that matter.
                        </p>

                        {/* CTA Button */}
                        {/* Using your existing DynamicButton without modifications */}
                        <div className="mt-6">
                            <div className="grid gap-8 justify-start items-start">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                                        <Link href="/content-creation" className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">
                                            Learn More <span className="ml-2">📹</span>
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - YouTube Videos Preview */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        {featuredVideos.map((video, index) => (
                            <div
                                key={video.id}
                                className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all"
                            >
                                <div className="aspect-w-16 aspect-h-9 bg-gray-800">
                                    <Image
                                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                                        alt={video.title}
                                        width={320}
                                        height={180}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                                                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white text-xs sm:text-sm font-medium text-center mt-2 px-1 line-clamp-2">
                                    {video.title}
                                </p>
                                <Link
                                    href={`/content-creation?video=${video.id}`}
                                    className="absolute inset-0"
                                    aria-label={`Watch ${video.title}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContentPortfolio;