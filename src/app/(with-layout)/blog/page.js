// src>app>(with-layout)>blog>page.js

import Link from 'next/link';
import Image from 'next/image';

export default async function BlogList() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
    const blogs = await res.json();

    // Get unique categories
    const categories = [...new Set(blogs.map(blog => blog.category))];

    return (
        <main className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">All Blogs</h1>
            <div className="flex space-x-4">
                {categories.map(category => (
                    <Link key={category} href={`/blog/category/${category.toLowerCase()}`}>
                        <span className="text-blue-500 underline">{category}</span>
                    </Link>
                ))}
            </div>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div key={blog._id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{blog.title}</h2>
                        {blog.content.find(item => item.type === 'image') && (
                            <Image
                                src={blog.content.find(item => item.type === 'image').src}
                                alt={blog.title}
                                width={400}
                                height={200}
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
        </main>
    );
}