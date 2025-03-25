
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const ProjectGallery = ({ gallery }) => {
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);

    return (
        <section>
            <h2 className="text-xl font-bold text-white mb-4">Gallery</h2>
            <div className="space-y-4">
                {/* Main Gallery Image */}
                <div className="relative aspect-square rounded-lg overflow-hidden">
                    <Image
                        src={gallery[activeGalleryImage].url}
                        alt={gallery[activeGalleryImage].alt}
                        fill
                        className="object-cover"
                        loading="lazy"
                    />
                </div>

                {/* Thumbnail Grid */}
                <div className="grid grid-cols-4 gap-2">
                    {gallery.map((image, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveGalleryImage(idx)}
                            className={`relative aspect-square rounded overflow-hidden transition-opacity ${activeGalleryImage === idx ? 'ring-2 ring-blue-400' : 'opacity-70 hover:opacity-100'}`}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                className="object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectGallery;