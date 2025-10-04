'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiArrowRight, FiBarChart2, FiCode, FiMessageSquare, FiPlay, FiStar, FiUsers, FiTrendingUp, FiShield, FiZap } from 'react-icons/fi';
import Link from "next/link";
import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import Image from "next/image";
import { motion } from 'framer-motion';

const GEOSGEContent = () => {
  const [activeTab, setActiveTab] = useState('geo');
  const [loading, setLoading] = useState(true);

  // Loading complete korar jonno useEffect add koro
  useEffect(() => {
    // Simulate loading completion
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // 2 seconds loading

    return () => clearTimeout(timer);
  }, []);


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
          {/* Animated Logo/Icon */}
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

          {/* Loading Text */}
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

          {/* Animated Dots */}
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

          {/* Progress Bar */}
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
      {/* Hero Section - Modern Design */}
      <div className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">AI Search Optimization Specialist</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Master Google's{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                AI Search Revolution
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional GEO & SGE optimization services to future-proof your website.
              Get ahead of competitors with AI-ready SEO strategies that drive real results.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/contact"
                className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/25"
              >
                <span>Get Free AI Search Audit</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button className="group border border-gray-600 hover:border-indigo-400 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold flex items-center gap-3 transition-all duration-300">
                <FiPlay className="group-hover:scale-110 transition-transform" />
                <span>Watch Case Study</span>
              </button>
            </div>

            {/* Trust Indicators - Modern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-500/20 p-3 rounded-xl">
                    <FiUsers className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-gray-400 text-sm">Clients Served</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-3 rounded-xl">
                    <FiTrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">40%</div>
                    <div className="text-gray-400 text-sm">Avg. Growth</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-500/20 p-3 rounded-xl">
                    <FiStar className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">AI</div>
                    <div className="text-gray-400 text-sm">Specialist</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-12 flex justify-center">
              <div className="animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
                  <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* NEW: Improved GEO/SGE Explanation Section */}
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
                <strong>Search Generative Experience</strong> is Google's AI interface that provides conversational answers instead of traditional results.
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

          {/* Detailed Explanation */}
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">
              {activeTab === 'geo' ? 'Why GEO Matters for Your Business' : 'How SGE is Changing Search Forever'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Key Benefits</h4>
                <ul className="space-y-2 text-gray-300">
                  {activeTab === 'geo' ? (
                    <>
                      <li>• Future-proof against AI search disruption</li>
                      <li>• Capture traffic from conversational queries</li>
                      <li>• Build authority with AI systems</li>
                      <li>• Stay ahead of competitors</li>
                    </>
                  ) : (
                    <>
                      <li>• Appear in AI-generated answer boxes</li>
                      <li>• Gain visibility in conversational search</li>
                      <li>• Drive qualified AI-powered traffic</li>
                      <li>• Establish thought leadership</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Industry Impact</h4>
                <p className="text-gray-300">
                  {activeTab === 'geo'
                    ? "70% of searches will be AI-generated by 2025. GEO ensures your content remains visible and authoritative in this new landscape."
                    : "SGE already impacts 84% of search queries. Early optimization provides significant competitive advantage in AI search results."
                  }
                </p>
              </div>
            </div>
          </div>
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

      {/* NEW: Benefits Section */}
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

      {/* Audit Section - Alternative Design */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* Left Side - Visual Benefits */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready for <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">AI Search Domination?</span>
              </h2>

              <div className="space-y-6">
                {/* Progress Bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Traditional SEO Impact</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>AI Search (GEO/SGE) Impact</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Key Points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl mb-2">🚀</div>
                    <h4 className="font-semibold text-white text-sm">Early Advantage</h4>
                    <p className="text-gray-400 text-xs">Beat competitors to AI search</p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl mb-2">🛡️</div>
                    <h4 className="font-semibold text-white text-sm">Future-Proof</h4>
                    <p className="text-gray-400 text-xs">Protect against AI disruption</p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl mb-2">📈</div>
                    <h4 className="font-semibold text-white text-sm">3x Visibility</h4>
                    <p className="text-gray-400 text-xs">In AI-generated results</p>
                  </div>

                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl mb-2">💡</div>
                    <h4 className="font-semibold text-white text-sm">Expert Insights</h4>
                    <p className="text-gray-400 text-xs">Proven GEO strategies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Audit Form */}
            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Free Report
                </div>

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">AI Search Audit</h3>
                  <p className="text-gray-400">Discover your GEO optimization potential</p>
                </div>

                <SEOAuditForm />

                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">No credit card required • 100% confidential</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact Section */}
      <ContactAssistance />
    </section>
  );
};

export default GEOSGEContent;