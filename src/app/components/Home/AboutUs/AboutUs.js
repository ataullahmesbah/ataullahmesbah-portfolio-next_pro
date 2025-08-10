'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const firstVideo = {
    id: "vNYLJs4G56I",
    title: "Exploring Kashmir",
    thumbnail: "https://i.ytimg.com/vi/vNYLJs4G56I/hqdefault.jpg"
};

const AboutUs = () => {
    const [showVideo, setShowVideo] = useState(false);
    const [animatedText, setAnimatedText] = useState('');
    const fullText = "About Ataullah Mesbah";
    const videoRef = useRef(null);

    useEffect(() => {
        // Typing animation for title
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullText.length) {
                setAnimatedText(fullText.substring(0, i + 1));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);

        return () => clearInterval(typingInterval);
    }, []);

    useEffect(() => {
        // Scroll animation trigger
        const handleScroll = () => {
            const elements = document.querySelectorAll('.animate-on-scroll');
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.75) {
                    el.classList.add('animate');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleVideoClick = () => {
        setShowVideo(true);
    };

    const handleCloseVideo = (e) => {
        e.stopPropagation();
        setShowVideo(false);
    };

    return (
        <section id="about" className="py-16 bg-gradient-to-b from-gray-900 to-gray-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">

                    {/* Left Side: YouTube Video Player - Now larger */}
                    <div
                        className="w-full lg:w-[48%] animate-on-scroll"
                        style={{
                            transform: 'translateX(-50px)',
                            opacity: 0,
                            transition: 'all 0.8s ease-out'
                        }}
                    >
                        <div
                            className={`relative rounded-xl overflow-hidden shadow-lg shadow-purple-600/30 ${showVideo ? 'shadow-2xl shadow-purple-500/30' : 'cursor-pointer hover:shadow-xl hover:shadow-purple-500/30'} transition-all duration-300 aspect-video w-full max-w-[650px] mx-auto`}
                            onClick={!showVideo ? handleVideoClick : undefined}
                        >
                            {showVideo ? (
                                <>
                                    <iframe
                                        ref={videoRef}
                                        src={`https://www.youtube.com/embed/${firstVideo.id}?autoplay=1&rel=0`}
                                        title={firstVideo.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                    <button
                                        onClick={handleCloseVideo}
                                        className="absolute top-4 right-4 bg-black/80 rounded-full w-10 h-10 flex items-center justify-center z-10 hover:bg-black transition-colors shadow-lg"
                                    >
                                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                                        </svg>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Image
                                        src={firstVideo.thumbnail}
                                        alt={firstVideo.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 80vw, 45vw"
                                        unoptimized
                                    />
                                    {/* Play Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            className="w-14 h-14 text-white/90 drop-shadow-lg hover:scale-110 transition-transform"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M8,5.14V19.14L19,12.14L8,5.14Z"
                                            />
                                        </svg>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Content - Slightly narrower */}
                    <div
                        className="w-full lg:w-[52%] text-center lg:text-left animate-on-scroll"
                        style={{
                            transform: 'translateX(50px)',
                            opacity: 0,
                            transition: 'all 0.8s ease-out 0.2s'
                        }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-sky-500 mb-5">
                            {animatedText}<span className="animate-pulse">|</span>
                        </h2>

                        <div className="space-y-5 text-gray-300 leading-relaxed">
                            <p
                                className="text-base  animate-on-scroll"
                                style={{
                                    transform: 'translateY(20px)',
                                    opacity: 0,
                                    transition: 'all 0.6s ease-out 0.4s'
                                }}
                            >
                                Delivering high-performance, scalable full stack digital solutions that drive real business growth. Leveraging expertise in Next.js, React, Java, Node.js, and both <span className="text-purple-400 font-medium">frontend</span> and <span className="text-purple-400 font-medium">backend</span> technologies to build fast, secure, and tailored web applications
                            </p>

                            <p
                                className="text-base  animate-on-scroll"
                                style={{
                                    transform: 'translateY(20px)',
                                    opacity: 0,
                                    transition: 'all 0.6s ease-out 0.8s'
                                }}
                            >
                                My travel experiences have taken me to unique and lesser-known destinations — hidden gems that inspire fresh perspectives and innovative approaches in crafting creative digital solutions.
                            </p>
                        </div>

                        {/* Get Started button */}
                        <div
                            className="py-5 animate-on-scroll"
                            style={{
                                transform: 'translateY(20px)',
                                opacity: 0,
                                transition: 'all 0.6s ease-out 1s'
                            }}
                        >
                            <div className="grid gap-8 justify-start items-start">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                    <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">
                                        <a href='/contact' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition duration-200">Get Started &rarr;</a>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style jsx>{`
        .animate-on-scroll.animate {
          transform: translateX(0) translateY(0) !important;
          opacity: 1 !important;
        }
        iframe {
          border: none;
          border-radius: 0.5rem;
        }
      `}</style>
        </section>
    );
};

export default AboutUs;