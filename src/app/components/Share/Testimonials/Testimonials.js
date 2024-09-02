'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Rating from 'react-rating';
import { FaStar, FaRegStar, FaGoogle } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]); // State to store reviews data
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [averageRating, setAverageRating] = useState(0); // State to store average rating
    const [totalReviews, setTotalReviews] = useState(0); // State to store total number of reviews

    // Fetch reviews data from JSON file or API endpoint
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch('/reviews.json'); // Adjust path if needed
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setReviews(data);
                setLoading(false);

                // Calculate total reviews and average rating
                const totalReviewsCount = data.length;
                const totalRatingSum = data.reduce((sum, review) => sum + review.rating, 0);
                const averageRatingValue = totalRatingSum / totalReviewsCount;

                setTotalReviews(totalReviewsCount);
                setAverageRating(averageRatingValue);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
                setLoading(false);
            }
        };

        fetchReviews();
    }, []); // Empty dependency array to run effect only once

    if (loading) {
        return <p>Loading reviews...</p>; // Simple loading state
    }

    return (
        <main className="bg-gray-50 py-7 poppins-regular">
            <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8 text-center">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                        bulletClass: 'swiper-pagination-bullet',
                        bulletActiveClass: 'swiper-pagination-bullet-active',
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    loop={true}
                    spaceBetween={30}
                    slidesPerGroup={1}
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="flex flex-wrap gap-6 justify-center"
                >
                    {reviews.map((review) => (
                        <SwiperSlide key={review._id}>
                            <div className={`${review.category === 'Blue' ? 'bg-blue-500' : 'bg-gray-100 shadow-md'} text-black p-6 rounded-lg mb-6 max-w-sm mx-auto`}>
                                <div className="flex justify-center items-center mb-4 relative">
                                    {/* Image */}
                                    <div className="relative">
                                        <Image
                                            src={review.image}
                                            alt={review.user_name}
                                            width={50}
                                            height={50}
                                            className="rounded-full w-14 h-14 border border-gray-400"
                                        />
                                        {/* Google Icon Positioned Next to Image */}
                                        <FaGoogle className="absolute bottom-0 right-0 text-sky-900 bg-white rounded-full p-1" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold">{review.user_name}</h3>
                                <p className="text-sm">{review.user_position}</p>
                                <Rating
                                    initialRating={review.rating}
                                    readonly
                                    emptySymbol={<FaRegStar className="text-yellow-400" />}
                                    fullSymbol={<FaStar className="text-yellow-400" />}
                                    fractions={2} // Allows for half-star ratings
                                />
                                <p className="text-sm mt-4">{review.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}

                    {/* Custom Navigation Buttons */}
                    <div className="swiper-button-prev custom-swiper-button text-sky-900"></div>
                    <div className="swiper-button-next custom-swiper-button text-sky-900"></div>
                </Swiper>

                {/* Pagination Dots */}
                
            </div>

            {/* Display average rating and total reviews */}
            <p className="mt-2 text-center px-3"><span className='font-semibold'>Google Rating</span> score: <span className='font-semibold'>{averageRating.toFixed(1)}</span> of 5, based on {totalReviews} reviews</p>
        </main>
    );
};

export default Testimonials;
