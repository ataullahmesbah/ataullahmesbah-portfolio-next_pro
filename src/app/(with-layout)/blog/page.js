import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { FiEye, FiArrowRight } from "react-icons/fi";
import { Suspense } from 'react';

// Dynamically import components with loading states
const FreaturedStory = dynamic(
  () => import('@/app/components/Share/FreaturedStory/FreaturedStory'),
  {
    loading: () => <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />,
    ssr: false
  }
);

// Cache configuration
const revalidate = 3600; // Revalidate data every hour

// Parallel data fetching
async function getData(page = 1, limit = 6) {
  try {
    const [blogsRes, categoriesRes] = await Promise.all([
      fetch(`${process.env.NEXTAUTH_URL}/api/blog?page=${page}&limit=${limit}`, {
        next: { revalidate }
      }),
      fetch(`${process.env.NEXTAUTH_URL}/api/blog/categories`, {
        next: { revalidate: 86400 } // Categories change less frequently
      })
    ]);

    if (!blogsRes.ok || !categoriesRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const blogsData = await blogsRes.json();
    const categories = await categoriesRes.json();

    return {
      blogs: blogsData.blogs,
      currentPage: blogsData.currentPage,
      totalPages: blogsData.totalPages,
      categories: Array.isArray(categories) ? categories : []
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return { blogs: [], currentPage: 1, totalPages: 1, categories: [] };
  }
}

// Blog card skeleton for loading state
const BlogCardSkeleton = () => (
  <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
    <div className="h-48 sm:h-56 md:h-64 w-full bg-gray-700 animate-pulse" />
    <div className="p-4 sm:p-5 space-y-3">
      <div className="h-4 w-20 bg-gray-700 rounded-full" />
      <div className="h-6 w-full bg-gray-700 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-700 rounded" />
        <div className="h-3 w-4/5 bg-gray-700 rounded" />
      </div>
      <div className="flex justify-between pt-3 border-t border-gray-700">
        <div className="h-4 w-16 bg-gray-700 rounded" />
        <div className="h-4 w-16 bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

// Main content component
async function BlogContent({ page, limit }) {
  const { blogs, currentPage, totalPages, categories } = await getData(page, limit);

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-gray-50 container mx-auto p-4 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">No blogs available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-6 sm:mt-8 px-4 sm:px-5 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
        Blog
      </p>

      <div className="py-6 sm:py-8 grid grid-cols-12 gap-4 sm:gap-6 md:gap-8">
        <aside className="col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-2 p-4 rounded-lg lg:sticky top-0 self-start">
          <h2 className="poppins-regular text-lg sm:text-xl font-semibold mb-4 text-gray-200">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="text-blue-200 hover:text-purple-300 uppercase text-sm sm:text-base">
                <Link
                  href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}
                  prefetch={false}
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="col-span-12 sm:col-span-8 md:col-span-9 lg:col-span-10">
          <div className="mb-4 sm:mb-6">
            <FreaturedStory />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {blogs.map((blog, index) => {
              const metaDescription = blog.metaDescription?.slice(0, 100) + (blog.metaDescription?.length > 100 ? '...' : '');
              const category = blog.categories?.[0] || 'Uncategorized';

              return (
                <div
                  key={blog.slug}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 flex flex-col"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 w-full">
                    <Image
                      src={blog.mainImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover"
                      priority={index < 3} // Only prioritize first few images
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs bg-purple-500/10 border-purple-600/20 text-purple-300 rounded-full">
                        {category}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 line-clamp-2">
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="text-white hover:text-purple-300 transition-colors"
                        prefetch={false}
                      >
                        {blog.title}
                      </Link>
                    </h2>
                    <p className="text-gray-300 text-xs sm:text-sm mb-4 line-clamp-3 flex-grow">
                      {metaDescription}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-700">
                      <div className="flex items-center text-xs sm:text-sm text-gray-400">
                        <FiEye className="mr-1" />
                        <span>{blog.views || 0}</span>
                      </div>
                      <Link
                        href={`/blog/${blog.slug}`}
                        className="flex items-center text-xs sm:text-sm text-purple-400 hover:text-purple-300 transition-colors"
                        prefetch={false}
                      >
                        View Blog
                        <FiArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Simplified pagination for large result sets */}
          <div className="mt-6 sm:mt-8 flex justify-center items-center space-x-2">
            <Link
              href={`/blog?page=${currentPage - 1}`}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 ${currentPage === 1
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              aria-disabled={currentPage === 1}
              prefetch={false}
            >
              Previous
            </Link>

            {totalPages > 5 ? (
              <span className="px-3 py-2 text-gray-300 text-sm">
                Page {currentPage} of {totalPages}
              </span>
            ) : (
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 ${currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    prefetch={false}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>
            )}

            <Link
              href={`/blog?page=${currentPage + 1}`}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 ${currentPage === totalPages
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              aria-disabled={currentPage === totalPages}
              prefetch={false}
            >
              Next
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Blog | Ataullah Mesbah',
  description: 'Explore the latest blog posts on AI, quantum computing, web development, and more by Ataullah Mesbah.',
  keywords: 'blog, Ataullah Mesbah, AI, quantum computing, web development, technology, insights',
  authors: [{ name: 'Ataullah Mesbah' }],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Blog - Ataullah Mesbah',
    description: 'Discover insights on AI, quantum computing, web development, and more through Ataullah Mesbah’s blog posts.',
    url: 'https://ataullahmesbah.com/blog',
    type: 'website',
    siteName: 'Ataullah Mesbah',
    images: [{ url: 'https://ataullahmesbah.com/images/og-blog.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Ataullah Mesbah',
    description: 'Read the latest blog posts by Ataullah Mesbah on AI, quantum computing, and web development.',
    images: ['https://ataullahmesbah.com/images/og-blog.jpg'],
  },
};

export default function BlogList({ searchParams }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Blog - Ataullah Mesbah",
    "description": "Explore the latest blog posts on AI, quantum computing, web development, and more by Ataullah Mesbah.",
    "url": "https://ataullahmesbah.com/blog",
    "publisher": {
      "@type": "Organization",
      "name": "Ataullah Mesbah",
      "url": "https://ataullahmesbah.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "info@ataullahmesbah.com",
        "contactType": "Customer Support"
      }
    },
    "lastReviewed": "2025-05-18"
  };

  const page = parseInt(searchParams.page) || 1;
  const limit = 6;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 sm:p-6 md:p-6 lg:p-8 min-h-screen relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Suspense fallback={
        <div className="container mx-auto py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        </div>
      }>
        <BlogContent page={page} limit={limit} />
      </Suspense>
    </div>
  );
}