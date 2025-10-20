// components/AdsModal/AdsModal.js
'use client';
import { useState, useEffect, useCallback } from 'react';
import { X, Play } from 'lucide-react';

export default function AdsModal() {
  const [ads, setAds] = useState([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Safe current ad access
  const currentAd = ads[currentAdIndex] || {};

  // Get user views from localStorage
  const getUserAdViews = () => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('userAdViews') || '{}');
    } catch {
      return {};
    }
  };

  const setUserAdViews = (views) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userAdViews', JSON.stringify(views));
    }
  };

  const fetchAds = useCallback(async () => {
    try {
      const currentPage = window.location.pathname;
      const res = await fetch(`/api/ads?page=${currentPage}`);
      const data = await res.json();

      if (data.success && data.data && data.data.length > 0) {
        const userAdViews = getUserAdViews();
        
        // Filter ads based on user view count
        const filteredAds = data.data.filter(ad => {
          const viewCount = userAdViews[ad._id] || 0;
          const isWithinDate = new Date() >= new Date(ad.startDate) && new Date() <= new Date(ad.endDate);
          const canShow = viewCount < (ad.displayLimit || 3) && ad.isActive && isWithinDate;
          return canShow;
        });

        setAds(filteredAds);

        // AUTO SHOW - Always show if there are ads
        if (filteredAds.length > 0 && mounted && !isVisible) {
          showAd(0);
        }
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  }, [mounted, isVisible]);

  const trackImpression = async (adId) => {
    try {
      await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId })
      });
    } catch (error) {
      // Silent fail - don't break the user experience
      console.log('Impression tracking failed (non-critical)');
    }
  };

  const showAd = (index) => {
    if (ads[index]) {
      const ad = ads[index];
      setCurrentAdIndex(index);
      setTimeLeft(ad.displayTime || 10);
      setIsVisible(true);
      
      // Track impression (non-blocking)
      trackImpression(ad._id);
      
      // Update user view count
      const userAdViews = getUserAdViews();
      userAdViews[ad._id] = (userAdViews[ad._id] || 0) + 1;
      setUserAdViews(userAdViews);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeLeft(0);
  };

  const handleAdClick = async (adId, link) => {
    try {
      // Track click (non-blocking)
      fetch(`/api/admin/ads/${adId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ $inc: { clicks: 1 } })
      }).catch(err => console.log('Click tracking failed'));
      
      window.open(link, '_blank');
      handleClose();
    } catch (error) {
      console.error('Error handling click:', error);
    }
  };

  // Auto-close timer
  useEffect(() => {
    if (timeLeft > 0 && isVisible) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isVisible) {
      handleClose();
    }
  }, [timeLeft, isVisible]);

  // Auto-slide for multiple ads
  useEffect(() => {
    if (ads.length > 1 && isVisible && currentAd.displayTime) {
      const slideTimer = setTimeout(() => {
        const nextIndex = (currentAdIndex + 1) % ads.length;
        showAd(nextIndex);
      }, (currentAd.displayTime || 10) * 1000);
      
      return () => clearTimeout(slideTimer);
    }
  }, [ads, currentAdIndex, isVisible, currentAd.displayTime]);

  // Initial setup
  useEffect(() => {
    setMounted(true);
    
    // Wait for page to load then fetch ads
    const timer = setTimeout(() => {
      fetchAds();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // Re-fetch on route changes
  useEffect(() => {
    if (mounted) {
      const handleRouteChange = () => {
        setTimeout(() => fetchAds(), 500);
      };

      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, [mounted, fetchAds]);

  // Don't render if not mounted or no ads visible
  if (!mounted || !isVisible || ads.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-700/50 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-3 -right-3 z-50 group"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <X className="w-5 h-5 text-white" />
          </div>
        </button>
        
        {/* Timer Progress */}
        <div className="w-full bg-gray-800 h-1.5">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-1.5 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${(timeLeft / (currentAd.displayTime || 10)) * 100}%` }}
          />
        </div>
        
        {/* Ad Content */}
        <div className="p-1">
          <div className="relative overflow-hidden rounded-xl mb-4">
            <img
              src={currentAd.imageUrl}
              alt={currentAd.title || 'Advertisement'}
              className="w-full h-auto object-cover rounded-xl"
              style={{ maxHeight: '500px', minHeight: '400px' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x500/1f2937/8b5cf6?text=Ad+Image';
              }}
            />
          </div>
          
          {/* Button */}
          <div className="px-4 pb-6">
            <button
              onClick={() => handleAdClick(currentAd._id, currentAd.buttonLink)}
              className="group relative bg-gray-800/80 backdrop-blur-md border border-gray-600/30 text-white w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 hover:bg-gray-700/80 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-400/20 overflow-hidden"
            >
              {/* Left Border */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full group-hover:h-10 transition-all duration-300" />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Play Icon */}
              <Play className="w-5 h-5 relative group-hover:scale-110 transition-transform duration-300" />
              
              {/* Button Text */}
              <span className="relative text-lg font-bold">
                {currentAd.buttonText || 'Get Started'}
              </span>
              
              {/* Timer Badge */}
              <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                {timeLeft}s
              </div>
            </button>
          </div>
        </div>
        
        {/* Navigation Dots */}
        {ads.length > 1 && (
          <div className="flex justify-center space-x-3 pb-6">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => showAd(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentAdIndex 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 scale-125' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}