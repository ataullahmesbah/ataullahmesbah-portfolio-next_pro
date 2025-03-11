import FreaturedStory from '@/app/components/Share/FreaturedStory/FreaturedStory';
import Image from 'next/image';
import Link from 'next/link';
import { GoDotFill } from "react-icons/go";

// Fetch blogs and categories from the API
async function getBlogs() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog`, {
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

export default async function BlogList() {
  const blogs = await getBlogs();
  const categories = await getCategories();

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

              return (
                <article key={blog.slug} className="rounded-lg overflow-hidden shadow-sm p-2 bg-white">
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
                      <p>News</p>
                      <GoDotFill />
                      <p>3 min read</p>
                    </div>
                    <div className="mt-3">
                      <Link href={`/blog/${blog.slug}`}>
                        <h2 className="text-xl font-semibold text-black">{blog.title}</h2>
                      </Link>
                      <p className="mt-2 text-gray-700">{blog.shortDescription}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

      </div>
    </div>
  );
}


// abcd
