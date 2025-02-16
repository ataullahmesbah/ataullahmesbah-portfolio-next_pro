// src/app/(with-layout)/blog/[id]/page.js

import Image from 'next/image';
import { notFound } from 'next/navigation';
import Head from 'next/head';

export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const blogs = await res.json();
        return blogs.map(blog => ({ id: blog._id.toString() }));
    } catch {
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
            description: blog.description || 'Read our latest blog articles.',
            keywords: blog.tags?.join(', ') || 'blog, article, news',
        };
    } catch {
        return { title: 'Blog Not Found' };
    }
}

export default async function BlogDetails({ params }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${params.id}`, { cache: 'no-store' });
        if (!res.ok) notFound();
        const blog = await res.json();

        return (
            <main className="p-6 space-y-4">
                <Head>
                    <title>{blog.title} | My Blog</title>
                    <meta name="description" content={blog.description} />
                </Head>
                <h1 className="text-3xl font-bold">{blog.title}</h1>
                {blog.image && (
                    <Image src={blog.image} alt={blog.title} width={1200} height={630} className="w-full h-64 object-cover rounded-lg" priority />
                )}
                <article className="prose lg:prose-xl max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </article>
                <footer className="text-gray-500 text-sm">
                    Published on: {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </footer>
            </main>
        );
    } catch {
        notFound();
    }
}