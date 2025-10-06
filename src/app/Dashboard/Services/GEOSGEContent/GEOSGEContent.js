'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiArrowRight, FiBarChart2, FiCode, FiMessageSquare, FiPlay, FiStar, FiUsers, FiTrendingUp, FiShield, FiZap, FiX, FiSearch, FiGlobe, FiTarget } from 'react-icons/fi';
import Link from "next/link";
import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import Image from "next/image";
import { motion } from 'framer-motion';
import GEOSGEFAQ from '@/app/components/Share/FAQ/GEOSGEFAQ/GEOSGEFAQ';

const GEOSGEContent = () => {
  const [activeTab, setActiveTab] = useState('geo');
  const [loading, setLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Loading complete korar jonno useEffect add koro
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // YouTube Video Modal - Improved with better sizing
  const YouTubeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-900/50">
            <h2 className="text-2xl font-semibold text-white">Case Study</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <FiX className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* YouTube Video - Properly sized */}
          <div className="relative aspect-video bg-black">
            <iframe
              src="https://www.youtube.com/embed/1ckTRFRRA1E?si=H-GisBIGUStV1x2l"
              title="GEO & SGE Optimization Case Study"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>

          {/* Video Info */}
          <div className="p-6 bg-gray-900/30">

            <p className="text-gray-300 mb-4">
              See how we helped a SaaS company achieve 56% growth in AI-generated traffic
              through strategic GEO and SGE optimization.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">

              <span>Case Study</span>
              <span>•</span>
              <span>AI SEO</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Services Data
  const services = [
    { icon: "🤖", name: "GEO Optimization", desc: "Generative Engine Optimization for AI search" },
    { icon: "🚀", name: "SGE Optimization", desc: "Search Generative Experience preparation" },
    { icon: "🎯", name: "AEO Strategy", desc: "Answer Engine Optimization for featured snippets" },
    { icon: "⚡", name: "Technical SEO", desc: "Core Web Vitals & site structure optimization" },
    { icon: "🛒", name: "E-commerce SEO", desc: "Product page & online store optimization" },
    { icon: "🌎", name: "International SEO", desc: "Multi-language & global targeting" },
    { icon: "📍", name: "Local SEO", desc: "Google Business Profile & local search" },
    { icon: "📊", name: "SEO Analytics", desc: "Advanced tracking & performance monitoring" },
    { icon: "🔗", name: "Link Building", desc: "Authority building & digital PR" },
    { icon: "📝", name: "Content Strategy", desc: "AI-optimized content creation" },
    { icon: "⚙️", name: "SEO Audit", desc: "Comprehensive technical & content analysis" },
    { icon: "💡", name: "SEO Consulting", desc: "Custom strategies & ongoing guidance" }
  ];

  // Pricing Packages
  const packages = [
    {
      name: "Essential GEO",
      price: "$499",
      original: "$750",
      popular: false,
      features: [
        "AI Search Readiness Audit",
        "Basic GEO Technical Setup",
        "Content Structure Optimization",
        "Schema Markup Implementation",
        "Monthly Performance Report",
        "Email Support"
      ]
    },
    {
      name: "Growth Accelerator",
      price: "$999",
      original: "$1,499",
      popular: true,
      features: [
        "Everything in Essential GEO",
        "Advanced SGE Optimization",
        "Competitor GEO Analysis",
        "E-E-A-T Signal Implementation",
        "Conversational Query Targeting",
        "Bi-Weekly Strategy Calls",
        "Priority Support"
      ]
    },
    {
      name: "Enterprise Dominance",
      price: "$1,999",
      original: "$2,999",
      popular: false,
      features: [
        "Everything in Growth Accelerator",
        "Full Technical GEO Implementation",
        "Multi-language GEO Optimization",
        "Custom AI Search Dashboard",
        "Weekly Performance Reviews",
        "Dedicated Account Manager",
        "24/7 Emergency Support"
      ]
    }
  ];

  // Process Steps
  const processSteps = [
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "AI Search Audit",
      description: "Comprehensive analysis of your website's SGE readiness and optimization opportunities"
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      title: "Technical GEO Setup",
      description: "Implement structured data, entity optimization, and AI-crawlable architecture"
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Content Transformation",
      description: "Optimize existing content and create new AI-search friendly content"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Performance Monitoring",
      description: "Track SGE appearances, traffic impact, and ongoing optimization"
    }
  ];

  // Benefits of GEO/SGE
  const benefits = [
    {
      icon: <FiZap className="w-8 h-8" />,
      title: "Early Adopter Advantage",
      description: "Get ahead of competitors by optimizing for AI search before it becomes mainstream"
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Future-Proof Strategy",
      description: "Protect your organic traffic from AI search disruption with proven GEO techniques"
    },
    {
      icon: <FiTrendingUp className="w-8 h-8" />,
      title: "Increased Visibility",
      description: "Appear in multiple AI-generated answers and conversational search results"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Higher Quality Traffic",
      description: "Attract visitors from AI-powered queries with higher conversion intent"
    }
  ];

  // Loading state check koro
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 border-4 border-purple-500 border-t-transparent rounded-2xl"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white mb-2">
              Preparing AI Search Optimization
            </h3>
            <p className="text-gray-400 mb-6">
              Loading GEO & SGE strategies...
            </p>
          </motion.div>

          <motion.div className="flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className="w-2 h-2 bg-purple-500 rounded-full"
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="mt-6 h-1 bg-gray-700 rounded-full mx-auto max-w-xs overflow-hidden"
          >
            <motion.div
              animate={{
                x: ["-100%", "100%"]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-1/2"
            />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-900">
      {/* YouTube Video Modal */}
      <YouTubeModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />

      {/* IMPROVED: Navigation Links Section - Better Design */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-md border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              href="/seo"
              className="group relative bg-gray-800/60 hover:bg-gray-700/80 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <span className="relative z-10">All SEO Services</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/seo/technical-seo"
              className="group relative bg-gray-800/60 hover:bg-gray-700/80 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <span className="relative z-10">Technical SEO</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/seo/ecommerce-seo"
              className="group relative bg-gray-800/60 hover:bg-gray-700/80 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10"
            >
              <span className="relative z-10">Ecommerce SEO</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="/contact"
              className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 flex items-center gap-2"
            >
              <FiTarget className="w-4 h-4" />
              <span>Get Consultation</span>
            </Link>
          </div>
        </div>
      </div>

      {/* IMPROVED: Hero Section - Enhanced Design */}
      <div className="relative py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/40 overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-full px-4 py-2 mb-8 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300 font-medium">AI Search Optimization Specialist</span>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Master Google&apos;s{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 animate-gradient">
                AI Search Revolution
              </span>
            </motion.h1>

            {/* Enhanced Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Professional GEO & SGE optimization services to future-proof your website.
              Get ahead of competitors with AI-ready SEO strategies that drive real results.
            </motion.p>

            {/* IMPROVED: Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              {/* Enhanced Primary Button */}
              <Link
                href="/contact"
                className="group relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 overflow-hidden border border-gray-700 hover:border-purple-500/50"
              >
                {/* Animated Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>

                {/* Base Background */}
                <div className="absolute inset-[1px] rounded-xl bg-gray-900 -z-10 group-hover:bg-gradient-to-br group-hover:from-gray-800 group-hover:via-purple-900 group-hover:to-gray-800 transition-all"></div>

                <span className="relative">Get Free AI Search Audit</span>
                <FiArrowRight className="relative group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" />
              </Link>

              {/* Enhanced Secondary Button */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="group relative bg-gray-900/50 backdrop-blur-md border border-gray-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition-all duration-300 hover:bg-gray-800/70 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
              >
                {/* Left Accent Bar */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full group-hover:from-purple-300 group-hover:to-purple-500 transition-all"></div>

                {/* Hover Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <FiPlay className="relative group-hover:scale-110 transition-transform duration-300" />
                <span className="relative">Watch Case Study</span>
              </button>
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
            >
              <div className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-500/20 p-3 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
                    <FiUsers className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-gray-400 text-sm">Clients Served</div>
                  </div>
                </div>
              </div>

              <div className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-xl group-hover:bg-green-500/30 transition-colors">
                    <FiTrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">40%</div>
                    <div className="text-gray-400 text-sm">Avg. Growth</div>
                  </div>
                </div>
              </div>

              <div className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500/20 p-3 rounded-xl group-hover:bg-yellow-500/30 transition-colors">
                    <FiStar className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">AI</div>
                    <div className="text-gray-400 text-sm">Search Expert</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Rest of your existing sections remain the same */}
      {/* GEO/SGE Explanation Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Understanding GEO & SGE Optimization</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* GEO Card */}
            <div
              className={`bg-gray-800 rounded-2xl p-8 border-2 cursor-pointer transition-all ${activeTab === 'geo' ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-700 hover:border-indigo-400'
                }`}
              onClick={() => setActiveTab('geo')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-indigo-500/20 p-3 rounded-xl">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-2xl font-bold text-white">GEO</h3>
                <div className={`ml-auto w-3 h-3 rounded-full ${activeTab === 'geo' ? 'bg-indigo-500' : 'bg-gray-600'}`}></div>
              </div>
              <p className="text-gray-300 mb-4">
                <strong>Generative Engine Optimization</strong> optimizes your content for AI-powered search engines and conversational interfaces.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-3">
                  <FiCheck className="text-green-400 flex-shrink-0" />
                  Optimize for conversational queries
                </li>
                <li className="flex items-center gap-3">
                  <FiCheck className="text-green-400 flex-shrink-0" />
                  Structure content for AI comprehension
                </li>
                <li className="flex items-center gap-3">
                  <FiCheck className="text-green-400 flex-shrink-0" />
                  Build entity authority signals
                </li>
              </ul>
            </div>

            {/* SGE Card */}
            <div
              className={`bg-gray-800 rounded-2xl p-8 border-2 cursor-pointer transition-all ${activeTab === 'sge' ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-purple-400'
                }`}
              onClick={() => setActiveTab('sge')}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-purple-500/20 p-3 rounded-xl">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-2xl font-bold text-white">SGE</h3>
                <div className={`ml-auto w-3 h-3 rounded-full ${activeTab === 'sge' ? 'bg-purple-500' : 'bg-gray-600'}`}></div>
              </div>
              <p className="text-gray-300 mb-4">
                <strong>Search Generative Experience</strong> is Google&apos;s AI interface that provides conversational answers instead of traditional results.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-3">
                  <FiCheck className="text-green-400 flex-shrink-0" />
                  Get featured in AI-generated summaries
                </li>
                <li className="flex items-center gap-3">
                  <FiCheck className="text-green-400 flex-shrink-0" />
                  Become a cited source for AI answers
                </li>
                <li className="flex items-center gap-3">
                  <FiCheck className="text-green-400 flex-shrink-0" />
                  Maintain visibility in AI-first search
                </li>
              </ul>
            </div>
          </div>

          {/* Rest of your existing content... */}
          {/* Services Section, Process Section, Benefits Section, Pricing Section, Audit Section */}

        </div>
      </div>

      {/* UPDATED: Services Section with Link to Main SEO */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Complete SEO Service Suite</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              From traditional SEO to cutting-edge AI optimization, we provide comprehensive solutions for all your search visibility needs.
            </p>
            <Link
              href="/seo"
              className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              View All SEO Services <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-indigo-500 transition-all group">
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-gray-400 text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our 4-Step GEO Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-indigo-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="bg-indigo-500/10 text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose GEO & SGE Optimization?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* UPDATED: Pricing Section with Contact Links */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Transparent GEO Pricing</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Choose the perfect GEO optimization package for your business needs</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-2xl p-8 border-2 ${pkg.popular ? 'border-indigo-500 relative' : 'border-gray-700'}`}
              >
                {pkg.popular && (
                  <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold absolute -top-3 left-1/2 transform -translate-x-1/2">
                    Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-4">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-white">{pkg.price}</span>
                  <span className="text-gray-400 line-through ml-2">{pkg.original}</span>
                  <span className="text-gray-400 text-sm ml-2">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                      <FiCheck className="text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${pkg.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                    }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Side - Information */}
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Ready for <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">AI Search Domination?</span>
              </h2>

              <p className="text-lg text-gray-300">
                Get a comprehensive AI search audit and discover how GEO optimization can transform your organic visibility.
              </p>

              {/* Benefits List */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-green-500/20 p-2 rounded-lg mt-1">
                    <FiCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">SGE Readiness Score</h4>
                    <p className="text-gray-400 text-sm">See how well your content performs in AI search results</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg mt-1">
                    <FiBarChart2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Competitor Analysis</h4>
                    <p className="text-gray-400 text-sm">Compare your AI search performance against competitors</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/20 p-2 rounded-lg mt-1">
                    <FiZap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Actionable Insights</h4>
                    <p className="text-gray-400 text-sm">Get specific recommendations for GEO optimization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Audit Form */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Free AI Search Audit</h3>
                <p className="text-gray-400">Get your personalized report in 24 hours</p>
              </div>
              <SEOAuditForm />
            </div>

          </div>
        </div>
      </div>

      {/* FAQ GEO SGE */}

      <GEOSGEFAQ />

      {/* Contact Section */}
      <ContactAssistance />
    </section>
  );
};

export default GEOSGEContent;