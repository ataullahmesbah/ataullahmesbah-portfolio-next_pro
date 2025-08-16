'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

const ProjectGallery = ({ gallery }) => {
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <section className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
            <div className="space-y-4">
                {/* Main Gallery Image */}
                <div 
                    className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden cursor-zoom-in"
                    onClick={toggleFullscreen}
                >
                    <Image
                        src={gallery[activeGalleryImage].url}
                        alt={gallery[activeGalleryImage].alt}
                        fill
                        className="object-contain"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 80vw"
                    />
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {gallery.map((image, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveGalleryImage(idx)}
                            className={`relative aspect-square rounded overflow-hidden transition-all ${activeGalleryImage === idx
                                ? 'ring-2 ring-blue-400 scale-105'
                                : 'opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                        >
                            <div className="absolute inset-0">
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className="object-cover"
                                    loading="lazy"
                                    sizes="100px"
                                />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Fullscreen Modal */}
                {isFullscreen && (
                    <div 
                        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                        onClick={toggleFullscreen}
                    >
                        {/* Close Button */}
                        <button 
                            className="absolute top-4 right-4 text-white text-2xl z-50 hover:text-gray-300 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFullscreen();
                            }}
                            aria-label="Close fullscreen"
                        >
                            <FaTimes />
                        </button>

                        {/* Fullscreen Image */}
                        <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                            <Image
                                src={gallery[activeGalleryImage].url}
                                alt={gallery[activeGalleryImage].alt}
                                fill
                                className="object-contain"
                                loading="lazy"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Navigation Arrows (optional) */}
                        {gallery.length > 1 && (
                            <>
                                <button
                                    className="absolute left-4 md:left-8 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 z-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveGalleryImage((prev) => 
                                            (prev - 1 + gallery.length) % gallery.length
                                        );
                                    }}
                                    aria-label="Previous image"
                                >
                                    &larr;
                                </button>
                                <button
                                    className="absolute right-4 md:right-8 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 z-50"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveGalleryImage((prev) => 
                                            (prev + 1) % gallery.length
                                        );
                                    }}
                                    aria-label="Next image"
                                >
                                    &rarr;
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectGallery;