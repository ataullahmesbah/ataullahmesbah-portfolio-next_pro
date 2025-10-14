// app/(with-layout)/blog/page.js

import BlogContent from '@/app/components/Blog/BlogContent/BlogContent';
import BlogSkeleton from '@/app/components/Blog/BlogSkeleton/BlogSkeleton';
import { Suspense } from 'react';



export async function generateMetadata({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;

  return {
    title: `Blog - Page ${page} | Ataullah Mesbah`,
    description: 'Explore the latest blog posts on AI, quantum computing, web development, and more by Ataullah Mesbah.',
    keywords: 'blog, Ataullah Mesbah, AI, quantum computing, web development, technology',
    openGraph: {
      title: `Blog - Page ${page} - Ataullah Mesbah`,
      description: 'Discover insights on AI, quantum computing, web development, and more.',
      url: `https://ataullahmesbah.com/blog?page=${page}`,
      type: 'website',
      images: ['/images/og-blog.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Blog - Page ${page} - Ataullah Mesbah`,
      description: 'Read the latest blog posts by Ataullah Mesbah.',
      images: ['/images/og-blog.jpg'],
    },
  };
}

export default function BlogPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}