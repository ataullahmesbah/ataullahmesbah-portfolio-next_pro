import FreaturedStory from '@/app/components/Share/FreaturedStory/FreaturedStory'; // Note: Fix typo if it’s "Freatured" vs "Featured"
import Image from 'next/image';
import Link from 'next/link';
import { FiEye, FiArrowRight } from "react-icons/fi";

import { Suspense } from 'react';
import Loader from '@/app/components/Loader/Loader';

// Fetch blogs and categories from the API
async function getBlogs(page = 1, limit = 6) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog?page=${page}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return res.json();
}

async function getCategories() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/categories`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categories = await res.json();
  return Array.isArray(categories) ? categories : [];
}

// Main content component
async function BlogContent({ page, limit }) {
  const data = await getBlogs(page, limit);
  const categories = await getCategories();

  const { blogs, currentPage, totalPages } = data;

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
        <aside className="col-span-12 sm:col-span-4 md:col-span-3 lg:col-span-2 p-4 rounded-lg lg:sticky top-0 max-h-screen overflow-y-auto">
          <h2 className="poppins-regular text-lg sm:text-xl font-semibold mb-4 text-gray-200">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="text-blue-300 hover:text-purple-300 text-sm sm:text-base">
                <Link href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className="col-span-12 sm:col-span-8 md:col-span-9 lg:col-span-10">
          {/* Test FreaturedStory in isolation */}
          <div className="mb-4 sm:mb-6">
            <FreaturedStory />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {blogs.map((blog) => {
              const metaDescription = blog.metaDescription?.slice(0, 100) + (blog.metaDescription?.length > 100 ? '...' : '');
              const category = blog.categories && blog.categories.length > 0 ? blog.categories[0] : 'Uncategorized';

              return (
                <div
                  key={blog.slug}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700 flex flex-col"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 w-full">
                    <Image
                      src={blog.mainImage}
                      alt={blog.title}
                      layout="fill"
                      objectFit="cover"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-grow">
                    <div className="mb-2">
                      <span className="inline-block px-2 py-1 text-xs bg-purple-500/10 border-purple-600/20 text-purple-300 rounded-full">
                        {category}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 line-clamp-2">
                      <Link href={`/blog/${blog.slug}`} className="text-white hover:text-purple-300 transition-colors">
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

          <div className="mt-6 sm:mt-8 flex justify-center items-center space-x-2">
            <Link
              href={`/blog?page=${currentPage - 1}`}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 ${currentPage === 1
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              aria-disabled={currentPage === 1}
            >
              Previous
            </Link>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 ${currentPage === pageNum
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>
            <Link
              href={`/blog?page=${currentPage + 1}`}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-300 ${currentPage === totalPages
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              aria-disabled={currentPage === totalPages}
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
  title: 'Blog - Ataullah Mesbah',
  description: 'Explore the latest blog posts on AI, quantum computing, and more.',
};

// Simplified BlogList with Suspense
export default function BlogList({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = 6;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 sm:p-6 md:p-6 lg:p-8 min-h-screen relative">
      <Suspense fallback={<Loader />}>
        <BlogContent page={page} limit={limit} />
      </Suspense>
    </div>
  );
}