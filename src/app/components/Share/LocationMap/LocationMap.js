'use client';

import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationMap = () => {
    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700 shadow-xl mt-10">
            <div className="p-6">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Come Say Hello</h3>
                <p className="text-gray-400 mb-4">Based in the heart of Dhaka business district</p>
                <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.793148900322!2d90.40663731538583!3d23.79087639322538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ3JzI3LjEiTiA5MMKwMjQnMzMuOSJF!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd&key=your_actual_api_key"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="filter grayscale hover:grayscale-0 transition-all duration-500"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                </div>
                <div className="mt-4 flex items-center text-gray-300">
                    <FaMapMarkerAlt className="text-green-400 mr-2" />
                    <span>Gulshan-1, Dhaka, Bangladesh</span>
                </div>
            </div>
        </div>
    );
};

export default LocationMap;