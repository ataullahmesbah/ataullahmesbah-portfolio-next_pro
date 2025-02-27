// src/app/(with-layout)/blog/page.js
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Blogs - Ataullah Mesbah',
  description: 'Explore all blogs on My Website.',
};

async function getBlogs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch blogs');
    const data = await res.json();
    console.log('Fetched blogs:', data); // Log the fetched data
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">All Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-600">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.slug} className="border rounded-lg overflow-hidden shadow-lg">
              <Link href={`/blog/${blog.slug}`}>
                <div className="relative h-48">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                  <p className="text-gray-600">{blog.shortContent}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}