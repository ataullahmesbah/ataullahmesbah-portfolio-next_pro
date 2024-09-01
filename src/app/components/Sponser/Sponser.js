// src/components/Sponser.js
import React from 'react';

const Sponser = () => {
    return (
        <main className='bg-blue-50'>
            <div className="max-w-4xl mx-auto relative overflow-hidden">
            <div className="flex space-x-12 animate-marquee py-10 poppins-regular">
                {/* Repeat the sponsor items for continuous effect */}
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Hyascka</div>
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Sponsor 2</div>
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Trek Explore Travel</div>
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Sponsor 4</div>
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Adidas</div>
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Sponsor 6</div>
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Sponsor 7</div>
                <div className="flex-none w-32 sm:w-40 md:w-48 lg:w-56 text-center">Sponsor 8</div>
               
            </div>
        </div>
        </main>
    );
};

export default Sponser;
