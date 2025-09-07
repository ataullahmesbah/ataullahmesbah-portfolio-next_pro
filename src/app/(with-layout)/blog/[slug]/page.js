// src/app/blog/[slug]/page.js


import BlogContent from '@/app/components/Blog/BlogDetails/BlogDetails';
import CommentBox from '@/app/components/CommentBox/CommentBox';
import Loader from '@/app/components/Loader/Loader';
import { Suspense } from 'react';






async function getBlogBySlug(slug) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/${slug}`, {
        cache: 'no-store',
        headers: {
            'Cache-Control': 'public, max-age=3600',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch blog');
    }

    return await res.json();
}

export async function generateMetadata({ params }) {
    const blog = await getBlogBySlug(params.slug);

    // Structured Data জন্য metadata
    const metadata = {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.shortDescriptions.join(' '),
        keywords: blog.tags.join(', '),
        alternates: {
            canonical: `${process.env.NEXTAUTH_URL}/blog/${params.slug}`,
        },
        openGraph: {
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.shortDescriptions.join(' '),
            url: `${process.env.NEXTAUTH_URL}/blog/${params.slug}`,
            images: [
                {
                    url: blog.mainImage,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                },
            ],
            type: 'article',
            publishedTime: blog.publishDate,
            authors: [blog.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.shortDescriptions.join(' '),
            images: [blog.mainImage],
        },
    };

    // GEO targeting জন্য metadata যোগ করুন
    if (blog.geoLocation && blog.geoLocation.targetCountry) {
        metadata.alternates.languages = {
            'x-default': `${process.env.NEXTAUTH_URL}/blog/${params.slug}`,
            [blog.language || 'en']: `${process.env.NEXTAUTH_URL}/blog/${params.slug}`,
        };
    }

    return metadata;
}

export default async function BlogDetail({ params }) {
    const blog = await getBlogBySlug(params.slug);

    return (
        <div className="bg-white min-h-screen">
            <Suspense fallback={<Loader />}>
                <BlogContent blog={blog} />
                <CommentBox blogId={blog._id} />
            </Suspense>
        </div>
    );
}