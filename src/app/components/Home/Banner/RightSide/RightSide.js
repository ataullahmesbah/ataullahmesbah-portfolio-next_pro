'use client';

import Image from 'next/image';
 // Icons for example


import { FaLinkedin, FaGithub, FaDribbble, FaTwitter, FaInstagram } from 'react-icons/fa';

const RightSideBanner = () => {


    return (
        <div className="md:w-1/2 flex justify-center md:justify-end relative">
            {/* Circular Image */}
            <div className="border-2 p-3 rounded-full border-gray-800 relative">
                <Image
                    src='https://i.ibb.co/gR2V4cn/image.jpg'
                    alt="Banner Image"
                    width={500}
                    height={500}
                    objectFit="cover"
                    className="rounded-full w-72 h-72 md:w-96 md:h-96"
                />

               
            </div>
        </div>
    );
};

export default RightSideBanner;