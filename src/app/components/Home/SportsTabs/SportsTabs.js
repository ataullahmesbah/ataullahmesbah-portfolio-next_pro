'use client';


import { useEffect, useState } from "react";
import Image from "next/image";

const SportsTabs = () => {
    const [memories, setMemories] = useState([]);

    useEffect(() => {
        // Fetch the memories data from the JSON file
        fetch("/sportstabs.json") // Update the path based on your file location
            .then((response) => response.json())
            .then((data) => setMemories(data.memories))
            .catch((error) => console.error("Error fetching memories data:", error));
    }, []);

    return (
        <div className="bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-5 lg:space-y-6 mb-12">
                    <h1 className="title text-3xl font-bold text-blue-800">Barcelona's Golden Generation Memories</h1>
                    <p className="subtitle text-gray-700">Relive the unforgettable moments of Barcelona's golden era from 2009 to 2012.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Featured Memory */}
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                        {memories.length > 0 && (
                            <div className="relative w-full h-64 group">
                                <Image
                                    src={memories[0].imageUrl}
                                    alt={memories[0].title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                />
                                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                                    <h2 className="text-xl font-semibold">{memories[0].title}</h2>
                                    <p className="text-sm">{new Date(memories[0].date).toLocaleDateString()}</p>
                                </div>
                                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                                    <h2 className="text-xl font-semibold">{memories[0].title}</h2>
                                    <p className="text-sm">{new Date(memories[0].date).toLocaleDateString()}</p>
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform">
                                    <h2 className="text-2xl font-semibold mb-2">{memories[0].title}</h2>
                                    <p className="mb-2">{memories[0].description}</p>
                                    <span>{new Date(memories[0].date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}
                        {/* Additional Text Section Below the Featured Memory */}
                        <div className="px-4 py-6 bg-white rounded-lg shadow-lg">
                            <p className="text-gray-700">
                                {memories.length > 0 ? memories[0].description : "No description available."}
                            </p>
                        </div>
                    </div>

                    {/* Other Memories */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {memories.slice(1).map((memory) => (
                            <div key={memory.id} className="relative w-full h-64 group">
                                <Image
                                    src={memory.imageUrl}
                                    alt={memory.title}
                                    layout="fill"
                                    objectFit="cover"
                                    placeholder="blur"
                                    quality={100}
                                    blurDataURL={memory.imageUrl}
                                    className="rounded-lg shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                />
                                <div className="absolute bottom-0 left-0 p-4 text-white w-full">
                                    <h2 className="text-xl font-semibold">{memory.title}</h2>
                                    <p className="text-sm">{new Date(memory.date).toLocaleDateString()}</p>
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform">
                                    <h2 className="text-xl font-semibold mb-2">{memory.title}</h2>
                                    <p className="mb-2">{memory.description}</p>
                                    <span>{new Date(memory.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SportsTabs;
