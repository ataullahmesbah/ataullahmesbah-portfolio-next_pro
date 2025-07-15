'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const ProjectGallery = ({ gallery }) => {
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);

    return (
        <section className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
            <div className="space-y-4">
                {/* Main Gallery Image - Consistent aspect ratio */}
                <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden ">
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
                <div className="grid grid-cols-4 gap-2">
                    {gallery.map((image, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveGalleryImage(idx)}
                            className={`relative aspect-square rounded overflow-hidden transition-all ${activeGalleryImage === idx
                                ? 'ring-2 ring-blue-400 scale-105'
                                : 'opacity-80 hover:opacity-100 hover:scale-105'
                                }`}
                        >
                            <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-800">
                                <Image
                                    src={gallery[activeGalleryImage].url}
                                    alt={gallery[activeGalleryImage].alt}
                                    fill
                                    className="object-scale-down"
                                    style={{
                                        objectFit: 'scale-down',
                                        objectPosition: 'center'
                                    }}
                                    loading="lazy"
                                />
                            </div> <div className="absolute inset-0 flex items-center justify-center rounded-lg">
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
            </div>
        </section>
    );
};

export default ProjectGallery;