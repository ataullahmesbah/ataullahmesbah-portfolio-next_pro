// app/components/Blog/BlogSidebar.jsx (Fully Responsive Version)
import Link from 'next/link';
import { FiFilter, FiTrendingUp, FiFolder, FiEye, FiChevronRight } from 'react-icons/fi';

// Fetch trending blogs
async function getTrendingBlogs() {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/blog/trending?limit=3`, {
            next: { revalidate: 1800 }
        });

        if (!res.ok) throw new Error('Failed to fetch trending blogs');

        const data = await res.json();
        return data.blogs || [];
    } catch (error) {
        console.error('Error fetching trending blogs:', error);
        return [];
    }
}

export default async function BlogSidebar({ categories, currentCategory }) {
    const trendingBlogs = await getTrendingBlogs();

    return (
        <div className="space-y-4 lg:space-y-8">
            {/* Mobile: Horizontal Categories Scroll */}
            <div className="lg:hidden">
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4">
                    <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2 pb-3 border-b border-gray-700">
                        <FiFolder className="text-purple-400" />
                        Categories
                    </h2>

                    {/* Horizontal Scroll for Mobile */}
                    <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
                        {/* All Categories */}
                        <Link
                            href="/blog"
                            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${!currentCategory
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/10'
                                : 'text-gray-400 hover:bg-gray-700 border-gray-600 hover:text-white'
                                }`}
                            prefetch={false}
                        >
                            All
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
                                        className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${isActive
                                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/10'
                                            : 'text-gray-400 hover:bg-gray-700 border-gray-600 hover:text-white'
                                            }`}
                                        prefetch={false}
                                    >
                                        {category}
                                    </Link>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-sm px-3 py-2">No categories</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop: Vertical Categories */}
            <div className="hidden lg:block bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-white flex items-center gap-2 lg:gap-3 pb-3 border-b border-gray-700">
                    <FiFolder className="text-purple-400 text-lg" />
                    Blog Categories
                </h2>
                <div className="space-y-2 lg:space-y-3">
                    {/* All Categories Link */}
                    <Link
                        href="/blog"
                        className={`flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-medium transition-all duration-300 border-2 ${!currentCategory
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/10'
                            : 'text-gray-400 hover:bg-gray-700 border-transparent hover:border-gray-600 hover:text-white'
                            }`}
                        prefetch={false}
                    >
                        <span className="truncate">All Categories</span>
                        <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full text-xs lg:text-sm font-medium border border-purple-500/50 ml-2">
                            All
                        </span>
                    </Link>

                    {/* Category List */}
                    {categories.length > 0 ? (
                        categories.map((category, index) => {
                            const categorySlug = category.toLowerCase().replace(/ /g, '-');
                            const isActive = currentCategory === categorySlug;

                            return (
                                <Link
                                    key={category}
                                    href={`/blog/category/${categorySlug}`}
                                    className={`flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-medium transition-all duration-300 border-2 ${isActive
                                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/10'
                                        : 'text-gray-400 hover:bg-gray-700 border-transparent hover:border-gray-600 hover:text-white'
                                        }`}
                                    prefetch={false}
                                >
                                    <span className="truncate text-sm lg:text-base">{category}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs lg:text-sm font-medium border ${isActive
                                        ? 'bg-purple-500/30 text-purple-300 border-purple-500/50'
                                        : 'bg-gray-700 text-gray-400 border-gray-600'
                                        } ml-2`}>
                                        {/* Category count can be added here */}
                                    </span>
                                </Link>
                            );
                        })
                    ) : (
                        <div className="text-center py-4 lg:py-6">
                            <FiFolder className="text-gray-500 text-xl lg:text-2xl mx-auto mb-2" />
                            <p className="text-gray-500 text-xs lg:text-sm">No categories available</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Trending Blogs - Responsive Design */}
            <div className="bg-gradient-to-br from-gray-800 via-purple-900/20 to-gray-800 rounded-xl shadow-lg border border-purple-500/20 p-4 lg:p-6">
                <h2 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6 text-white flex items-center gap-2 lg:gap-3 pb-3 border-b border-purple-500/30">
                    <FiTrendingUp className="text-purple-400 text-lg" />
                    Trending Now
                </h2>

                {trendingBlogs.length > 0 ? (
                    <div className="space-y-3 lg:space-y-4">
                        {trendingBlogs.map((blog, index) => (
                            <TrendingBlogItem
                                key={blog.slug}
                                rank={index + 1}
                                title={blog.title}
                                slug={blog.slug}
                                views={blog.views || 0}
                                category={blog.categories?.[0] || 'General'}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 lg:py-6">
                        <FiTrendingUp className="text-gray-500 text-xl lg:text-2xl mx-auto mb-2" />
                        <p className="text-gray-500 text-xs lg:text-sm">No trending blogs yet</p>
                    </div>
                )}

                <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-purple-500/30">
                    <Link
                        href="/blog?sort=trending"
                        className="flex items-center justify-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-xs lg:text-sm transition-colors group"
                    >
                        View All Trending
                        <FiChevronRight className="text-xs lg:text-sm group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Trending Blog Item Component - Fully Responsive
function TrendingBlogItem({ rank, title, slug, views, category }) {
    const getRankColor = (rank) => {
        switch (rank) {
            case 1: return 'bg-purple-500 text-white shadow-lg shadow-purple-500/30';
            case 2: return 'bg-purple-600 text-white shadow-md shadow-purple-600/20';
            case 3: return 'bg-purple-700 text-white shadow-sm shadow-purple-700/10';
            default: return 'bg-gray-700 text-gray-300';
        }
    };

    const getRankGlow = (rank) => {
        switch (rank) {
            case 1: return 'ring-2 ring-purple-400 ring-opacity-50';
            case 2: return 'ring-1 ring-purple-500 ring-opacity-30';
            case 3: return 'ring-1 ring-purple-600 ring-opacity-20';
            default: return '';
        }
    };

    return (
        <Link href={`/blog/${slug}`} className="block">
            <div className="flex items-start gap-3 lg:gap-4 p-2 lg:p-3 rounded-lg hover:bg-purple-500/10 transition-all duration-300 group border border-transparent hover:border-purple-500/20">
                {/* Rank Badge - Responsive */}
                <div className={`flex-shrink-0 w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold ${getRankColor(rank)} ${getRankGlow(rank)}`}>
                    {rank}
                </div>

                {/* Content - Responsive */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-200 group-hover:text-purple-300 transition-colors line-clamp-2 text-xs lg:text-sm leading-tight mb-1 lg:mb-2">
                        {title}
                    </h3>
                    <div className="flex items-center justify-between flex-wrap gap-1 lg:gap-2">
                        <span className="text-xs text-purple-300 font-medium bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30">
                            {category.length > 12 ? category.substring(0, 12) + '...' : category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                            <FiEye className="text-xs" />
                            <span className="hidden xs:inline">{views.toLocaleString()} views</span>
                            <span className="xs:hidden">{views > 999 ? `${(views / 1000).toFixed(1)}k` : views}</span>
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}