'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Rating from "react-rating";
import { FaStar, FaRegStar, FaGoogle, FaQuoteLeft } from "react-icons/fa";
import { FiPlay } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

const ClientReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        const fetchAndCacheReviews = async () => {
            const cacheKey = 'testimonialsCache';
            const cachedData = localStorage.getItem(cacheKey);
            const now = new Date().getTime();
            const oneHour = 60 * 60 * 1000;

            const processReviews = (data) => {
                if (Array.isArray(data)) {
                    setReviews(data);
                    setTotalReviews(data.length);
                    const totalRatingSum = data.reduce((sum, review) => sum + (review.rating || 0), 0);
                    setAverageRating(data.length > 0 ? totalRatingSum / data.length : 0);
                }
            };

            if (cachedData) {
                const { timestamp, data } = JSON.parse(cachedData);
                if (now - timestamp < oneHour) {
                    processReviews(data);
                    setLoading(false);
                    return;
                }
            }

            try {
                const response = await fetch("/api/testimonials", { next: { revalidate: 3600 } });
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                processReviews(data);
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now, data }));
            } catch (error) {
                console.error("Error fetching reviews:", error);
                if (cachedData) {
                    const { data } = JSON.parse(cachedData);
                    processReviews(data);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAndCacheReviews();
    }, []);

    if (loading) return (
        <div className="max-w-7xl mx-auto py-16 text-center">
            <div className="h-6 w-6 mx-auto border-3 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Client Voices</span>
                    </h2>
                    <p className="text-sm text-gray-200 max-w-md mx-auto font-light">What our clients say about us</p>
                </motion.div>

                {reviews.length > 0 ? (
                    <>
                        <Swiper
                            modules={[Autoplay, Navigation]}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next',
                                prevEl: '.swiper-button-prev',
                            }}
                            loop
                            spaceBetween={16}
                            breakpoints={{
                                320: { slidesPerView: 1, spaceBetween: 12 },
                                640: { slidesPerView: 2, spaceBetween: 16 },
                                1024: { slidesPerView: 3, spaceBetween: 20 },
                            }}
                            className="pb-10"
                        >
                            {reviews.map((review) => (
                                <SwiperSlide key={review._id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4 }}
                                        viewport={{ once: true }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group h-full min-h-[220px] bg-gray-800/30 backdrop-blur-md border border-gray-600/20 rounded-xl p-5 shadow-lg hover:shadow-cyan-400/10 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="flex-grow">
                                            <div className="flex items-start mb-3">
                                                <FaQuoteLeft className="text-cyan-400/30 text-xl mr-2 mt-1 flex-shrink-0" />
                                                <p className="text-gray-200 text-sm italic line-clamp-4">{review.description || "No review available"}</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="flex items-center">
                                                <div className="relative mr-3">
                                                    {review.image ? (
                                                        <Image
                                                            src={review.image}
                                                            alt={review.user_name || "Client"}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full w-10 h-10 border border-cyan-400/20 object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="rounded-full w-10 h-10 border border-cyan-400/20 flex items-center justify-center bg-gray-700/50">
                                                            <FaGoogle className="w-4 h-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-100 text-sm">{review.user_name}</h3>
                                                    <p className="text-xs text-gray-300">{review.user_position || "Client"}</p>
                                                    <Rating
                                                        initialRating={review.rating || 0}
                                                        readonly
                                                        emptySymbol={<FaRegStar className="text-yellow-400/50 text-xs" />}
                                                        fullSymbol={<FaStar className="text-yellow-400 text-xs" />}
                                                        fractions={2}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center mt-6 gap-4"
                        >
                            <div className="bg-gray-800/50 backdrop-blur-md border border-gray-600/30 rounded-full px-5 py-1.5 inline-flex items-center">
                                <FaGoogle className="text-cyan-400 mr-2" />
                                <span className="text-gray-200 text-sm">
                                    <span className="font-medium">Google Rating:</span> {averageRating.toFixed(1)}/5 ({totalReviews} reviews)
                                </span>
                            </div>
                            <a
                                href="/contact"
                                className="group relative bg-gray-900/60 backdrop-blur-md border border-gray-600/30 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 hover:bg-gray-800/80 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-400/20 overflow-hidden"
                            >
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full group-hover:h-10 transition-all duration-300" />
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <motion.div
                                    animate={{ rotate: [0, 10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                                </motion.div>
                                <span className="relative text-sm">Share Your Feedback</span>
                            </a>
                        </motion.div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-200 text-sm">No testimonials available yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ClientReviews;