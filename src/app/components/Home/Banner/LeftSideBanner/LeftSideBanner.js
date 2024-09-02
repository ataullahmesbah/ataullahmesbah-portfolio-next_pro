'use client';

import { useTypewriter, Cursor } from 'react-simple-typewriter';

const LeftSideBanner = () => {
    const [text] = useTypewriter({
        words: ['a Developer.', 'an SEO Expert.', 'a Traveler.', 'a Sports Lover.'],
        loop: true,
        typeSpeed: 20,
        deleteSpeed: 10,
        delaySpeed: 2000,
    });

    return (
        <div className="flex flex-col items-center md:items-start md:w-1/2 gap-5 text-center md:text-left poppins-regular">
            <h1 className="md:text-5xl text-3xl font-bold">
                Hi, I’m <span className="text-[#0c0a36] capitalize">Ataullah Mesbah</span>
            </h1>
            <h2 className="lg:text-4xl text-xl font-bold">
                <span className="text-[#000000]">{text}</span>
                <Cursor cursorStyle="|" cursorColor="#00CCFF" />
            </h2>

            {/* User description */}
            <p className="mt-4">
                I am passionate about development, search engine optimization, and exploring new places.
               
                I thrive in creating efficient and dynamic web applications that solve real-world problems.
             
                As a travel enthusiast, I love to document my journeys and share them with the world.
            </p>
            <p className="mt-4">
                Whether it’s coding, trekking, or sports, I’m always eager to take on new challenges.
              
                Join me on this exciting journey to explore, learn, and grow together!
            </p>

            {/* Get Started button */}
            <div className="flex flex-col items-center md:items-start w-full">
                <button className="mt-6 w-36 bg-sky-800 text-white py-3 px-4 rounded-lg hover:bg-opacity-80 transition duration-300">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default LeftSideBanner;
