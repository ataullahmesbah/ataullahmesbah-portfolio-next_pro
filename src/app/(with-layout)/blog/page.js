// src/app/blog/page.js
import FreaturedStory from '@/app/components/Share/FreaturedStory/FreaturedStory';
import Image from 'next/image';
import Link from 'next/link';
import { GoDotFill } from "react-icons/go";

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
    <div className="bg-gray-50 container mx-auto p-4">
      <p className="text-4xl font-bold mt-8 px-5">Blog</p>

      {/* Grid Layout with 12 columns */}
      <div className="bg-gray-50 container mx-auto px-2 py-8 grid grid-cols-12 gap-8">
        {/* Sidebar (1/3 - 4 cols) */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-4 p-4 rounded-lg sticky top-0 h-screen overflow-y-auto">
          <h2 className="text-base font-semibold mb-4">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category, index) => (
              <li key={index} className="text-blue-600 hover:text-blue-700">
                <Link href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}>
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content (2/3 - 8 cols) */}
        <main className="col-span-12 md:col-span-8 lg:col-span-8">
          <div className="mb-6">
            <FreaturedStory />
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {blogs.map((blog) => {
              const cleanPublishDate = blog.publishDate ? blog.publishDate.replace(/\.\d+$/, '') : new Date().toISOString();
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              }).format(new Date(cleanPublishDate));

              const category = blog.categories && blog.categories.length > 0 ? blog.categories[0] : 'Uncategorized';
              const readTime = blog.readTime || 1; // Fallback to 1 min if readTime is missing

              return (
                <article key={blog.slug} className="rounded-lg overflow-hidden shadow-sm p-2 bg-white hover:shadow-md transition-shadow duration-300">
                  <Image
                    src={blog.mainImage}
                    alt={blog.title}
                    width={450}
                    height={250}
                    className="w-full rounded-md h-80 object-cover"
                    priority
                  />
                  <div className="py-6">
                    <div className="flex gap-2 items-center text-sm text-gray-600">
                      <p>{formattedDate}</p>
                      <GoDotFill />
                      <p>{category}</p>
                      <GoDotFill />
                      <p>{readTime} min read</p>
                    </div>
                    <div className="mt-3">
                      <Link href={`/blog/${blog.slug}`}>
                        <h2 className="text-xl font-semibold text-black hover:text-blue-600 transition-colors duration-300">{blog.title}</h2>
                      </Link>
                      <p className="mt-2 text-gray-700">{blog.shortDescription}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center space-x-2">
            {/* Previous Button */}
            <Link
              href={`/blog?page=${currentPage - 1}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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