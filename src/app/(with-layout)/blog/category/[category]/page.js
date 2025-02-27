import Link from 'next/link';
import Image from 'next/image';

export default async function CategoryBlogs({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
    const blogs = await res.json();

    // Filter blogs by category
    const filteredBlogs = blogs.filter(blog => blog.category.toLowerCase() === params.category);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Blogs in Category: {params.category}</h1>
            {filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog) => (
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
                <p>No blogs found in this category</p>
            )}
        </div>
    );
}