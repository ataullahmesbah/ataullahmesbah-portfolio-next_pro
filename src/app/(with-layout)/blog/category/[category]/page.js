// src/app/(with-layout)/blog/category/[category]/page.js
import Link from 'next/link';
import { GoDotFill, GoArrowLeft } from "react-icons/go"; // Added GoArrowLeft

export async function generateMetadata({ params }) {
  return {
    title: `${params.category.replace(/-/g, ' ')} Blogs - My Website`,
    description: `Explore the latest blogs in the ${params.category.replace(/-/g, ' ')} category.`,
  };
}

async function getCategoryBlogs(category, page = 1, limit = 10) {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/blog/categories/${encodeURIComponent(category)}?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 3600 } // Revalidate every hour
      }
    );

    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      return { blogs: null, total: 0, error: 'Failed to fetch blogs' };
    }

    return await res.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { blogs: null, total: 0, error: error.message };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const limit = 10;

  const { blogs, total, error } = await getCategoryBlogs(params.category, page, limit);
  const totalPages = Math.ceil(total / limit);

  if (error) {
    return (
      <div className='bg-sky-50 min-h-screen'>
        <div className="container mx-auto px-4 py-8">
          <div className="py-5 text-xl amsfonts text-gray-800 space-y-2">
            <p className='text-red-600'>Error loading blogs</p>
            <p className='text-lg text-gray-600'>{error}</p>
            <Link href="/blog" className="text-blue-600 hover:underline">
              Return to Blog Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className='bg-sky-50 min-h-screen'>
        <div className="container mx-auto px-4 py-8">
          <div className="py-5 text-xl amsfonts text-gray-800 space-y-2">
            <p className='text-blue-700'>Category</p>
            <p className='text-2xl'>No blogs found in <span className='text-blue-700'>{params.category.replace(/-/g, ' ')}</span></p>
            <Link href="/blog" className="flex items-center text-blue-600 hover:underline">
              <GoArrowLeft className="mr-1" /> Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <div className="container mx-auto px-4 py-8">
        {/* Back button added here */}
        <div className="mb-4">
          <Link href="/blog" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <GoArrowLeft className="mr-1" />
            <span>Back to All Blogs</span>
          </Link>
        </div>

        <div className="py-5 text-xl amsfonts text-gray-800 space-y-2">
          <p className='text-2xl uppercase'>Blogs in <span className='text-blue-700'>{params.category.replace(/-/g, ' ')}</span></p>
        </div>

        <div className="space-y-6">
          {blogs.map((blog) => {
            const formattedDate = new Date(blog.publishDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <article key={blog.slug} className="rounded-lg overflow-hidden shadow-sm bg-gray-50 px-4 py-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-b-gray-300 poppins-regular">
                <div className="mt-2 flex-1">
                  <Link href={`/blog/${blog.slug}`} className="hover:underline">
                    <h2 className="text-xl font-semibold text-black">{blog.title}</h2>
                  </Link>
                  <p className="mt-2 text-gray-500 line-clamp-2">{blog.shortDescription}</p>
                </div>

                <div className="mt-4 md:mt-0">
                  <p className="text-gray-800 whitespace-nowrap">
                    {formattedDate}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Optimized Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <Link
                href={`/blog/category/${params.category}?page=${Math.max(1, page - 1)}`}
                className={`px-4 py-2 rounded-md ${page === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                aria-disabled={page === 1}
              >
                Previous
              </Link>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }

                return (
                  <Link
                    key={pageNum}
                    href={`/blog/category/${params.category}?page=${pageNum}`}
                    className={`px-4 py-2 rounded-md ${pageNum === page
                      ? 'bg-blue-700 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                  >
                    {pageNum}
                  </Link>
                );
              })}

              <Link
                href={`/blog/category/${params.category}?page=${Math.min(totalPages, page + 1)}`}
                className={`px-4 py-2 rounded-md ${page === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                aria-disabled={page === totalPages}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}