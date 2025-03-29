import FreaturedStory from '@/app/components/Share/FreaturedStory/FreaturedStory';
import Image from 'next/image';
import Link from 'next/link';
import { FiEye, FiArrowRight } from "react-icons/fi";

// Fetch blogs and categories from the API
async function getBlogs(page = 1, limit = 6) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog?page=${page}&limit=${limit}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return res.json();
}

// Fetch categories from the API
async function getCategories() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/categories`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  const categories = await res.json();
  return Array.isArray(categories) ? categories : [];
}

export const metadata = {
  title: 'Blog Posts - Ataullah Mesbah',
  description: 'Explore the latest blog posts on AI, quantum computing, and more.',
};

export default async function BlogList({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = 6; // Blogs per page

  let data = { blogs: [], totalBlogs: 0, currentPage: 1, totalPages: 1 };
  let categories = [];
  let error = null;

  try {
    data = await getBlogs(page, limit);
    categories = await getCategories();
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="bg-gray-50 container mx-auto p-4 min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!data.blogs || data.blogs.length === 0) {
    return (
      <div className="bg-gray-50 container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { blogs, currentPage, totalPages } = data;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="container mx-auto">
        <p className="text-2xl sm:text-3xl font-bold mt-8 px-5 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
          Blog
        </p>

        {/* Grid Layout with 12 columns */}
        <div className="py-8 grid grid-cols-12 gap-6 sm:gap-8">
          {/* Sidebar (3 cols on md+) */}
          <aside className="col-span-12 md:col-span-3 lg:col-span-3 p-4 rounded-lg sticky top-0 max-h-screen overflow-y-auto">
            <h2 className="text-base font-semibold mb-4 text-gray-200">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index} className="text-purple-400 hover:text-purple-300">
                  <Link href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}>
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content (9 cols on md+) */}
          <main className="col-span-12 md:col-span-9 lg:col-span-9">
            <div className="mb-6">
              <FreaturedStory />
            </div>

            {/* Blog Posts Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {blogs.map((blog) => {
                const metaDescription = blog.metaDescription?.slice(0, 100) + (blog.metaDescription?.length > 100 ? '...' : '');
                const category = blog.categories && blog.categories.length > 0 ? blog.categories[0] : 'Uncategorized';

                return (
                  <div
                    key={blog.slug}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-700"
                  >
                    {/* 1st: Image */}
                    <div className="relative h-56 sm:h-64 w-full">
                      <Image
                        src={blog.mainImage}
                        alt={blog.title}
                        layout="fill"
                        objectFit="cover"
                        className="w-full h-full"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5">
                      {/* Category Badge */}
                      <div className="mb-2">
                        <span className="inline-block px-2 py-1 text-xs bg-purple-500/10 border-purple-600/20 text-purple-300 rounded-full">
                          {category}
                        </span>
                      </div>

                      {/* 2nd: Title */}
                      <h2 className="text-lg sm:text-xl font-bold mb-2 line-clamp-2">
                        <Link href={`/blog/${blog.slug}`} className="text-white hover:text-purple-300 transition-colors">
                          {blog.title}
                        </Link>
                      </h2>

                      {/* 3rd: Meta Description */}
                      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {metaDescription}
                      </p>

                      {/* 4th: Footer (Views + View Blog) */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-700">
                        <div className="flex items-center text-sm text-gray-400">
                          <FiEye className="mr-1" />
                          <span>{blog.views || 0}</span>
                        </div>
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
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

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center space-x-2">
              {/* Previous Button */}
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${currentPage === 1
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                aria-disabled={currentPage === 1}
              >
                Previous
              </Link>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    {pageNum}
                  </Link>
                ))}
              </div>

              {/* Next Button */}
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${currentPage === totalPages
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
    </div>
  );
}