// src>app>(with-layout)>blog>page.js

import Link from 'next/link';

export default async function BlogList() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
    const blogs = await res.json();

    return (
        <main className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">All Blogs</h1>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div key={blog._id} className="border p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold">{blog.title}</h2>
                        <p>{blog.description}</p>
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
