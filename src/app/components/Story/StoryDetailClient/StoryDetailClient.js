'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiClock, FiCalendar, FiEye, FiArrowLeft, FiShare2, FiHeart, FiBookmark } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaLink, FaWhatsapp } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import toast, { Toaster } from 'react-hot-toast';
import UserLink from '../../Profile/ProfileLink/UserLink';

export default function StoryDetailClient(props) {
    const { story, schema, relatedStories = [] } = props;
    const [isClient, setIsClient] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    // Show maximum 4 related stories
    const displayRelatedStories = relatedStories.slice(0, 4);

    useEffect(() => {
        setIsClient(true);
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
        setIsBookmarked(!!bookmarks[story.slug]);
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
        });
    }, [story.slug]);

    const toggleBookmark = () => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
        if (isBookmarked) {
            delete bookmarks[story.slug];
            toast.success('Removed from bookmarks');
        } else {
            bookmarks[story.slug] = true;
            toast.success('Added to bookmarks');
        }
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        setIsBookmarked(!isBookmarked);
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
            setShowShareModal(false);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        }
    };

    const shareOnWhatsApp = () => {
        const text = `${shareTitle} - ${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    const renderContentBlock = (block, index) => {
        if (!block || !block.type) return null;

        switch (block.type) {
            case 'paragraph':
                return (
                    <p
                        key={index}
                        className="text-gray-300 leading-relaxed mb-6 text-[15px] md:text-[16px] font-normal"
                        data-aos="fade-up"
                    >
                        {block.content || ''}
                    </p>
                );
            case 'heading':
                const HeadingTag = `h${block.level || 2}`;
                const headingClasses = {
                    1: 'text-2xl md:text-3xl font-bold text-white mb-4 mt-8',
                    2: 'text-xl md:text-2xl font-semibold text-white mb-3 mt-6',
                    3: 'text-lg md:text-xl font-semibold text-white mb-2 mt-4'
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
                    <div key={index} className="my-6" data-aos="fade-up">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                            <Image
                                src={block.imageUrl || '/images/placeholder.jpg'}
                                alt={block.caption || 'Story image'}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 800px"
                                quality={90}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="/images/placeholder-blur.jpg"
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-400 text-sm mt-2 text-center font-normal">{block.caption}</p>
                        )}
                    </div>
                );
            case 'video':
                return (
                    <div key={index} className="my-6" data-aos="fade-up">
                        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                            <iframe
                                src={block.content}
                                className="w-full h-full"
                                allowFullScreen
                                loading="lazy"
                                title={block.caption || 'Video content'}
                            />
                        </div>
                        {block.caption && (
                            <p className="text-gray-400 text-sm mt-2 text-center font-normal">{block.caption}</p>
                        )}
                    </div>
                );
            case 'code':
                return (
                    <div key={index} className="my-4" data-aos="fade-up">
                        <div className="bg-gray-700 rounded-lg p-4 overflow-x-auto border border-gray-600">
                            <code className="text-gray-200 text-[13px] font-mono whitespace-pre-wrap">
                                {block.content || ''}
                            </code>
                        </div>
                    </div>
                );
            case 'quote':
                return (
                    <blockquote
                        key={index}
                        className="border-l-3 border-purple-500 pl-4 my-6 py-2 bg-gray-800/30 rounded-r-lg"
                        data-aos="fade-up"
                    >
                        <p className="text-gray-200 italic text-[15px] mb-1 font-normal">
                            {block.content}
                        </p>
                        {block.author && (
                            <cite className="text-gray-400 text-[13px] not-italic font-medium">— {block.author}</cite>
                        )}
                    </blockquote>
                );
            default:
                return null;
        }
    };

    const shareUrl = `https://ataullahmesbah.com/featured-story/${story.slug}`;
    const shareTitle = story.metaTitle || story.title;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Toaster position="top-right" />

            {/* Navigation Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 border-b border-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/featured-story"
                            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium"
                            data-aos="fade-right"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                            <span className="text-sm">Back to Stories</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleBookmark}
                                className={`p-2 rounded-lg transition-all ${isBookmarked
                                    ? 'text-purple-500'
                                    : 'text-gray-400 hover:text-purple-500'
                                    }`}
                                aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                            >
                                <FiBookmark className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowShareModal(true)}
                                className="p-2 rounded-lg text-gray-400 hover:text-purple-500 transition-all"
                                aria-label="Share story"
                            >
                                <FiShare2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Article Container */}
                <article className="mb-12">
                    {/* Article Header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <span
                                className="inline-block bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30"
                                data-aos="fade-up"
                            >
                                {story.category || 'Featured Story'}
                            </span>
                        </div>

                        <h1
                            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight"
                            data-aos="fade-up"
                            data-aos-delay="200"
                        >
                            {story.title || 'Untitled Story'}
                        </h1>

                        {/* Author Section */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                            {/* Author Avatar */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base">
                                    {(story.author || 'AM').charAt(0).toUpperCase()}
                                </div>
                                <div className="sm:hidden">
                                    <p className="font-semibold text-white text-sm">
                                        <UserLink
                                            author={story.author}
                                            className="text-white hover:text-purple-300 transition-colors"
                                        />
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1">Author</p>
                                </div>
                            </div>

                            {/* Author Info and Stats */}
                            <div className="flex-1 min-w-0">
                                {/* Desktop Author Name */}
                                <div className="hidden sm:block mb-2">
                                    <p className="font-semibold text-white text-sm">
                                        <UserLink
                                            author={story.author}
                                            className="text-white hover:text-purple-300 transition-colors"
                                        />
                                    </p>
                                    <p className="text-gray-400 text-xs">Author</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                    {/* Published Date */}
                                    <div className="flex items-center text-gray-300 text-xs">
                                        <FiCalendar className="mr-1 w-3 h-3 text-purple-400 flex-shrink-0" />
                                        <span className="truncate">
                                            {new Date(story.publishedDate || Date.now()).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    {/* Reading Time */}
                                    <div className="flex items-center text-gray-300 text-xs">
                                        <FiClock className="mr-1 w-3 h-3 text-blue-400 flex-shrink-0" />
                                        <span>{story.readingTime || 0} min read</span>
                                    </div>

                                    {/* Views */}
                                    <div className="flex items-center text-gray-300 text-xs">
                                        <FiEye className="mr-1 w-3 h-3 text-green-400 flex-shrink-0" />
                                        <span>{story.views || 0} views</span>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Actions - Desktop Only */}
                            <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="p-2 text-gray-400 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-colors"
                                    aria-label="Share story"
                                >
                                    <FiShare2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={toggleBookmark}
                                    className={`p-2 rounded-lg transition-colors ${isBookmarked
                                        ? 'text-purple-500 bg-purple-500/10'
                                        : 'text-gray-400 hover:text-purple-500 hover:bg-purple-500/10'
                                        }`}
                                    aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                                >
                                    <FiBookmark className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div
                        className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-6"
                        data-aos="fade-up"
                        data-aos-delay="400"
                    >
                        <Image
                            src={story.mainImage || '/images/placeholder.jpg'}
                            alt={story.title || 'Story image'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            quality={90}
                            priority
                        />
                    </div>

                    {/* Article Content */}
                    <div className="max-w-none">
                        {/* Introduction */}
                        <div
                            className="mb-6 border-l-3 border-purple-500 pl-4 py-1"
                            data-aos="fade-up"
                        >
                            <p className="text-gray-300 leading-relaxed text-[15px] md:text-[16px] font-normal italic">
                                {story.shortDescription || story.metaDescription || 'No description available.'}
                            </p>
                        </div>

                        {/* Content Blocks */}
                        {Array.isArray(story.contentBlocks) && story.contentBlocks.length > 0 ? (
                            <div className="space-y-6">
                                {story.contentBlocks.map((block, index) => renderContentBlock(block, index))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic text-center py-8 text-sm" data-aos="fade-up">
                                No content available for this story.
                            </p>
                        )}

                        {/* Key Takeaways - Normal Design */}
                        {story.keyPoints && story.keyPoints.length > 0 && (
                            <div
                                className="my-6 p-4 bg-gray-800/40 rounded-lg border border-gray-700"
                                data-aos="fade-up"
                            >
                                <h2 className="text-lg font-semibold text-white mb-3">Key Takeaways</h2>
                                <ul className="space-y-2">
                                    {story.keyPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start text-gray-300 text-sm">
                                            <span className="text-purple-400 mr-2 mt-0.5 text-base">•</span>
                                            <span className="font-normal leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tags */}
                        {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6" data-aos="fade-up">
                                {story.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700 hover:bg-purple-600/20 hover:text-purple-300 hover:border-purple-500/30 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Share Section */}
                    <div className="mt-8 pt-6 border-t border-gray-700">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 text-gray-400 hover:text-purple-500 transition-colors px-4 py-2 rounded-lg hover:bg-purple-500/10 border border-gray-700 hover:border-purple-500/30 text-sm">
                                    <FiHeart className="w-4 h-4" />
                                    <span className="font-medium">Like</span>
                                </button>
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="flex items-center gap-2 text-gray-400 hover:text-purple-500 transition-colors px-4 py-2 rounded-lg hover:bg-purple-500/10 border border-gray-700 hover:border-purple-500/30 text-sm"
                                >
                                    <FiShare2 className="w-4 h-4" />
                                    <span className="font-medium">Share</span>
                                </button>
                            </div>

                            <button
                                onClick={() => setShowShareModal(true)}
                                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold text-sm"
                            >
                                <FiShare2 className="w-4 h-4" />
                                Share This Story
                            </button>
                        </div>
                    </div>
                </article>

                {/* Related Stories - Maximum 4 */}
                {displayRelatedStories.length > 0 && (
                    <section className="mb-12">
                        <div className="max-w-6xl mx-auto">
                            <h2
                                className="text-xl md:text-2xl font-bold text-white mb-6"
                                data-aos="fade-right"
                            >
                                Related Stories
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {displayRelatedStories.map((related, index) => (
                                    <Link
                                        key={related._id}
                                        href={`/featured-story/${related.slug}`}
                                        className="group"
                                        data-aos="fade-up"
                                        data-aos-delay={index * 100}
                                    >
                                        <div className="border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500/50 transition-colors h-full flex flex-col bg-gray-800/30">
                                            <div className="relative w-full aspect-[4/3]">
                                                <Image
                                                    src={related.mainImage || '/images/placeholder.jpg'}
                                                    alt={related.title || 'Related story'}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                                    quality={80}
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div className="p-3 flex flex-col flex-grow">
                                                <h3 className="font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2 text-sm leading-tight">
                                                    {related.title || 'Untitled Story'}
                                                </h3>
                                                <div className="flex items-center text-gray-400 text-xs mt-auto pt-2 border-t border-gray-700">
                                                    <FiCalendar className="mr-1 w-3 h-3" />
                                                    {new Date(related.publishedDate || Date.now()).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Enhanced Share Modal */}
            {showShareModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowShareModal(false)}
                >
                    <div
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700 shadow-2xl"
                        data-aos="zoom-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FiShare2 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Share This Story</h3>
                            <p className="text-gray-400 text-sm">Spread the knowledge with others</p>
                        </div>

                        {/* Share Options */}
                        <div className="grid grid-cols-4 gap-3 mb-6">
                            <button
                                onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}
                                className="flex flex-col items-center p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-300 transform hover:scale-105"
                                aria-label="Share on Facebook"
                            >
                                <FaFacebookF className="w-6 h-6 text-white mb-2" />
                                <span className="text-white text-xs font-medium">Facebook</span>
                            </button>
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${shareUrl}`, '_blank')}
                                className="flex flex-col items-center p-3 bg-sky-500 hover:bg-sky-600 rounded-xl transition-all duration-300 transform hover:scale-105"
                                aria-label="Share on Twitter"
                            >
                                <FaTwitter className="w-6 h-6 text-white mb-2" />
                                <span className="text-white text-xs font-medium">Twitter</span>
                            </button>
                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')}
                                className="flex flex-col items-center p-3 bg-blue-800 hover:bg-blue-900 rounded-xl transition-all duration-300 transform hover:scale-105"
                                aria-label="Share on LinkedIn"
                            >
                                <FaLinkedinIn className="w-6 h-6 text-white mb-2" />
                                <span className="text-white text-xs font-medium">LinkedIn</span>
                            </button>
                            <button
                                onClick={shareOnWhatsApp}
                                className="flex flex-col items-center p-3 bg-green-600 hover:bg-green-700 rounded-xl transition-all duration-300 transform hover:scale-105"
                                aria-label="Share on WhatsApp"
                            >
                                <FaWhatsapp className="w-6 h-6 text-white mb-2" />
                                <span className="text-white text-xs font-medium">WhatsApp</span>
                            </button>
                        </div>

                        {/* Copy Link Section */}
                        <div className="bg-gray-700/50 rounded-xl p-3 mb-4">
                            <div className="flex items-center gap-2">
                                <FaLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className="flex-1 bg-transparent border-none text-gray-300 text-sm focus:outline-none select-all"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={copyToClipboard}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                            >
                                <FaLink className="w-4 h-4" />
                                Copy Link
                            </button>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 py-3 rounded-xl transition-colors font-medium text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Schema Script */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        </div>
    );
}