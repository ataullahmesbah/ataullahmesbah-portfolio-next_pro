'use client';

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ContentPortfolio = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Utility function to convert YouTube duration format (PT5M15S → 5:15)
  const convertDuration = (duration) => {
    if (!duration) return '0:00';

    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    const seconds = match[3] ? parseInt(match[3]) : 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Utility function to format date (2025-03-05 → Mar 5, 2025)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };


  const featuredVideos = [
    {
      id: "vNYLJs4G56I",
      title: "Exploring Kashmir",
      description: "A breathtaking journey through the scenic beauty of Kashmir, capturing its culture and landscapes.",
      thumbnail: "https://i.ytimg.com/vi/vNYLJs4G56I/hqdefault.jpg",
      duration: "PT10M30S",
      uploadDate: "2025-01-15",
    },

    {
      id: "SL0az0RBXCA",
      title: "জীবনের টার্নিং পয়েন্ট!",
      description: "জীবনের টার্নিং পয়েন্ট! | বিয়ে, বাচ্চা, কোর্স আর জব পাওয়া | Real Life Success",
      thumbnail: "https://i.ytimg.com/vi/SL0az0RBXCA/hqdefault.jpg",
      duration: "PT5M15S",
      uploadDate: "2025-02-10",
    },
    {
      id: "kz3fnPLwZ30",
      title: "PAKISTAN 🇵🇰 Islamabad",
      description: "PAKISTAN 🇵🇰 Islamabad to Nanga Parbat Base Camp | 3 Week Adventure - Ep1",
      thumbnail: "https://i.ytimg.com/vi/kz3fnPLwZ30/hqdefault.jpg",
      duration: "PT8M45S",
      uploadDate: "2025-03-05",
    },
  ];

  const openVideo = (video) => setSelectedVideo(video);
  const closeVideo = () => setSelectedVideo(null);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
    }),
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(147, 51, 234, 0.4)" },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content - Text Section */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="text-purple-400 font-semibold text-sm uppercase tracking-widest">
                Content Creation
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mt-4 leading-tight">
                My Creative <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">Journey</span>
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mt-6 mb-8" />
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Crafting compelling stories through video and writing that inspire audiences and spark meaningful conversations.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Each piece reflects my passion for authentic storytelling and creative expression, designed to captivate and engage.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <Link
                href="/content-creation"
                className="relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-10 transform -skew-x-12 group-hover:skew-x-12 transition-transform duration-1000" />
                <span className="relative font-semibold text-lg">
                  Collaborate With Me
                </span>
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <p className="text-gray-300 mt-4">
                Discover more on my{" "}
                <Link href="/web-development" className="text-purple-400 hover:underline">
                  web development services
                </Link>.
              </p>
            </motion.div>
          </div>

          {/* Right Content - Video Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {featuredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                className="group relative rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 hover:shadow-purple-600/40 transition-all duration-300 cursor-pointer bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-purple-500/30"
                onClick={() => openVideo(video)}
              >
                {/* Thumbnail Container */}
                <div className="aspect-video bg-gray-800 relative">
                  <Image
                    src={video.thumbnail}
                    alt={`Thumbnail for ${video.title}`}
                    width={400}
                    height={225}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                    unoptimized
                    onError={(e) => {
                      e.target.src = "/fallback-thumbnail.jpg";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/10 to-transparent" />

                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg shadow-purple-600/30">
                      <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  {/* <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {convertDuration(video.duration)}
                  </div> */}
                </div>

                {/* Video Info - Simplified without date and views */}
                <div className="p-4">
                  <h3 className="text-white  text-base line-clamp-2">
                    {video.title}
                  </h3>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-xl pointer-events-none transition-all duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={closeVideo}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative w-full max-w-4xl bg-gray-900 rounded-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeVideo}
                  className="absolute top-4 right-4 text-white hover:text-purple-400 z-10"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
                <div className="relative w-full" style={{ paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white">{selectedVideo.title}</h3>
                  <p className="text-gray-300 mt-2">{selectedVideo.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContentPortfolio;