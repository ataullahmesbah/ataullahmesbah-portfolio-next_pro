// app/(with-layout)/blog/category/[category]/page.js
import BlogSkeleton from '@/app/components/Blog/BlogSkeleton/BlogSkeleton';
import CategoryContent from '@/app/components/Blog/CategoryContent/CategoryContent';
import { Suspense } from 'react';


export async function generateMetadata({ params }) {
  const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');

  return {
    title: `${categoryName} Blogs | Ataullah Mesbah`,
    description: `Explore ${categoryName} blog posts by Ataullah Mesbah. Discover insights and latest updates in ${categoryName}.`,
    openGraph: {
      title: `${categoryName} Blogs - Ataullah Mesbah`,
      description: `Discover ${categoryName} insights and blog posts by Ataullah Mesbah.`,
      url: `https://ataullahmesbah.com/blog/category/${params.category}`,
      type: 'website',
    },
  };
}

export default function CategoryPage({ params, searchParams }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Suspense fallback={<BlogSkeleton />}>
        <CategoryContent params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}