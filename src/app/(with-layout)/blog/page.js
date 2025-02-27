import Link from 'next/link';
import Image from 'next/image';

export default async function BlogList() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
    const blogs = await res.json();

    // Get unique categories
    const categories = [...new Set(blogs.map(blog => blog.category))];

    // Get latest 3 blogs
    const latestBlogs = blogs.slice(0, 3);

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Side - Main Content */}
                <div className="lg:col-span-3">
                    <h1 className="text-2xl font-bold mb-6">All Blogs</h1>
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <div key={blog._id} className="border p-4 rounded-lg shadow mb-6">
                                <h2 className="text-xl font-semibold">{blog.title}</h2>
                                {blog.image?.[0] && (
                                    <Image
                                        src={blog.image[0]}
                                        alt={blog.title}
                                        width={800}
                                        height={400}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <p>{blog.metaDescription}</p>
                                <Link href={`/blog/${blog._id}`} legacyBehavior>
                                    <a className="text-blue-500 underline">Read More</a>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>No blogs found</p>
                    )}
                </div>

                {/* Right Side - Latest Blogs + Categories */}
                <div className="lg:col-span-1">
                    {/* Latest 3 Blogs */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Latest Blogs</h2>
                        {latestBlogs.map((blog) => (
                            <div key={blog._id} className="mb-4">
                                <Link href={`/blog/${blog._id}`} legacyBehavior>
                                    <a className="text-blue-500 underline">{blog.title}</a>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Categories */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Categories</h2>
                        {categories.map((category) => (
                            <div key={category} className="mb-2">
                                <Link href={`/blog/category/${category.toLowerCase()}`} legacyBehavior>
                                    <a className="text-blue-500 underline">{category}</a>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}