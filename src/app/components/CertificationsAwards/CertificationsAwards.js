'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaCertificate } from 'react-icons/fa';

export default function CertificationsAwards() {
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const res = await fetch('/api/certifications', { cache: 'no-store' });
                if (!res.ok) {
                    throw new Error('Failed to fetch certifications');
                }
                const data = await res.json();
                setCertifications(data);
            } catch (error) {
                console.error('Fetch certifications error:', error);
                setCertifications([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCertifications();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <section className="bg-gray-800 py-12 px-4 md:px-8 lg:px-12">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start px-6 lg:px-20 space-y-12 md:space-y-0">
                {/* Left Side - Static Text */}
                <section className="text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-100">Certifications & Awards</h3>
                    <p className="mt-4 text-gray-200 text-sm md:text-base">
                        Explore my professional certifications showcasing expertise in SEO, Development, Content Creation, and Marketing.
                    </p>
                    <div className="text-white p-4">
                        <h4 className="text-xl font-semibold mb-2">Highlighted Certifications:</h4>
                        <ul className="space-y-2">
                            {certifications.slice(0, 5).map((cert) => (
                                <li key={cert._id} className="flex items-center">
                                    <FaCertificate className="text-yellow-400 mr-2" />
                                    {cert.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Right Side - Auto-Sliding Certifications */}
                <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg w-full">
                    <Swiper
                        spaceBetween={10}
                        loop={true}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        modules={[Autoplay, Pagination]}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 1 },
                            1024: { slidesPerView: 1 },
                        }}
                        className="w-full"
                    >
                        {certifications.map((cert) => (
                            <SwiperSlide key={cert._id} className="flex flex-col items-center text-center">
                                <div className="relative w-full max-w-xl mx-auto h-48 md:h-56 lg:h-64">
                                    <Image
                                        src={cert.image}
                                        alt={cert.title}
                                        fill
                                        className="object-contain rounded-md shadow"
                                        priority
                                    />

                                    {/* hh */}
                                </div>
                                <div className="mt-3">
                                    <p className="text-gray-100 font-medium text-sm md:text-base">{cert.title}</p>
                                    <p className="text-gray-200 text-xs md:text-sm">Issued by: {cert.issuer}</p>
                                    {cert.credentialId && (
                                        <p className="text-gray-200 text-xs md:text-sm">Credential ID: {cert.credentialId}</p>
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}