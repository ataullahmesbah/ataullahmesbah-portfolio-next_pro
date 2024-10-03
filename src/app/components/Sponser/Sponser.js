// src/components/Sponser.js
import React from 'react';
import Image from 'next/image';
import hy from "/public/images/sponser/Hyascka.png";
import sp1 from "/public/images/sponser/sp1.png";
import sp2 from "/public/images/sponser/sp2.png";
import sp3 from "/public/images/sponser/sp3.png";
import sp4 from "/public/images/sponser/sp4.png";
import sp5 from "/public/images/sponser/sp5.png";

const Sponser = () => {
    return (
        // <main className='bg-blue-50 py-10'>
        <main className=' py-10'>
            <div className="max-w-6xl mx-auto overflow-hidden">
                <div className="flex space-x-8 animate-marquee poppins-regular">
                    {/* First set of sponsor images */}
                    {[hy, sp1, sp2, sp3, sp4, sp5].map((sponsorImage, index) => (
                        <div key={`first-${index}`} className="flex-none w-40 h-20 relative">
                            <Image
                                src={sponsorImage}
                                alt={`Sponsor ${index + 1}`}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-md"
                            />
                        </div>
                    ))}
                    {/* Duplicate the set of sponsor images for continuous effect */}
                    {[hy, sp1, sp2, sp3, sp4, sp5].map((sponsorImage, index) => (
                        <div key={`second-${index}`} className="flex-none w-40 h-20 relative">
                            <Image
                                src={sponsorImage}
                                alt={`Sponsor ${index + 1}`}
                                layout="fill"
                                objectFit="contain"
                                className="rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Sponser;
