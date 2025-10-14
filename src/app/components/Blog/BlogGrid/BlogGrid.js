// app/components/Blog/BlogGrid.jsx

import BlogCard from "../BlogCard/BlogCard";
import Pagination from "../Pagination/Pagination";




export default function BlogGrid({ blogs, currentPage, totalPages, error }) {
    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center" data-aos="fade-up">
                <div className="text-red-400 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-400 mb-2">Failed to Load Blogs</h3>
                <p className="text-gray-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (blogs.length === 0) {
        return (
            <div className="text-center py-12" data-aos="fade-up">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">No Blogs Published Yet</h3>
                <p className="text-gray-400">We're working on creating amazing content for you. Check back soon!</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {blogs.map((blog, index) => (
                    <BlogCard
                        key={blog._id || blog.slug}
                        blog={blog}
                        index={index}
                        priority={index < 3}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        basePath="/blog"
                    />
                </div>
            )}
        </>
    );
}