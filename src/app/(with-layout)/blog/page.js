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

  const blogs = await res.json();
  console.log('Fetched Blogs:', blogs); // Debugging: Log fetched data
  return blogs;
}

// Fetch categories from the API
// Fetch categories from the API
async function getCategories() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/categories`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch categories. Status:", res.status);
    throw new Error('Failed to fetch categories');
  }

  const categories = await res.json();
  console.log('Fetched Categories:', categories); // Debugging: Log fetched data

  // Ensure categories is an array
  if (!Array.isArray(categories)) {
    console.error("Categories is not an array:", categories);
    return [];
  }

  return categories;
}

export const metadata = {
  title: 'Blog Posts - My Website',
  description: 'Explore the latest blog posts on AI, quantum computing, and more.',
};

export default async function BlogList() {
  const blogs = await getBlogs();
  const categories = await getCategories(); // Fetch categories dynamically

  return (
    <div className='bg-sky-50 min-h-screen'>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Fixed Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5 sticky top-0 h-screen overflow-y-auto">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((category, index) => (
                <li key={index} className="text-gray-800 hover:text-blue-700">
                  <Link href={`/blog/category/${category.toLowerCase().replace(/ /g, '-')}`}>
                    {category}
                  </Link>

                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 lg:w-4/5">
          <div className=''>
            <FreaturedStory />
          </div>

          <div className="py-5 text-xl amsfonts text-gray-800 space-y-2">
            <p className='text-blue-700'>Blog</p>
            <p className='text-2xl'>The <span className='text-blue-700'>Latest</span> About Team Ataullah Mesbah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => {
              // Clean up the publishDate value or use a fallback if it's missing
              const cleanPublishDate = blog.publishDate ? blog.publishDate.replace(/\.\d+$/, '') : new Date().toISOString();
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
              }).format(new Date(cleanPublishDate));

              return (
                <article key={blog.slug} className="rounded-lg overflow-hidden shadow-sm bg-gray-50 px-2">
                  <Image
                    src={blog.mainImage}
                    alt={blog.title}
                    width={450}
                    height={250}
                    className="w-full rounded-md h-48 object-cover"
                    priority
                  />

                  <div className='py-8 rounded-b-md'>
                    <div className='flex gap-2 items-center py-3 font-semibold'>
                      <p className="text-gray-800">
                        {formattedDate}
                      </p>
                      <GoDotFill />
                      <p>News</p>
                      <GoDotFill />
                      <p>3min</p>
                    </div>
                    <div className="mt-2">
                      <Link href={`/blog/${blog.slug}`}>
                        <h2 className="text-xl font-semibold text-blue-950">{blog.title}</h2>
                      </Link>
                      <p className="mt-2 text-gray-500">{blog.shortDescription}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}