'use client';

import { useState } from 'react';
import { FiCheck, FiArrowRight, FiBarChart2, FiCode, FiMessageSquare, FiPlay } from 'react-icons/fi';
import Link from "next/link";
import ContactAssistance from "@/app/components/Share/ConatctAssistance/ContactAssistance";
import SEOAuditForm from "@/app/components/Share/SEOAuditForm/SEOAuditForm";
import Image from "next/image";

const GEOSGEContent = () => {
  const [activeTab, setActiveTab] = useState('geo');

  const features = [
    "AI-search optimized content structure",
    "E-E-A-T signal implementation",
    "Conversational query optimization",
    "Schema markup for AI understanding",
    "Content authority building",
    "Multi-format content creation",
  ];

  const processSteps = [
    {
      icon: <FiBarChart2 className="w-6 h-6" />,
      title: "AI Search Audit",
      description: "Analyze website readiness for SGE and identify optimization gaps.",
    },
    {
      icon: <FiCode className="w-6 h-6" />,
      title: "Technical GEO Setup",
      description: "Implement structured data and AI-crawlable architecture.",
    },
    {
      icon: <FiMessageSquare className="w-6 h-6" />,
      title: "Content Transformation",
      description: "Optimize content for conversational AI and generative search.",
    },
    {
      icon: <FiPlay className="w-6 h-6" />,
      title: "Ongoing Optimization",
      description: "Monitor and adapt to AI search algorithm updates.",
    },
  ];

  return (
    <section className="min-h-screen bg-gray-900">
      {/* Hero Section (Inspired by SEO Page) */}
      <div className="py-12 shadow-md border-b border-b-gray-700 bg-gradient-to-r from-gray-900 to-indigo-900/20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-8">
          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-100">
              GEO & SGE Optimization: AI-Powered Search Success
            </h1>
            <p className="text-base sm:text-lg text-gray-200 max-w-3xl mx-auto">
              Future-proof your website with professional GEO and SGE optimization. Boost visibility in AI-driven search and drive global traffic. <Link href="/contact" className="text-indigo-400">Get a free audit</Link> today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="relative px-7 py-4 bg-black rounded-lg font-semibold text-white flex items-center gap-2 group"
                aria-label="Get AI Search Audit"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <Link href="/contact" className="relative">Get AI Search Audit <FiArrowRight /></Link>
              </button>
              <button className="border border-gray-600 hover:border-indigo-500 text-gray-300 hover:text-white px-7 py-4 rounded-lg font-semibold flex items-center gap-2 transition-all">
                <FiPlay /> Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GEO vs SGE Tabs */}
      <div className="py-16 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">What is GEO & SGE?</h2>
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('geo')}
              className={`px-4 py-2 font-semibold ${activeTab === 'geo' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
            >
              GEO
            </button>
            <button
              onClick={() => setActiveTab('sge')}
              className={`px-4 py-2 font-semibold ${activeTab === 'sge' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400'}`}
            >
              SGE
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {activeTab === 'geo' && (
              <div className="space-y-4">
                <p className="text-gray-200 text-lg">
                  <strong>Generative Engine Optimization (GEO)</strong> prepares your content for AI-driven search engines, ensuring visibility in conversational and interactive results.
                </p>
                <ul className="space-y-2 text-gray-200">
                  {features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <FiCheck className="text-green-400" /> {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-200">
                  Learn more in our <Link href="/blog/geo-guide" className="text-indigo-400">GEO Guide</Link> or check <a href="https://www.searchenginejournal.com" className="text-indigo-400">Search Engine Journal</a>.
                </p>
              </div>
            )}
            {activeTab === 'sge' && (
              <div className="space-y-4">
                <p className="text-gray-200 text-lg">
                  <strong>Search Generative Experience (SGE)</strong> is Google’s AI-powered search delivering conversational answers and summaries.
                </p>
                <ul className="space-y-2 text-gray-200">
                  {features.slice(3).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <FiCheck className="text-green-400" /> {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-200">
                  See Google’s <a href="https://developers.google.com/search/docs" className="text-indigo-400">SEO Guidelines</a> for best practices.
                </p>
              </div>
            )}
            <div className="flex justify-center">
              <Image
                src="https://i.ibb.co/d5FW2dK/image.png"
                alt="GEO and SGE Optimization for AI Search"
                width={500}
                height={500}
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-16 px-2 sm:px-4 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">Our GEO & SGE Process</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-indigo-500 transition-all">
                <div className="bg-indigo-500/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study & Audit Form */}
      <div className="py-16 px-2 sm:px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-100 mb-6">Case Study: 40% Traffic Boost</h2>
              <p className="text-gray-200 text-lg mb-4">
                For a global e-commerce client, we implemented GEO schema and SGE-optimized content, increasing organic traffic by 40% in 4 months.
              </p>
              <table className="table-auto w-full text-gray-200 mb-4">
                <thead>
                  <tr><th>Metric</th><th>Result</th></tr>
                </thead>
                <tbody>
                  <tr><td>Traffic Growth</td><td>40% in 4 months</td></tr>
                  <tr><td>SGE Features</td><td>25% more snippets</td></tr>
                </tbody>
              </table>
              <p className="text-gray-200">
                Read more in our <Link href="/case-studies" className="text-indigo-400">Case Studies</Link>.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-2xl font-bold text-gray-100 mb-4">Free GEO Audit</h3>
              <SEOAuditForm />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-2 sm:px-4 lg:px-8 bg-gradient-to-r from-gray-900 to-indigo-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6">
            Ready for AI Search in 2025?
          </h2>
          <p className="text-base sm:text-lg text-gray-200 mb-8">
            Stay ahead with GEO and SGE optimization. Start today with a free audit or explore our <Link href="/services" className="text-indigo-400">services</Link>.
          </p>
          <button
            className="relative px-7 py-4 bg-black rounded-lg font-semibold text-white flex items-center gap-2 mx-auto group"
            aria-label="Start GEO Optimization"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <Link href="/contact" className="relative">Start GEO Optimization <FiArrowRight /></Link>
          </button>
        </div>
      </div>

      {/* Contact Section */}
      <ContactAssistance />
    </section>
  );
};

export default GEOSGEContent;