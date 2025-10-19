// components/AdsModal/AdsModal.js

'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaShare, FaCopy, FaClock, FaCalendarAlt } from 'react-icons/fa';

const AdsModal = () => {
    const [ads, setAds] = useState([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [showCountdown, setShowCountdown] = useState(true);
    const [countdown, setCountdown] = useState(0);

    // Fetch active ads
    useEffect(() => {
        const fetchAds = async () => {
            try {
                const res = await fetch('/api/ads/active');
                const data = await res.json();
                if (data.length > 0) {
                    setAds(data);
                    setIsVisible(true);
                    setCurrentAdIndex(0);
                }
            } catch (error) {
                console.error('Failed to fetch ads:', error);
            }
        };

        fetchAds();
    }, []);

    // Handle auto-close countdown
    useEffect(() => {
        if (isVisible && ads.length > 0) {
            const currentAd = ads[currentAdIndex];
            setCountdown(currentAd.autoCloseDelay);

            const timer = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        handleClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isVisible, currentAdIndex, ads]);

    const handleClose = () => {
        setIsVisible(false);
        // Store in localStorage to prevent showing again today
        const today = new Date().toDateString();
        localStorage.setItem('lastAdShown', today);
    };

    const handleNext = () => {
        setCurrentAdIndex(prev => (prev + 1) % ads.length);
        setShowCountdown(true);
    };

    const handlePrev = () => {
        setCurrentAdIndex(prev => (prev - 1 + ads.length) % ads.length);
        setShowCountdown(true);
    };

    const handleCouponCopy = (couponCode) => {
        navigator.clipboard.writeText(couponCode);
        // You can add a toast notification here
        alert(`Coupon code ${couponCode} copied to clipboard!`);
    };

    const handleAdClick = async (adId, type = 'click') => {
        try {
            await fetch(`/api/ads/${adId}/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });
        } catch (error) {
            console.error('Tracking error:', error);
        }
    };

    if (!isVisible || ads.length === 0) return null;

    const currentAd = ads[currentAdIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">

                {/* Header with Countdown and Close */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaClock className="text-purple-500" />
                        {showCountdown && (
                            <span>Auto closes in {countdown}s</span>
                        )}
                    </div>

                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <FaTimes className="text-gray-500 hover:text-gray-700 text-lg" />
                    </button>
                </div>

                {/* Ad Content */}
                <div className="p-6">
                    {/* Image */}
                    {currentAd.image && (
                        <div className="mb-4 rounded-xl overflow-hidden">
                            <img
                                src={currentAd.image}
                                alt={currentAd.title || 'Promotional Ad'}
                                className="w-full h-48 object-cover"
                                onClick={() => handleAdClick(currentAd._id, 'impression')}
                            />
                        </div>
                    )}

                    {/* Title */}
                    {currentAd.title && (
                        <h2
                            className="text-2xl font-bold text-gray-900 mb-3 text-center"
                            style={{ color: currentAd.textColor }}
                        >
                            {currentAd.title}
                        </h2>
                    )}

                    {/* Description */}
                    {currentAd.description && (
                        <p
                            className="text-gray-600 mb-4 text-center leading-relaxed"
                            style={{ color: currentAd.textColor }}
                        >
                            {currentAd.description}
                        </p>
                    )}

                    {/* Coupon Code */}
                    {currentAd.couponCode && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-center">
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-lg font-semibold text-yellow-800">
                                    Use Code: {currentAd.couponCode}
                                </span>
                                <button
                                    onClick={() => handleCouponCopy(currentAd.couponCode)}
                                    className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors duration-200"
                                >
                                    <FaCopy className="text-white text-sm" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Date Range */}
                    {(currentAd.startDate || currentAd.endDate) && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                            <FaCalendarAlt />
                            <span>
                                {currentAd.startDate && new Date(currentAd.startDate).toLocaleDateString()}
                                {currentAd.endDate && ` - ${new Date(currentAd.endDate).toLocaleDateString()}`}
                            </span>
                        </div>
                    )}

                    {/* Action Button */}
                    {currentAd.buttonLink && (
                        <div className="text-center">
                            <a
                                href={currentAd.buttonLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleAdClick(currentAd._id, 'click')}
                                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                                style={{ backgroundColor: currentAd.buttonColor }}
                            >
                                {currentAd.buttonText || 'Shop Now'}
                                <FaShare className="text-sm" />
                            </a>
                        </div>
                    )}
                </div>

                {/* Navigation for multiple ads */}
                {ads.length > 1 && (
                    <div className="flex justify-between items-center p-4 border-t border-gray-200">
                        <button
                            onClick={handlePrev}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                            <FaChevronLeft />
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {ads.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentAdIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentAdIndex
                                            ? 'bg-purple-500'
                                            : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        >
                            Next
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdsModal;