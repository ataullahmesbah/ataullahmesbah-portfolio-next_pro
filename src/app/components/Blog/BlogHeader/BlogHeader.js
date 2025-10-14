// app/components/Blog/BlogHeader.js



export default function BlogHeader({ totalBlogs, currentPage, error }) {
    return (
        <div className="text-center mb-12" data-aos="fade-down">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-6 font-serif">
                Latest Blogs & Articles
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed font-sans">
                {error ? (
                    <span className="text-red-500">Error loading blogs. Please try again.</span>
                ) : (
                    `Discover ${totalBlogs} insightful articles on AI, quantum computing, web development, and cutting-edge technology trends.`
                )}
            </p>
            {currentPage > 1 && (
                <p className="text-gray-500 mt-4 font-medium">Page {currentPage}</p>
            )}
        </div>
    );
}