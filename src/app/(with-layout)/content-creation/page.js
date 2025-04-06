import Link from "next/link";
import { Metadata } from "next";

async function getContentData() {
    const url = `${process.env.NEXTAUTH_URL}/api/content`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch content data');
    const content = await res.json();
    return content.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function generateMetadata() {
    try {
        const content = await getContentData();
        const description = "Discover Ataullah Mesbah's creative journey through captivating videos on YouTube and Facebook.";
        return {
            title: "Content Creation - Ataullah Mesbah",
            description,
            keywords: ["content creation", "Ataullah Mesbah", "YouTube", "Facebook", "videos"],
            alternates: { canonical: "https://ataullahmesbah.com/content-creation" },
            openGraph: {
                title: "Content Creation - Ataullah Mesbah",
                description,
                url: "https://ataullahmesbah.com/content-creation",
                images: [{ url: "https://ataullahmesbah.com/og-image-content.jpg" }],
                type: "website",
            },
        };
    } catch (error) {
        return { title: "Content Creation - Ataullah Mesbah" };
    }
}

export default async function ContentCreationPage() {
    let content = [];
    try {
        content = await getContentData();
    } catch (error) {
        console.error("Error fetching content:", error);
    }

    const youtubeVideos = content.filter(v => v.platform === 'YouTube').slice(0, 6);
    const facebookVideos = content.filter(v => v.platform === 'Facebook').slice(0, 6);

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Content Creation by Ataullah Mesbah",
        "description": "A curated collection of videos by Ataullah Mesbah on YouTube and Facebook.",
        "url": "https://ataullahmesbah.com/content-creation",
        "itemListElement": content.map((video, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": video.link,
            "name": video.title,
        })),
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />

            {/* Hero Header */}
            <header className="relative py-20 px-6 text-center bg-gradient-to-r from-blue-900 via-gray-900 to-gray-800">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-50"></div>
                <h1 className="relative text-5xl md:text-6xl font-extrabold tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">
                        Content Creation
                    </span>
                    <span className="block text-gray-300 mt-2">by Ataullah Mesbah</span>
                </h1>
                <p className="relative text-lg md:text-xl text-gray-300 mt-4 max-w-3xl mx-auto">
                    Crafting stories that inspire, entertain, and connect—explore my journey on YouTube and Facebook.
                </p>
                <div className="mt-8">
                    <Link href="#videos" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300">
                        Explore My Videos
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </header>

            {/* YouTube Videos Section */}
            <section id="videos" className="py-20 px-6 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                    <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.5 6.2c-.3-1.1-1.1-2-2.2-2.3C19 3.5 12 3.5 12 3.5s-7 0-9.3.4c-1.1.3-1.9 1.2-2.2 2.3C.5 8.5.5 12 .5 12s0 3.5.4 5.8c.3 1.1 1.1 2 2.2 2.3 2.3.4 9.3.4 9.3.4s7 0 9.3-.4c-1.1-.3-1.9-1.2-2.2-2.3-.4-2.3-.4-5.8-.4-5.8s0-3.5.4-5.8zM9.5 15.5V8.5l6 3.5-6 3.5z" />
                    </svg>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">YouTube Creations</span>
                </h2>
                {youtubeVideos.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No YouTube videos available yet. Stay tuned!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {youtubeVideos.map(video => {
                            const videoId = video.link.match(/(?:v=)([^&]+)/)?.[1] || video.link.split('/').pop();
                            return (
                                <div key={video._id} className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
                                    <div className="relative">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={video.title}
                                            className="w-full h-56 rounded-t-2xl"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">{video.title}</h3>
                                        <p className="text-gray-400 mt-2 line-clamp-2">{video.description}</p>
                                        <Link href={video.link} target="_blank" className="mt-4 inline-flex items-center text-red-500 hover:text-red-400 font-medium transition-colors">
                                            Watch on YouTube
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {content.filter(v => v.platform === 'YouTube').length > 6 && (
                    <div className="text-center mt-12">
                        <Link href="/content-creation/youtube" className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300">
                            View All YouTube Videos
                        </Link>
                    </div>
                )}
            </section>

            {/* Facebook Videos Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-850">
                <h2 className="text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                    <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.7c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7C18.3 21.1 22 17 22 12z" />
                    </svg>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700">Facebook Creations</span>
                </h2>
                {facebookVideos.length === 0 ? (
                    <p className="text-center text-gray-400 text-lg">No Facebook videos available yet. Stay tuned!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facebookVideos.map(video => {
                            const fbLink = encodeURIComponent(video.link);
                            return (
                                <div key={video._id} className="group relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
                                    <div className="relative">
                                        <iframe
                                            src={`https://www.facebook.com/plugins/video.php?href=${fbLink}&show_text=false`}
                                            title={video.title}
                                            className="w-full h-56 rounded-t-2xl"
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                                            allowFullScreen
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-500 transition-colors">{video.title}</h3>
                                        <p className="text-gray-400 mt-2 line-clamp-2">{video.description}</p>
                                        <Link href={video.link} target="_blank" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors">
                                            Watch on Facebook
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {content.filter(v => v.platform === 'Facebook').length > 6 && (
                    <div className="text-center mt-12">
                        <Link href="/content-creation/facebook" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300">
                            View All Facebook Videos
                        </Link>
                    </div>
                )}
            </section>

            {/* Behind the Scenes Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-gradient-to-b from-gray-900 to-gray-800">
                <h2 className="text-4xl font-bold text-center mb-12">Behind the Scenes</h2>
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-gray-300 text-lg mb-6">
                        Ever wondered how these videos come to life? From scripting to shooting, editing to uploading—here’s a peek into my creative process.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-blue-400">Scripting</h3>
                            <p className="text-gray-400 mt-2">Crafting compelling narratives that resonate.</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-blue-400">Filming</h3>
                            <p className="text-gray-400 mt-2">Capturing moments with precision and passion.</p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-blue-400">Editing</h3>
                            <p className="text-gray-400 mt-2">Polishing raw footage into a masterpiece.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inspiration Section */}
            <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-850">
                <h2 className="text-4xl font-bold text-center mb-12">What Inspires Me</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold text-blue-400 mb-4">Travel & Culture</h3>
                        <p className="text-gray-300">
                            Exploring new places and sharing their stories fuels my creativity and connects me with my audience.
                        </p>
                    </div>
                    <div className="bg-gray-700 p-6 rounded-xl shadow-lg">
                        <h3 className="text-2xl font-semibold text-blue-400 mb-4">Community</h3>
                        <p className="text-gray-300">
                            Hearing from viewers and building a community drives me to create content that matters.
                        </p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 px-6 text-center bg-gradient-to-t from-blue-900 to-gray-900">
                <h2 className="text-4xl font-bold mb-6">Join My Journey</h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                    Subscribe to my channels and stay updated with my latest creations!
                </p>
                <div className="flex justify-center gap-6">
                    <Link href="https://youtube.com/@yourchannel" target="_blank" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300">
                        Subscribe on YouTube
                    </Link>
                    <Link href="https://facebook.com/yourpage" target="_blank" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300">
                        Follow on Facebook
                    </Link>
                </div>
            </section>
        </div>
    );
}