// app/components/Blog/TrendingBlogs/TrendingBlogs.jsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiTrendingUp, FiEye } from 'react-icons/fi';

export default function TrendingBlogs({ blogs }) {
    if (!blogs || blogs.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-400 text-sm">No trending blogs</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {blogs.map((blog, index) => (
                <Link
                    key={blog.slug}
                    href={`/blog/${blog.slug}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300 group"
                    prefetch={false}
                >
                    {/* Rank Indicator */}
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-1">
                            {blog.title}
                        </h3>
                        <div className="flex items-center text-xs text-gray-400">
                            <FiEye className="w-3 h-3 mr-1" />
                            <span>{blog.views || 0} views</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}