'use client';

import { useTypewriter, Cursor } from 'react-simple-typewriter';

const LeftSideBanner = () => {
    const [text] = useTypewriter({
        words: ['a Developer.', 'an SEO Expert.', 'a Content Creator.', 'a Traveler.' ],
        loop: true,
        typeSpeed: 20,
        deleteSpeed: 10,
        delaySpeed: 2000,
    });

    return (
        <div className="flex flex-col items-center md:items-start md:w-1/2 gap-5 text-center md:text-left poppins-regular">
            <h1 className="md:text-5xl text-3xl font-bold">
                Hi, I’m <span className="text-[#9393a4] capitalize">Ataullah Mesbah</span>
            </h1>
            <h2 className="lg:text-4xl text-xl font-bold">
                <span className="text-[#eeeeee]">{text}</span>
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
            {/* <a href='/contact' className="flex flex-col items-center md:items-start w-full">
                <button className="mt-6 w-36 bg-sky-800 text-white py-3 px-4 rounded-lg hover:bg-opacity-80 transition duration-300">
                    Get Started
                </button>
            </a> */}

            <div className="py-5">
                <div className="grid gap-8 items-start justify-center">
                    <div className="relative group">

                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                        <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600">
                            <span className="flex items-center space-x-5">

                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600 -rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
                                </svg>


                                <a href='/contact' className="pr-6 text-gray-100">Get Started</a>
                            </span>
                            <span className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">Begin your journey &rarr;</span>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LeftSideBanner;
