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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <article key={blog.slug} className="border rounded-lg overflow-hidden shadow-lg">
            <Image
              src={blog.mainImage}
              alt={blog.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
              priority
            />
            <div className="p-4">
              <Link href={`/blog/${blog.slug}`}>
                <h2 className="text-xl font-semibold hover:text-blue-600">{blog.title}</h2>
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
  );
}