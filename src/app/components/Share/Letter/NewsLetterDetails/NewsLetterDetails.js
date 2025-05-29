"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { FaFacebook, FaLinkedin, FaMedium, FaTwitter } from 'react-icons/fa';
import UserLink from '@/app/components/Profile/ProfileLink/UserLink';

const NewsLetterDetails = ({ params }) => {
    const [newsletter, setNewsletter] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchNewsletter = async () => {
            try {
                const res = await fetch(`/api/newsletter/letter?slug=${params.slug}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch newsletter');
                }
                const data = await res.json();
                setNewsletter(data);
            } catch (error) {
                toast.error(error.message || 'Error loading newsletter');
                router.push('/newsletter');
            } finally {
                setLoading(false);
            }
        };
        fetchNewsletter();
    }, [params.slug, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!newsletter) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <p className="text-white">Newsletter not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6 md:p-10">
            <button
                onClick={() => router.back()}
                className="mb-6 text-purple-400 hover:text-purple-300 flex items-center"
            >
                ← Back to Newsletters
            </button>

            <article className="max-w-4xl mx-auto leading-relaxed">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                    <Image
                        src={newsletter.mainImage}
                        alt={newsletter.imageAlt}
                        fill
                        className="object-cover"
                        priority
                        loading="eager"
                    />
                </div>

                <div className="mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-400 mb-6">
                        <span className="text-purple-400 text-sm font-medium">{newsletter.category}</span>
                        <span>By <UserLink author={newsletter?.author} /></span>
                        <span>•</span>
                        <span>{new Date(newsletter.publishDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{newsletter.views} views</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4">{newsletter.title}</h1>
                    <p>{newsletter.metaDescription}</p>
                </div>

                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-8">{newsletter.description}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-5">
                            {newsletter.content.map((section, index) => (
                                <div key={index} className="mb-6">
                                    {section.tag === 'p' ? (
                                        <p className="text-gray-300 mb-6">{section.content}</p>
                                    ) : (
                                        React.createElement(
                                            section.tag,
                                            { className: 'text-xl font-semibold mb-4 mt-3' },
                                            section.content
                                        )
                                    )}
                                    {section.bulletPoints && section.bulletPoints.length > 0 && (
                                        <ul className="list-disc pl-5 mb-4 text-gray-300">
                                            {section.bulletPoints.map((point, i) => (
                                                <li key={i}>{point}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right Section */}
                        <div className="space-y-8">
                            {/* Share Options */}
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">Share This Newsletter</h2>
                                <div className="flex space-x-4 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://www.ataullahmesbah.com/letter/${newsletter.slug}`)}&text=${encodeURIComponent(`Check out this newsletter: ${newsletter.title} by ${newsletter.author}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-gray-800 hover:bg-blue-500 transition-colors"
                                        aria-label="Share on Twitter"
                                    >
                                        <FaTwitter className="w-6 h-6 text-white" />
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.ataullahmesbah.com/letter/${newsletter.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 transition-colors"
                                        aria-label="Share on Facebook"
                                    >
                                        <FaFacebook className="w-6 h-6 text-white" />
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://www.ataullahmesbah.com/letter/${newsletter.slug}`)}&title=${encodeURIComponent(newsletter.title)}&summary=${encodeURIComponent(newsletter.metaDescription || newsletter.description)}&source=${encodeURIComponent(newsletter.author)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-gray-800 hover:bg-blue-700 transition-colors"
                                        aria-label="Share on LinkedIn"
                                    >
                                        <FaLinkedin className="w-6 h-6 text-white" />
                                    </a>
                                    <a
                                        href={`https://medium.com/?url=${encodeURIComponent(`https://www.ataullahmesbah.com/letter/${newsletter.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-full bg-gray-800 hover:bg-gray-600 transition-colors"
                                        aria-label="Share on Medium"
                                    >
                                        <FaMedium className="w-6 h-6 text-white" />
                                    </a>
                                </div>
                            </section>

                            {/* Contact Information */}
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4">Get in Touch</h2>
                                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                                    <p className="text-gray-300 mb-4">
                                        Interested in working together or have questions about this newsletter? Let’s connect!
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                                    >
                                        Contact Me
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default NewsLetterDetails;