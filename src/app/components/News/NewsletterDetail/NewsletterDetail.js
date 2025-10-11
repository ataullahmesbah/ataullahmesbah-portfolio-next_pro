"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiCalendar,
    FiEye,
    FiArrowLeft,
    FiShare2,
    FiFacebook,
    FiTwitter,
    FiLinkedin,
    FiLink,
    FiUser
} from 'react-icons/fi';
import { FaMedium } from 'react-icons/fa';
import { format } from 'date-fns';
import UserLink from '../../Profile/ProfileLink/UserLink';

const NewsletterDetail = ({ newsletter }) => {
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!newsletter) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Newsletter Not Found</h1>
                    <Link href="/newsletter" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Back to Newsletters
                    </Link>
                </div>
            </div>
        );
    }

    // Social Share Functions
    const shareOnFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=600,height=400');
        setShowShareOptions(false);
    };

    const shareOnTwitter = () => {
        const text = `Check out this newsletter: ${newsletter.title}`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=600,height=400');
        setShowShareOptions(false);
    };

    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(url, '_blank', 'width=600,height=400');
        setShowShareOptions(false);
    };

    const shareOnMedium = () => {
        copyToClipboard();
        setShowShareOptions(false);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    // Safely handle content
    const safeContent = newsletter.content || [];
    const publishedDate = newsletter.publishedDate || newsletter.createdAt;
    const formattedDate = publishedDate ? format(new Date(publishedDate), 'MMMM dd, yyyy') : 'Unknown date';

    return (
        <article className="min-h-screen bg-gray-900 text-white border-b border-b-gray-800 py-10">
            {/* Simple Navigation */}
            <div className="bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/newsletter"
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                        >
                            <FiArrowLeft className="w-4 h-4" />
                            Back to Newsletters
                        </Link>

                        <div className="relative">
                            <button
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                            >
                                <FiShare2 className="w-4 h-4" />
                                Share
                            </button>

                            {/* Share Options Dropdown */}
                            {showShareOptions && (
                                <div className="absolute right-0 top-12 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-3 z-50">
                                    <div className="space-y-2">
                                        <button
                                            onClick={shareOnFacebook}
                                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <FiFacebook className="w-4 h-4 text-blue-400" />
                                            <span className="text-sm">Share on Facebook</span>
                                        </button>

                                        <button
                                            onClick={shareOnTwitter}
                                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <FiTwitter className="w-4 h-4 text-sky-400" />
                                            <span className="text-sm">Share on Twitter</span>
                                        </button>

                                        <button
                                            onClick={shareOnLinkedIn}
                                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <FiLinkedin className="w-4 h-4 text-blue-300" />
                                            <span className="text-sm">Share on LinkedIn</span>
                                        </button>

                                        <button
                                            onClick={shareOnMedium}
                                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <FaMedium className="w-4 h-4 text-green-400" />
                                            <span className="text-sm">Share on Medium</span>
                                        </button>

                                        <button
                                            onClick={copyToClipboard}
                                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            <FiLink className="w-4 h-4 text-purple-400" />
                                            <span className="text-sm">
                                                {copied ? 'Copied!' : 'Copy Link'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <header className="mb-8">
                    {/* Category */}
                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 text-sm bg-purple-500/10 text-purple-300 rounded-full border border-purple-500/20">
                            {newsletter.category || 'Uncategorized'}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        {newsletter.title || 'Untitled Newsletter'}
                    </h1>

                    {/* Description */}
                    <p className="text-lg text-gray-300 mb-6">
                        {newsletter.metaDescription || newsletter.description || 'No description available.'}
                    </p>

                    {/* Meta Info - Right Side */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <time dateTime={publishedDate}>
                                {formattedDate}
                            </time>
                        </div>

                        <div className="flex items-center gap-2">
                            <FiEye className="w-4 h-4" />
                            <span>{(newsletter.views || 0).toLocaleString()} views</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FiUser className="w-4 h-4" />
                            <span>
                                By <UserLink author={newsletter.author} className="text-purple-400 hover:text-purple-300" />
                            </span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {newsletter.mainImage && (
                    <div className="mb-8 rounded-xl overflow-hidden">
                        <Image
                            src={newsletter.mainImage}
                            alt={newsletter.imageAlt || newsletter.title || 'Newsletter Image'}
                            width={1200}
                            height={630}
                            className="w-full h-auto object-cover"
                            priority
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

                <p className="text-gray-300 mb-8">{newsletter.description || 'No description available.'}</p>

                {/* Content Sections */}
                <div className="lg:col-span-2 space-y-5">
                    {safeContent.length > 0 ? (
                        safeContent.map((section, index) => (
                            <div key={index} className="mb-6">
                                {section.tag && (
                                    <>
                                        {section.tag === 'p' ? (
                                            <p className="text-gray-300 mb-6">{section.content}</p>
                                        ) : (
                                            React.createElement(
                                                section.tag,
                                                { className: 'text-xl font-semibold text-white mb-4 mt-3' },
                                                section.content
                                            )
                                        )}
                                    </>
                                )}
                                {section.bulletPoints && section.bulletPoints.length > 0 && (
                                    <ul className="list-disc pl-5 mb-4 text-gray-300">
                                        {section.bulletPoints.map((point, i) => (
                                            <li key={i}>{point}</li>
                                        ))}
                                    </ul>
                                )}
                                {section.image && (
                                    <div className="my-6 rounded-lg overflow-hidden">
                                        <Image
                                            src={section.image}
                                            alt={section.imageAlt || section.title || 'Section Image'}
                                            width={800}
                                            height={400}
                                            className="w-full h-auto object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No content available for this newsletter.</p>
                        </div>
                    )}
                </div>

                {/* Enhanced Footer with Social Share */}
                <footer className="mt-12 pt-8 border-t border-gray-700">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        {/* Author Info */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {(newsletter.author || 'AM').charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-white">
                                    <UserLink author={newsletter.author} className="text-white hover:text-purple-300" />
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Published on {formattedDate}
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    {(newsletter.views || 0).toLocaleString()} views
                                </p>
                            </div>
                        </div>

                        {/* Social Share Buttons */}
                        <div className="flex flex-col sm:items-end gap-3">
                            <p className="text-gray-400 text-sm">Share this newsletter:</p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={shareOnFacebook}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-blue-600/20 transition-colors"
                                    title="Share on Facebook"
                                >
                                    <FiFacebook className="w-5 h-5 text-blue-400" />
                                </button>

                                <button
                                    onClick={shareOnTwitter}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-sky-600/20 transition-colors"
                                    title="Share on Twitter"
                                >
                                    <FiTwitter className="w-5 h-5 text-sky-400" />
                                </button>

                                <button
                                    onClick={shareOnLinkedIn}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-blue-700/20 transition-colors"
                                    title="Share on LinkedIn"
                                >
                                    <FiLinkedin className="w-5 h-5 text-blue-300" />
                                </button>

                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 rounded-lg bg-gray-800 hover:bg-purple-600/20 transition-colors"
                                    title="Copy Link"
                                >
                                    <FiLink className="w-5 h-5 text-purple-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Close share dropdown when clicking outside */}
            {showShareOptions && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowShareOptions(false)}
                />
            )}
        </article>
    );
};

export default NewsletterDetail;