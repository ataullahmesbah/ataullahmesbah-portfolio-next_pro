'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import SEO from '/public/images/SEO.webp';
import SEO1 from '/public/images/seo/analytics.jpg';

const SEOPortfolio = () => {
  const [activeTab, setActiveTab] = useState('seo');

  const tabsData = {
    seo: {
      title: "SEO",
      icon: "📈",
      description: "Complete search engine optimization strategy",
      metrics: "50%+ Average Ranking Improvement",
      features: ["Keyword Research & Analysis", "On-Page Optimization", "Technical SEO Audit", "Link Building Strategy"],
      chartData: [30, 45, 60, 55, 75, 80, 90],
      chartLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
      chartTitle: "Ranking Improvement Over Time"
    },
    geo: {
      title: "GEO",
      icon: "🌍",
      description: "Local search optimization for geographic targeting",
      metrics: "3x Increase in Local Visibility",
      features: ["Google Business Optimization", "Local Citation Building", "Geo-Targeted Content", "Local Review Management"],
      chartData: [25, 40, 65, 70, 75, 85, 95],
      chartLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
      chartTitle: "Local Visibility Growth"
    },
    sge: {
      title: "SGE",
      icon: "🤖",
      description: "AI-powered search generative experience optimization",
      metrics: "2.5x More Featured Snippets",
      features: ["AI Content Optimization", "SGE Schema Markup", "Voice Search Ready", "Interactive Content"],
      chartData: [20, 35, 50, 65, 80, 85, 95],
      chartLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
      chartTitle: "SGE Performance Progress"
    },
    aeo: {
      title: "AEO",
      icon: "🎯",
      description: "Answer engine optimization for direct responses",
      metrics: "60% Increase in Direct Answers",
      features: ["Q&A Page Optimization", "Structured Data Implementation", "Knowledge Graph Optimization", "Featured Answer Strategy"],
      chartData: [35, 50, 45, 60, 75, 85, 90],
      chartLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
      chartTitle: "Direct Answer Performance"
    }
  };

  // Function to generate SVG path for line chart
  const generateLinePath = (data, width, height) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - minValue) / range) * height * 0.8 - height * 0.1;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const LineChart = ({ data, labels, width = 300, height = 160 }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);

    return (
      <div className="relative">
        <svg width={width} height={height} className="w-full">
          {/* Grid lines */}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <g key={percent}>
              <line
                x1="0"
                y1={height - (percent / 100) * height * 0.8 - height * 0.1}
                x2={width}
                y2={height - (percent / 100) * height * 0.8 - height * 0.1}
                stroke="#374151"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
              <text
                x="0"
                y={height - (percent / 100) * height * 0.8 - height * 0.1 - 5}
                fill="#9CA3AF"
                fontSize="10"
              >
                {percent}%
              </text>
            </g>
          ))}

          {/* Animated line */}
          <motion.path
            d={generateLinePath(data, width, height)}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Animated dots */}
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - minValue) / (maxValue - minValue)) * height * 0.8 - height * 0.1;

            return (
              <motion.g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#8B5CF6"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                />
                <motion.text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="#E5E7EB"
                  fontSize="10"
                  fontWeight="500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                >
                  {value}%
                </motion.text>
              </motion.g>
            );
          })}

          {/* X-axis labels */}
          {labels.map((label, index) => {
            const x = (index / (data.length - 1)) * width;
            return (
              <text
                key={index}
                x={x}
                y={height - 5}
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="10"
              >
                {label.split(' ')[1]}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="text-purple-400 font-semibold text-sm uppercase tracking-widest">
            Search Optimization
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Comprehensive <span className="text-purple-400">SEO</span> Solutions
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto mt-3 rounded-full" />
        </motion.div>

        {/* Improved Compact Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-1 mb-6 max-w-2xl mx-auto">
            {Object.entries(tabsData).map(([key, tab]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 flex items-center gap-1 min-w-[70px] justify-center ${activeTab === key
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                <span className="text-sm">{tab.icon}</span>
                <span>{tab.title}</span>
              </button>
            ))}
          </div>

          {/* Enhanced Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-gray-700"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Side - Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                    {tabsData[activeTab].icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{tabsData[activeTab].title}</h3>
                    <p className="text-purple-400 text-sm">{tabsData[activeTab].description}</p>
                  </div>
                </div>

                <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-600">
                  <p className="text-white font-semibold text-sm">{tabsData[activeTab].metrics}</p>
                </div>

                <ul className="space-y-2">
                  {tabsData[activeTab].features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center text-sm text-gray-300 bg-gray-900/30 p-2 rounded-lg"
                    >
                      <svg className="w-4 h-4 text-purple-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Right Side - Line Chart */}
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-white font-semibold text-sm mb-4 text-center">
                  {tabsData[activeTab].chartTitle}
                </h4>
                <div className="flex justify-center">
                  <LineChart
                    data={tabsData[activeTab].chartData}
                    labels={tabsData[activeTab].chartLabels}
                  />
                </div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                  <span className="text-xs text-gray-400">Week 1</span>
                  <span className="text-xs text-gray-400">Week 7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Full Width Portfolio Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <div className="relative rounded-xl overflow-hidden border border-gray-700 group h-64 sm:h-80">
            <Image
              src={SEO}
              alt="SEO Analytics Dashboard"
              placeholder="blur"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end p-6">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  Advanced Analytics
                </span>
                <p className="text-white font-semibold text-lg">Comprehensive SEO Dashboard</p>
                <p className="text-gray-300 text-sm mt-1">Real-time performance tracking and insights</p>
              </div>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-gray-700 group h-64 sm:h-80">
            <Image
              src={SEO1}
              alt="SEO Performance Tracking"
              placeholder="blur"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end p-6">
              <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-blue-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  Performance Metrics
                </span>
                <p className="text-white font-semibold text-lg">Growth Analytics</p>
                <p className="text-gray-300 text-sm mt-1">Track rankings, traffic, and conversions</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Improved Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 text-center group hover:border-purple-500/50 transition-all duration-300">
            <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:scale-110 transition-transform duration-300">50%+</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Ranking Boost</div>
            <div className="text-xs text-gray-500 mt-1">Average improvement</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 text-center group hover:border-purple-500/50 transition-all duration-300">
            <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:scale-110 transition-transform duration-300">2x</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Traffic Growth</div>
            <div className="text-xs text-gray-500 mt-1">Organic visitors</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 text-center group hover:border-purple-500/50 transition-all duration-300">
            <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:scale-110 transition-transform duration-300">100+</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Keywords</div>
            <div className="text-xs text-gray-500 mt-1">Top rankings</div>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 text-center group hover:border-purple-500/50 transition-all duration-300">
            <div className="text-2xl font-bold text-purple-400 mb-1 group-hover:scale-110 transition-transform duration-300">24/7</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Monitoring</div>
            <div className="text-xs text-gray-500 mt-1">Real-time tracking</div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Start Your SEO Journey
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SEOPortfolio;