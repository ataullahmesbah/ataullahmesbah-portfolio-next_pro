'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Rating from "react-rating";
import { FaStar, FaRegStar, FaGoogle, FaQuoteLeft } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch("/api/testimonials");
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();

                if (Array.isArray(data)) {
                    setReviews(data);
                    setTotalReviews(data.length);
                    const totalRatingSum = data.reduce((sum, review) => sum + (review.rating || 0), 0);
                    setAverageRating(totalRatingSum / data.length);
                } else {
                    console.error("API did not return an array");
                    setReviews([]);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto py-20 text-center">
            <div className="h-8 w-8 mx-auto border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 mb-2">
                        Client Testimonials
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        What people say about working with me
                    </p>
                </div>

                {reviews.length > 0 ? (
                    <>
                        <Swiper
                            modules={[Autoplay, Navigation, Pagination]}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            pagination={{
                                clickable: true,
                                bulletClass: 'swiper-pagination-bullet bg-gray-600',
                                bulletActiveClass: 'swiper-pagination-bullet-active !bg-sky-500'
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            loop
                            spaceBetween={30}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { 
                                    slidesPerView: 2,
                                    spaceBetween: 20
                                },
                                1024: { 
                                    slidesPerView: 3,
                                    spaceBetween: 30
                                },
                            }}
                        >
                            {reviews.map((review) => (
                                <SwiperSlide key={review._id} className="pb-12">
                                    <div className="h-full min-h-[280px] bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-lg hover:shadow-sky-500/10 transition-all duration-300 flex flex-col">
                                        <div className="flex-grow">
                                            <div className="flex items-start mb-4">
                                                <FaQuoteLeft className="text-sky-400/30 text-2xl mr-3 mt-1 flex-shrink-0" />
                                                <p className="text-gray-300 italic line-clamp-5">
                                                    {review.description || "No review available"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex items-center">
                                                <div className="relative mr-4">
                                                    {review.image ? (
                                                        <Image
                                                            src={review.image}
                                                            alt={review.user_name}
                                                            width={48}
                                                            height={48}
                                                            className="rounded-full w-12 h-12 border-2 border-sky-400/30 object-cover"
                                                        />
                                                    ) : (
                                                        <div className="rounded-full w-12 h-12 border-2 border-sky-400/30 flex items-center justify-center bg-gray-700">
                                                            <FaGoogle className="w-5 h-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-100 text-sm">{review.user_name}</h3>
                                                    <p className="text-xs text-gray-400">{review.user_position || "Client"}</p>
                                                    <Rating
                                                        initialRating={review.rating || 0}
                                                        readonly
                                                        emptySymbol={<FaRegStar className="text-yellow-400/60 text-xs" />}
                                                        fullSymbol={<FaStar className="text-yellow-400 text-xs" />}
                                                        fractions={2}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <div className="flex justify-center mt-8">
                            <div className="bg-gray-800/70 border border-gray-700 rounded-full px-6 py-2 inline-flex items-center">
                                <FaGoogle className="text-blue-500 mr-2" />
                                <span className="text-gray-300 text-sm">
                                    <span className="font-medium">Google Rating:</span> {averageRating.toFixed(1)}/5 ({totalReviews} reviews)
                                </span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No testimonials available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Testimonials;