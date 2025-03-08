import Image from 'next/image';
import Link from 'next/link';

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

export const metadata = {
  title: 'Blog Posts - My Website',
  description: 'Explore the latest blog posts on AI, quantum computing, and more.',
};

export default async function BlogList() {
  const blogs = await getBlogs();

  return (
    <div
      className="min-h-screen border-b border-gray-700"
      style={{
        background: 'linear-gradient(to right, #e5e7eb, #e5e7eb 20%, #d1d5db 70%, #9ca3af 100%)',
      }}
    >

      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-5 text-xl amsfonts text-white space-y-2">

          <p className='text-sky-300'>Blog</p>
          <p className='text-2xl'>The <span className='text-sky-300'>Latest</span> About Team Ataullah Mesbah</p>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto py-10">
          {blogs.map((blog) => (
            <article key={blog.slug} className=" rounded-lg overflow-hidden ">


              <Image
                src={blog.mainImage}
                alt={blog.title}
                width={500}
                height={500}
                className="w-full rounded-md h-48 object-cover"
                priority
              />

              <div className='flex  gap-2 items-center py-3 font-semibold'>
                <p className=" text-gray-600">{new Date(blog.publishDate).toLocaleDateString()}</p>
                |
                <p>News</p>
                |
                <p>3min</p>
              </div>
              <div className="mt-2">
                <Link href={`/blog/${blog.slug}`}>
                  <h2 className="text-xl font-semibold text-blue-900 hover:text-purple-600">{blog.title}</h2>
                </Link>
                <p className="mt-2 text-gray-600">{blog.shortDescription}</p>
                <p className="mt-2 text-sm text-gray-500">Author: {blog.writer || 'Unknown Author'}</p>
                <div className="mt-2">
                  <span className="text-sm font-semibold">Categories:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {blog.categories.map((category, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}