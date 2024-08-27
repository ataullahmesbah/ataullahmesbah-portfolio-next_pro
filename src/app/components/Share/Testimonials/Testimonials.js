'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Rating from 'react-rating';
// Import Font Awesome
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Testimonials = () => {
    const [reviews, setReviews] = useState([]); // State to store reviews data
    const [loading, setLoading] = useState(true); // State to manage loading state

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
        <main className='bg-gray-50'>
            <div className="max-w-7xl mx-auto py-8 px-4 lg:px-8 text-center flex flex-wrap gap-6 justify-center ">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className={`${review.category === 'Blue' ? 'bg-blue-500' : 'bg-gray-100 shadow-md'
                            } text-black p-6 rounded-lg mb-6 max-w-sm`}
                    >
                        <div className="flex justify-center mb-4">
                            <Image
                                src={review.image}
                                alt={review.user_name}
                                width={50}
                                height={50}
                                className="rounded-full w-12 h-12 border-2 border-white"
                            />
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
                ))}
            </div>
        </main>
    );
};

export default Testimonials;
