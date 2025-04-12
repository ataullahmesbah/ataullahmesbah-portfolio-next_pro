'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import Loader from '@/app/components/Loader/Loader';

export default function StoryDetails() {
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { slug } = useParams();

    useEffect(() => {
        const fetchStory = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/feature/${slug}`);
                if (!res.ok) throw new Error('Failed to fetch story');
                const data = await res.json();
                setStory(data);
            } catch (error) {
                toast.error('Error loading story details');
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [slug]);

    if (loading) return <Loader />;
    if (!story) return Loading;

    return (
        <div className="min-h-screen bg-gray-800 py-12 px-4">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <article className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                    <div className="relative h-96">
                        <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-3 py-1 bg-gray-800 rounded-full text-sm text-purple-400">
                                {story.category}
                            </span>
                            {story.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="text-3xl font-bold text-white mb-4">{story.title}</h1>
                        <p className="text-gray-300 mb-6">{story.description}</p>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 text-gray-400">
                                <span>Views: {story.views}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <span>By: {story.author?.name || 'Unknown'}</span>
                            </div>
                        </div>

                        {story.keyPoints?.length > 0 && (
                            <div className="mb-8 p-4 bg-gray-800 rounded-lg">
                                <h3 className="text-xl font-semibold text-white mb-3">Key Points</h3>
                                <ul className="space-y-2">
                                    {story.keyPoints.map((point, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-purple-400 mt-1">•</span>
                                            <span className="text-gray-300">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="prose prose-invert max-w-none">
                            {story.content.map((block, index) => (
                                <div key={index} className="mb-6 last:mb-0">
                                    {block.type === 'text' && (
                                        <p className="text-gray-300 whitespace-pre-line">{block.value}</p>
                                    )}
                                    {block.type === 'image' && (
                                        <div className="my-6">
                                            <div className="relative aspect-video rounded-lg overflow-hidden">
                                                <Image
                                                    src={block.value}
                                                    alt={block.caption || story.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            {block.caption && (
                                                <p className="text-center text-gray-400 mt-2 text-sm">
                                                    {block.caption}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {block.type === 'video' && (
                                        <div className="my-6 aspect-video">
                                            <video
                                                controls
                                                className="w-full rounded-lg"
                                                poster={story.image}
                                            >
                                                <source src={block.value} type="video/mp4" />
                                            </video>
                                            {block.caption && (
                                                <p className="text-center text-gray-400 mt-2 text-sm">
                                                    {block.caption}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {block.type === 'code' && (
                                        <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                                            <code>{block.value}</code>
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}