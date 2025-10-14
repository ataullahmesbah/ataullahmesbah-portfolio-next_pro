// app/components/Blog/BlogSidebar.jsx
import Link from 'next/link';
import { FiFilter, FiTrendingUp } from 'react-icons/fi';

export default function BlogSidebar({ categories, currentCategory }) {
    return (
        <div className="space-y-6">
            {/* Categories Filter */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
                    <FiFilter className="mr-2" /> Categories
                </h2>
                <div className="space-y-2">
                    {/* All Categories Link */}
                    <Link
                        href="/blog"
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ${!currentCategory
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        prefetch={false}
                    >
                        All Categories
                    </Link>

                    {/* Category List */}
                    {categories.length > 0 ? (
                        categories.map((category) => {
                            const categorySlug = category.toLowerCase().replace(/ /g, '-');
                            const isActive = currentCategory === categorySlug;

                            return (
                                <Link
                                    key={category}
                                    href={`/blog/category/${categorySlug}`}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ${isActive
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    prefetch={false}
                                >
                                    <span className="truncate">{category}</span>
                                </Link>
                            );
                        })
                    ) : (
                        <p className="text-gray-400 text-sm">No categories available</p>
                    )}
                </div>
            </div>

            {/* Trending Blogs - You can add this later */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4 text-gray-200 flex items-center">
                    <FiTrendingUp className="mr-2" /> Trending
                </h2>
                <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">Coming soon...</p>
                </div>
            </div>
        </div>
    );
}