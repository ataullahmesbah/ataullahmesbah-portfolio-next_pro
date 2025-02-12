"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Rating from "react-rating";
import { FaStar, FaRegStar, FaGoogle, FaUser } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
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

                // Ensure that data is an array
                if (Array.isArray(data)) {
                    setReviews(data);
                    setTotalReviews(data.length);

                    // Calculate total rating and average
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

    if (loading) return <p className="text-center text-gray-400">Loading reviews...</p>;

    return (
        <main className="text-white py-7 poppins-regular">
            <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8 text-center">
                {reviews.length > 0 ? (
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                        navigation
                        loop
                        spaceBetween={30}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {reviews.map((review) => (
                            <SwiperSlide key={review._id}>
                                <div className="bg-slate-700 text-gray-200 p-6 rounded-xl mb-6 max-w-sm mx-auto shadow-md">
                                    
                                
                                
                                <div className="relative flex justify-center items-center mb-4">
    {/* Profile Image */}
    {review.image ? (
        <Image
            src={review.image}
            alt={review.user_name}
            width={50}
            height={50}
            className="rounded-full w-14 h-14 border-2 border-white shadow-md object-cover"
        />
    ) : (
        <FaUser className="w-14 h-14 p-2 text-gray-400 rounded-full border-2 border-white shadow-md" />
    )}

    {/* Google Verification Badge */}
    <div className="absolute -bottom-1   right-32 bg-white rounded-full p-1 shadow-md">
        <FaGoogle className="w-4 h-4 text-blue-600" />
    </div>
</div>




                                    <h3 className="text-lg font-bold">{review.user_name}</h3>
                                    <p className="text-sm">{review.user_position || "Customer"}</p>
                                    <Rating
                                        initialRating={review.rating || 0}
                                        readonly
                                        emptySymbol={<FaRegStar className="text-yellow-500" />}
                                        fullSymbol={<FaStar className="text-yellow-500" />}
                                        fractions={2}
                                    />
                                    <p className="text-sm mt-4">
                                        {review.description ? review.description.slice(0, 180) + "..." : "No review available"}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-gray-400">No testimonials available.</p>
                )}
            </div>

            {totalReviews > 0 && (
                <p className="mt-2 text-center px-3">
                    <span className="font-semibold">Google Rating</span> score:{" "}
                    <span className="font-semibold">{averageRating.toFixed(1)}</span> of 5, based on {totalReviews} reviews
                </p>
            )}
        </main>
    );
};

export default Testimonials;
