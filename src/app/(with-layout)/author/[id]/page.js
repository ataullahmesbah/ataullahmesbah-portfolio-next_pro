// src/app/(with-layout)/author/[id]/page.js
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { RiVerifiedBadgeFill } from 'react-icons/ri';

export default function AuthorPage({ params }) {
    const [authorData, setAuthorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const res = await fetch(`/api/author/${params.id}`);
                const data = await res.json();

                if (res.ok) {
                    setAuthorData(data.author);
                } else {
                    toast.error('Author not found');
                    router.push('/');
                }
            } catch (error) {
                console.error('Error fetching author:', error);
                toast.error('Error fetching author');
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (!authorData) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <p className="text-white">Author not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-6">
            <div className="max-w-4xl mx-auto">
                {/* Author Profile Section */}
                <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
                    <div className="relative">
                        <Image
                            src={authorData.profile?.image || '/default-profile.png'}
                            alt={`${authorData.name}'s profile`}
                            width={150}
                            height={150}
                            className="rounded-full w-32 h-32 object-cover border-2 border-purple-500"
                        />
                        {authorData.profile?.verification === 'accepted' && (
                            <RiVerifiedBadgeFill
                                className="absolute bottom-0 right-0 text-purple-500 text-2xl"
                            />
                        )}
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold">{authorData.name}</h1>
                        <p className="text-gray-400">@{authorData.username}</p>
                        {authorData.profile?.intro && (
                            <p className="mt-2 text-gray-300">{authorData.profile.intro}</p>
                        )}
                        {authorData.profile?.bio && (
                            <p className="mt-2 text-gray-300">{authorData.profile.bio}</p>
                        )}
                        {authorData.profile?.description && (
                            <p className="mt-2 text-gray-400">{authorData.profile.description}</p>
                        )}
                    </div>
                </div>

                {/* Add more sections if needed */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-6">About the Author</h2>
                    <p className="text-gray-400">
                        {authorData.profile?.description || 'No description available.'}
                    </p>
                </div>
            </div>
        </div>
    );
}