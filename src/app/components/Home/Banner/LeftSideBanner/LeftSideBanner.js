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
        <div className="md:w-1/2 flex flex-col gap-5">
            <h1 className="md:text-6xl text-3xl font-bold ">
                Hi, I'm <span className="text-[#0c0a36] capitalize">Ataullah Mesbah</span>
            </h1>
            <h2 className="lg:text-4xl text-xl font-bold ">
                <span className="text-[#000000]">{text}</span>
                <Cursor cursorStyle="|" cursorColor="#00CCFF" />
            </h2>

            {/* User description */}
            <p className=" mt-4">
                I am passionate about development, search engine optimization, and exploring new places.
                <br />
                I thrive in creating efficient and dynamic web applications that solve real-world problems.
                <br />
                As a travel enthusiast, I love to document my journeys and share them with the world.
            </p>
            <p className=" mt-4">
                Whether it’s coding, trekking, or sports, I’m always eager to take on new challenges.
                <br />
                Join me on this exciting journey to explore, learn, and grow together!
            </p>

            {/* Get Started button */}
            <div className="flex flex-col items-center w-36">
                <button className="mt-6 w-full bg-sky-800 text-white amsfonts  py-2 px-6 rounded-lg hover:bg-opacity-80 transition duration-300">
                    Get Started
                </button>
            </div>

        </div>
    );
};

export default LeftSideBanner;
