'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiCalendar, FiEye, FiArrowLeft, FiShare2, FiHeart, FiBookmark } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaLink } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function StoryDetailClient({ story, schema, relatedStories = [] }) {
    const [isClient, setIsClient] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        setIsClient(true);
        setCurrentUrl(window.location.href);
        AOS.init({
            duration: 600,
            easing: 'ease-out',
            once: true,
        });
    }, []);

    const shareUrl = currentUrl;
    const shareTitle = story.metaTitle || story.title;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const renderContentBlock = (block, index) => {
        if (!block || !block.type) return null;

        switch (block.type) {
            case 'paragraph':
                return (
                    <p
                        key={index}
                        className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg"
                        data-aos="fade-up"
                    >
                        {block.content || ''}
                    </p>
                );

            case 'heading':
                const HeadingTag = `h${block.level || 2}`;
                const headingClasses = {
                    1: 'text-2xl md:text-3xl font-bold text-gray-900 mb-6 mt-12',
                    2: 'text-xl md:text-2xl font-bold text-gray-900 mb-4 mt-10',
                    3: 'text-lg md:text-xl font-semibold text-gray-900 mb-3 mt-8'
                };
                return (
                    <HeadingTag
                        key={index}
                        className={headingClasses[block.level] || headingClasses[2]}
                        data-aos="fade-up"
                    >
                        {block.content || ''}
                    </HeadingTag>
                );

            case 'image':
                return (
                    <div key={index} className="my-8" data-aos="fade-up">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-md">
                            <Image
                                src={block.imageUrl || '/images/placeholder.jpg'}
                                alt={block.caption || 'Story image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 800px"
                                quality={85}
                                loading="lazy"
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-600 text-sm mt-3 text-center">
                                {block.caption}
                            </p>
                        )}
                    </div>
                );

            case 'video':
                return (
                    <div key={index} className="my-8" data-aos="fade-up">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-md">
                            <iframe
                                src={block.content}
                                className="w-full h-full"
                                allowFullScreen
                                loading="lazy"
                                title={block.caption || 'Video content'}
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-600 text-sm mt-3 text-center">
                                {block.caption}
                            </p>
                        )}
                    </div>
                );

            case 'code':
                return (
                    <div key={index} className="my-6" data-aos="fade-up">
                        <div className="bg-gray-100 rounded-lg p-4 overflow-x-auto border">
                            <code className="text-gray-800 text-sm font-mono whitespace-pre-wrap">
                                {block.content || ''}
                            </code>
                        </div>
                    </div>
                );

            case 'quote':
                return (
                    <blockquote
                        key={index}
                        className="border-l-4 border-purple-500 pl-4 my-6 py-2 bg-purple-50 rounded-r-lg"
                        data-aos="fade-up"
                    >
                        <p className="text-gray-700 italic text-lg mb-2">
                            {block.content}
                        </p>
                        {block.author && (
                            <cite className="text-gray-600 text-sm not-italic">— {block.author}</cite>
                        )}
                    </blockquote>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-800">
            {/* Fixed Header */}
            

            {/* Main Content */}
            <main className="pt-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Article Header */}
                <article className="mb-12">
                    <div className="mb-8">
                        <span
                            className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium mb-4"
                            data-aos="fade-up"
                        >
                            {story.category || 'Featured Story'}
                        </span>

                        <h1
                            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                            data-aos="fade-up"
                            data-aos-delay="100"
                        >
                            {story.title}
                        </h1>

                        <div
                            className="flex flex-wrap items-center text-gray-600 text-sm gap-4 mb-6"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            <span className="flex items-center">
                                <FiCalendar className="mr-2 w-4 h-4" />
                                {new Date(story.publishedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center">
                                <FiClock className="mr-2 w-4 h-4" />
                                {story.readingTime || 0} min read
                            </span>
                            <span className="flex items-center">
                                <FiEye className="mr-2 w-4 h-4" />
                                {story.views || 0} views
                            </span>
                        </div>

                        <div
                            className="flex items-center gap-3"
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {story.author?.[0] || 'A'}
                            </div>
                            <div>
                                <p className="text-gray-900 font-medium text-sm">{story.author || 'Ataullah Mesbah'}</p>
                                <p className="text-gray-600 text-xs">Author</p>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div
                        className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-md mb-8"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        <Image
                            src={story.mainImage || '/images/placeholder.jpg'}
                            alt={story.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            quality={90}
                            priority
                        />
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-lg max-w-none">
                        {/* Introduction */}
                        <div
                            className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200"
                            data-aos="fade-up"
                        >
                            <p className="text-gray-700 leading-relaxed text-lg font-medium">
                                {story.shortDescription || story.metaDescription || 'An incredible journey worth sharing...'}
                            </p>
                        </div>

                        {/* Content Blocks */}
                        {Array.isArray(story.contentBlocks) && story.contentBlocks.length > 0 ? (
                            <div className="space-y-6">
                                {story.contentBlocks.map((block, index) => renderContentBlock(block, index))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Content coming soon...</p>
                            </div>
                        )}

                        {/* Key Takeaways */}
                        {story.keyPoints?.length > 0 && (
                            <div
                                className="bg-purple-50 rounded-xl p-6 my-8 border border-purple-200"
                                data-aos="fade-up"
                            >
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Key Takeaways
                                </h2>
                                <ul className="space-y-3">
                                    {story.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start text-gray-700">
                                            <span className="text-purple-500 mr-3 mt-1">•</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tags */}
                        {story.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-8" data-aos="fade-up">
                                {story.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200 hover:bg-purple-100 hover:text-purple-700 hover:border-purple-200 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </article>

                {/* Action Footer */}
                <div
                    className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-12"
                    data-aos="fade-up"
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors px-4 py-2 rounded-lg hover:bg-purple-50">
                                <FiHeart className="w-5 h-5" />
                                <span className="text-sm">Like</span>
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors px-4 py-2 rounded-lg hover:bg-purple-50"
                            >
                                <FiShare2 className="w-5 h-5" />
                                <span className="text-sm">Share</span>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowShareModal(true)}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors font-medium text-sm"
                        >
                            <FiShare2 className="w-4 h-4" />
                            Share This Story
                        </button>
                    </div>
                </div>

                {/* Related Stories */}
                {relatedStories.length > 0 && (
                    <section className="mb-12">
                        <h2
                            className="text-2xl font-bold text-gray-900 mb-8"
                            data-aos="fade-right"
                        >
                            Related Stories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {relatedStories.map((related, index) => (
                                <Link
                                    key={related._id}
                                    href={`/featured-story/${related.slug}`}
                                    className="group"
                                    data-aos="fade-up"
                                    data-aos-delay={index * 100}
                                >
                                    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow h-full flex flex-col">
                                        <div className="relative w-full aspect-[16/9]">
                                            <Image
                                                src={related.mainImage || '/images/placeholder.jpg'}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, 400px"
                                                quality={85}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm">
                                                {related.title}
                                            </h3>
                                            <p className="text-gray-600 text-xs line-clamp-2 mb-3 flex-grow">
                                                {related.shortDescription || related.metaDescription || 'Discover this amazing story...'}
                                            </p>
                                            <div className="flex items-center justify-between text-gray-500 text-xs">
                                                <span className="flex items-center">
                                                    <FiCalendar className="mr-1 w-3 h-3" />
                                                    {new Date(related.publishedDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                                <span className="flex items-center">
                                                    <FiClock className="mr-1 w-3 h-3" />
                                                    {related.readingTime || 0} min
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div
                        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl"
                        data-aos="zoom-in"
                    >
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Share this story</h3>
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <button
                                onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}
                                className="flex flex-col items-center p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                <FaFacebookF className="w-5 h-5 text-white mb-1" />
                                <span className="text-white text-xs">Facebook</span>
                            </button>

                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`, '_blank')}
                                className="flex flex-col items-center p-3 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
                            >
                                <FaTwitter className="w-5 h-5 text-white mb-1" />
                                <span className="text-white text-xs">Twitter</span>
                            </button>

                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')}
                                className="flex flex-col items-center p-3 bg-blue-800 hover:bg-blue-900 rounded-lg transition-colors"
                            >
                                <FaLinkedinIn className="w-5 h-5 text-white mb-1" />
                                <span className="text-white text-xs">LinkedIn</span>
                            </button>

                            <button
                                onClick={copyToClipboard}
                                className="flex flex-col items-center p-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <FaLink className="w-5 h-5 text-white mb-1" />
                                <span className="text-white text-xs">Copy</span>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowShareModal(false)}
                            className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Schema Script */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </div>
    );
}