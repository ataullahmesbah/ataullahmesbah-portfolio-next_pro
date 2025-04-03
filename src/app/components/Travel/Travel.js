// app/(with-layout)/components/MesbahOffWeGo.jsx

import Image from "next/image";
import Link from "next/link";

export default function MesbahOffWeGo({ travels }) {
    const journey = travels.find(t => t.category === 'Journey') || {};
    const historicalSites = travels
        .filter(t => t.category === 'Historical')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
    const gallery = travels
        .filter(t => t.category === 'Gallery')
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);

    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Travel - Ataullah Mesbah",
        "description": "Explore Ataullah Mesbah's travel adventures, including historical sites and photo galleries.",
        "url": "https://ataullahmesbah.com/mesbahoffwego",
        "mainEntity": [
            {
                "@type": "CollectionPage",
                "name": "Historical Travel Sites",
                "description": "A collection of historical travel sites visited by Ataullah Mesbah.",
                "itemListElement": historicalSites.map((site, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://ataullahmesbah.com/mesbahoffwego/${site.slug}`,
                    "name": site.title,
                    "image": site.imageUrl,
                })),
            },
            {
                "@type": "CollectionPage",
                "name": "Travel Photo Gallery",
                "description": "A gallery of travel photos captured by Ataullah Mesbah.",
                "itemListElement": gallery.map((photo, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://ataullahmesbah.com/mesbahoffwego/${photo.slug}`,
                    "name": photo.title,
                    "image": photo.imageUrl,
                })),
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-800 border-b border-gray-700" style={{ background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)' }}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }} />
            <section className="py-12 px-6 text-center border-b border-gray-800 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-white uppercase">
                    Mesbah Off We Go <span className="text-green-600">Adventures</span>
                </h1>
                <p className="text-gray-300 mt-4">
                    Explore my adventures around the globe and discover some of the most breathtaking historical travel sites.
                </p>
            </section>
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">{journey.title || 'My Travel Journey'}</h2>
                        <p className="text-gray-300 leading-relaxed">{journey.description?.split('\n')[0] || 'Over the years, I have traveled to numerous countries.'}</p>
                        <p className="text-gray-300 mt-4 leading-relaxed">{journey.description?.split('\n')[1] || 'These experiences have inspired me to share my journey.'}</p>
                        <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold">
                            <Link href={`/mesbahoffwego/${journey.slug}`}>View Historical Sites</Link>
                            {/*  */}

                        </button>
                    </div>
                    <div>
                        <Image src={journey.imageUrl || '/images/travel/campgreen.jpg'} alt={journey.title || 'Travel Journey'} width={300} height={100} className="rounded-lg shadow-lg w-full h-auto" />
                    </div>
                </div>
            </section>
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Historical Travel Sites</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {historicalSites.map(site => (
                        <div key={site._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            <Image src={site.imageUrl} alt={site.title} width={600} height={400} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <h3 className="text-xl font-bold text-gray-800">{site.title}</h3>
                                <p className="text-gray-600 mt-2">{site.description.slice(0, 160) + (site.description.length > 160 ? '...' : '')}</p>
                                <Link href={`/mesbahoffwego/${site.slug}`} className="text-green-600 mt-4 inline-block hover:underline">
                                    Learn More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Travel Photo Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {gallery.map(photo => (
                        <Link key={photo._id} href={`/mesbahoffwego/${photo.slug}`} className="relative group rounded-lg overflow-hidden shadow-lg">
                            <Image src={photo.imageUrl} alt={photo.title} width={200} height={150} className="w-full h-40 object-cover transform group-hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-opacity duration-300">
                                <p className="text-white opacity-0 group-hover:opacity-100">{photo.title}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Favorite Destinations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {historicalSites.slice(0, 2).map(dest => (
                        <div key={dest._id} className="flex flex-col md:flex-row items-center bg-gray-800 rounded-lg p-4">
                            <Image src={dest.imageUrl} alt={dest.title} width={200} height={150} className="rounded-lg w-full md:w-1/3 h-40 object-cover" />
                            <div className="mt-4 md:mt-0 md:ml-4 text-gray-300">
                                <h3 className="text-xl font-bold">{dest.title}</h3>
                                <p>{dest.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="py-16 px-6 max-w-7xl mx-auto bg-gray-900">
                <h2 className="text-3xl font-bold text-white text-center mb-8">Travel Tips</h2>
                <div className="text-gray-300 space-y-4 max-w-2xl mx-auto">
                    <p>1. Always plan your itinerary but leave room for spontaneity.</p>
                    <p>2. Pack light to make your journey more comfortable.</p>
                    <p>3. Learn a few local phrases to connect with people.</p>
                </div>
            </section>
        </div>
    );
}