// src>app>(with-layout)>blog>[id]>page.js

import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const blogs = await res.json();

        return blogs.map((blog) => ({
            id: blog._id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

export async function generateMetadata({ params }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${params.id}`, { cache: 'no-store' });
        if (!res.ok) return { title: 'Blog Not Found' };

        const blog = await res.json();

        return {
            title: `${blog.title} | My Blog`,
            description: blog.description,
            keywords: blog.tags?.join(', ') || 'blog, article, news',
            openGraph: {
                title: blog.title,
                description: blog.description,
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${blog._id}`,
                images: [
                    {
                        url: blog.image || '/default.jpg',
                        width: 1200,
                        height: 630,
                        alt: blog.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: blog.title,
                description: blog.description,
                image: blog.image || '/default.jpg',
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Not Found',
            description: 'The blog you are looking for does not exist.',
        };
    }
}

export default async function BlogDetails({ params }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${params.id}`, { cache: 'no-store' });
        if (!res.ok) notFound();

        const blog = await res.json();

        return (
            <main className="p-6 space-y-4">
                <h1 className="text-3xl font-bold">{blog.title}</h1>
                {blog.image && (
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                )}
                <p className="text-lg">{blog.content}</p>
                <div className="text-gray-500">
                    Published on: {new Date(blog.createdAt).toLocaleDateString()}
                </div>
            </main>
        );
    } catch (error) {
        console.error('Error fetching blog:', error);
        notFound();
    }
}
