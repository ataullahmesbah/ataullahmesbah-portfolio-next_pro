// app/components/Blog/BlogHeader.js
export default function BlogHeader({ totalBlogs, currentPage, error }) {
    return (
        <div className="text-center" data-aos="fade-down">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
                Latest Blogs
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {error ? (
                    <span className="text-red-400">Error loading blogs. Please try again.</span>
                ) : (
                    `Explore ${totalBlogs} cutting-edge insights on AI, quantum computing, web development, and technology trends.`
                )}
            </p>
            {currentPage > 1 && (
                <p className="text-gray-400 mt-2">Page {currentPage}</p>
            )}
        </div>
    );
}