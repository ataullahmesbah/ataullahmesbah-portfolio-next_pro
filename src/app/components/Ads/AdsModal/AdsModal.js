'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdsModal() {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAutoSlide, setIsAutoSlide] = useState(true);
  const [hasViewed, setHasViewed] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef(null);
  const autoSlideRef = useRef(null);

  // Check if user has viewed the page
  useEffect(() => {
    const viewedAds = JSON.parse(localStorage.getItem('adViews') || '{}');
    setHasViewed(!!viewedAds[pathname]);
  }, [pathname]);

  // Fetch ads with PRIORITY sorting
  useEffect(() => {
    if (!hasViewed) {
      fetchAds();
    }
  }, [pathname, hasViewed]);

  const fetchAds = async () => {
    try {
      const res = await fetch(`/api/ads?page=${pathname}`);
      const { data } = await res.json();

      if (data && data.length > 0) {
        // Priority-based sorting: Higher priority first, then by creation date
        const activeAds = data
          .filter(ad => {
            return ad.isActive;
          })
          .sort((a, b) => {
            // First sort by priority (descending)
            if (b.priority !== a.priority) {
              return b.priority - a.priority;
            }
            // If same priority, sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

        console.log('Sorted ads by priority:', activeAds.map(ad => ({
          id: ad._id,
          priority: ad.priority,
          buttonText: ad.buttonText
        })));

        if (activeAds.length > 0) {
          setAds(activeAds);
          setIsOpen(true);
          setTimeLeft(activeAds[0].displaySeconds);
          trackImpression(activeAds[0]._id);

          const viewedAds = JSON.parse(localStorage.getItem('adViews') || '{}');
          viewedAds[pathname] = true;
          localStorage.setItem('adViews', JSON.stringify(viewedAds));
        }
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
      autoSlideRef.current = null;
    }
  }, []);

  const startTimer = useCallback((seconds) => {
    clearAllTimers();
    setTimeLeft(seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (isAutoSlide && ads.length > 1) {
            nextSlide();
          } else {
            closeModal();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [ads, isAutoSlide, clearAllTimers]);

  const closeModal = useCallback(() => {
    clearAllTimers();
    setIsOpen(false);
    setAds([]);
    setCurrentIndex(0);
  }, [clearAllTimers]);

  const nextSlide = useCallback(() => {
    if (ads.length === 0) return;

    // Priority-based next slide logic
    let nextIndex;
    if (currentIndex === ads.length - 1) {
      // If last ad, check if we should restart from highest priority
      const highestPriority = Math.max(...ads.map(ad => ad.priority));
      const highestPriorityAds = ads.filter(ad => ad.priority === highestPriority);
      nextIndex = ads.indexOf(highestPriorityAds[0]);
    } else {
      nextIndex = (currentIndex + 1) % ads.length;
    }

    setCurrentIndex(nextIndex);
    setTimeLeft(ads[nextIndex].displaySeconds);
    trackImpression(ads[nextIndex]._id);
    startTimer(ads[nextIndex].displaySeconds);
  }, [ads, currentIndex, startTimer]);

  const prevSlide = useCallback(() => {
    if (ads.length === 0) return;

    let prevIndex;
    if (currentIndex === 0) {
      // If first ad, go to last highest priority ad
      const highestPriority = Math.max(...ads.map(ad => ad.priority));
      const highestPriorityAds = ads.filter(ad => ad.priority === highestPriority);
      prevIndex = ads.indexOf(highestPriorityAds[highestPriorityAds.length - 1]);
    } else {
      prevIndex = (currentIndex - 1 + ads.length) % ads.length;
    }

    setCurrentIndex(prevIndex);
    setTimeLeft(ads[prevIndex].displaySeconds);
    trackImpression(ads[prevIndex]._id);
    startTimer(ads[prevIndex].displaySeconds);
  }, [ads, currentIndex, startTimer]);

  const trackImpression = async (adId) => {
    try {
      await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, type: 'impression' }),
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async (adId) => {
    try {
      await fetch('/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, type: 'click' }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  // Auto slide for multiple ads
  useEffect(() => {
    if (ads.length > 1 && isAutoSlide && isOpen) {
      autoSlideRef.current = setInterval(nextSlide, ads[currentIndex].displaySeconds * 1000);
    }
    return () => {
      if (autoSlideRef.current) {
        clearInterval(autoSlideRef.current);
      }
    };
  }, [ads, currentIndex, isAutoSlide, isOpen, nextSlide]);

  // Start timer when ad changes
  useEffect(() => {
    if (isOpen && ads.length > 0) {
      startTimer(ads[currentIndex].displaySeconds);
    }
  }, [currentIndex, isOpen, ads, startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  if (!isOpen || ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-3 md:p-4"
        >
          {/* Main Container - Fully Responsive with Scroll */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 
                      w-[95vw] max-w-[400px]
                      h-[95vh] max-h-[800px]
                      flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-slate-900 to-purple-900">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm font-semibold text-white">Sponsored</span>
                {/* Priority Badge */}
                <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
                  P{currentAd.priority}
                </span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {ads.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsAutoSlide(!isAutoSlide)}
                    className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
                    aria-label={isAutoSlide ? 'Pause auto slide' : 'Play auto slide'}
                  >
                    {isAutoSlide ? (
                      <Pause size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
                    ) : (
                      <Play size={12} className="sm:w-3.5 sm:h-3.5 text-white" />
                    )}
                  </motion.button>
                )}

                {/* Timer */}
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-black/30 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs sm:text-sm font-medium text-white">{timeLeft}s</span>
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  className="p-1.5 sm:p-2 bg-white/10 hover:bg-red-500/90 rounded-full transition-all duration-200 group"
                  aria-label="Close ad"
                >
                  <X size={14} className="sm:w-4 sm:h-4 text-white group-hover:scale-110 transition-transform" />
                </motion.button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-shrink-0 w-full h-1 sm:h-1.5 bg-gray-100">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-700 rounded-r-full"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: currentAd.displaySeconds, ease: 'linear' }}
                key={currentIndex}
              />
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

              {/* Ad Image Container - Scrollable if needed */}
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 
                            p-4 sm:p-6 md:p-8 overflow-auto">
                <div className="flex items-center justify-center w-full h-full">
                  <motion.img
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    src={currentAd.imageUrl}
                    alt="Advertisement"
                    className="w-auto h-auto max-w-full max-h-full object-contain drop-shadow-lg rounded-lg"
                    style={{
                      // Maintain 300x500 aspect ratio but responsive
                      maxWidth: 'min(100%, 400px)',
                      maxHeight: 'min(100%, 600px)',
                      width: 'auto',
                      height: 'auto'
                    }}
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="300" height="500" viewBox="0 0 300 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="500" fill="#F8FAFC"/>
                          <path d="M125 225H175V275H125V225ZM150 175C163.807 175 175 186.193 175 200C175 213.807 163.807 225 150 225C136.193 225 125 213.807 125 200C125 186.193 136.193 175 150 175Z" fill="#94A3B8"/>
                          <path d="M200 325H100C94.477 325 90 320.523 90 315V185C90 179.477 94.477 175 100 175H200C205.523 175 210 179.477 210 185V315C210 320.523 205.523 325 200 325ZM100 185V315H200V185H100Z" fill="#94A3B8"/>
                        </svg>
                      `)}`;
                    }}
                  />
                </div>

                {/* Navigation */}
                {ads.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1, x: -2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevSlide}
                      className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-slate-700 rounded-full p-2 sm:p-3 shadow-xl border border-gray-200 transition-all duration-200 backdrop-blur-sm z-10"
                      aria-label="Previous ad"
                    >
                      <ChevronLeft size={16} className="sm:w-5 sm:h-5 stroke-2" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, x: 2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextSlide}
                      className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-slate-700 rounded-full p-2 sm:p-3 shadow-xl border border-gray-200 transition-all duration-200 backdrop-blur-sm z-10"
                      aria-label="Next ad"
                    >
                      <ChevronRight size={16} className="sm:w-5 sm:h-5 stroke-2" />
                    </motion.button>

                    {/* Dot Indicators */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1.5 sm:py-2 z-10">
                      {ads.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => {
                            setCurrentIndex(index);
                            setTimeLeft(ads[index].displaySeconds);
                            trackImpression(ads[index]._id);
                          }}
                          className={`rounded-full transition-all duration-300 ${index === currentIndex
                              ? 'bg-white shadow-lg'
                              : 'bg-white/50 hover:bg-white/80'
                            }`}
                          style={{
                            width: index === currentIndex ? '10px' : '6px',
                            height: index === currentIndex ? '10px' : '6px'
                          }}
                          aria-label={`Go to ad ${index + 1}`}
                          whileHover={{ scale: 1.4 }}
                          whileTap={{ scale: 0.8 }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Call to Action Button - Always visible at bottom */}
              <div className="flex-shrink-0 p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-gray-100 border-t border-gray-200/50">
                <motion.a
                  href={currentAd.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick(currentAd._id)}
                  className="group relative inline-flex items-center justify-center w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 hover:from-slate-800 hover:via-purple-800 hover:to-indigo-800 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <span className="relative z-10 text-sm sm:text-base tracking-wide drop-shadow-sm text-center">
                    {currentAd.buttonText}
                  </span>

                  {/* Arrow icon */}
                  <motion.div
                    className="ml-2 relative z-10"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ChevronRight size={16} className="sm:w-4 sm:h-4 stroke-2" />
                  </motion.div>
                </motion.a>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-slate-900 to-purple-900 border-t border-white/10">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-white/70">Advertisement</span>
                {ads.length > 1 && (
                  <span className="text-white/60 font-medium">
                    {currentIndex + 1} / {ads.length}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}