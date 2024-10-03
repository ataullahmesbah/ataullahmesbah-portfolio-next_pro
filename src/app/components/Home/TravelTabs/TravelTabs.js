import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";

const TravelTabs = () => {
    const [travelData, setTravelData] = useState([]);
    const [travelInfo, setTravelInfo] = useState([]);

    useEffect(() => {
        // Fetch the travel places
        fetch("/traveltabs.json") // Path to your travel places JSON
            .then((response) => response.json())
            .then((data) => setTravelData(data))
            .catch((error) => console.error("Error fetching travel data:", error));

        // Fetch the travel info
        fetch("/traveltabs2.json") // Path to your travel info JSON
            .then((response) => response.json())
            .then((data) => setTravelInfo(data.travelInfo))
            .catch((error) => console.error("Error fetching travel info:", error));
    }, []);

    return (
        <main className="p-4 poppins-regular">
            <div className="text-left mb-8">
                <h3 className="text-3xl font-bold mb-2 text-gray-300">Travel Experiences</h3>
                <p className="text-gray-300">
                    Discover my adventures around the world, from serene nature escapes to bustling urban explorations.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
                {/* Left Section: Travel Destinations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {travelData.map((place) => (
                        <div
                            key={place._id}
                            className="flex flex-col space-y-2 bg-gray-100 hover:text-blue-600 items-center justify-center shadow-md shadow-blue-400 rounded-lg p-4 text-center hover:shadow-md hover:border-blue-800 hover:shadow-blue-500 transition duration-300 ease-linear transform hover:scale-105"
                        >
                            <Image
                                className="rounded-lg"
                                src={place.image}
                                alt={place.title}
                                width={300}
                                height={200}
                                layout="responsive"
                                objectFit="cover"
                            />
                            <h3 className="text-sm text-gray-800 font-semibold mt-2">
                                {place.title}
                            </h3>
                            <p className="text-xs text-gray-600">{place.description}</p>
                        </div>
                    ))}
                </div>

                {/* Right Section: Travel Information */}
                <div className="space-y-6">
                    {travelInfo.map((info, index) => (
                        <div key={index} className="bg-white shadow-lg p-6 rounded-lg text-left">
                            <h3 className="text-2xl font-bold text-sky-800">
                                {info.title}
                            </h3>
                            <p className="text-gray-700 mt-4">
                                {info.description}
                            </p>
                            <ul className="list-none pl-0 mt-4 text-gray-700 space-y-2">
                                {info.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center group">
                                        <FaCheckCircle className="text-sky-800 mr-2" />
                                        <span className="group-hover:text-blue-800 transition-colors duration-300">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <button className="bg-sky-800 rounded-md p-4">
                        <Link href="https://trekexploretravel.com" className="text-white text-center px-3">
                            Visit My Adventures
                        </Link>
                    </button>
                </div>
            </div>
        </main>
    );
};

export default TravelTabs;
