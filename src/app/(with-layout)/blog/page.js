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
        background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
      }}
    >


      <div className="container mx-auto px-4 py-8">
       <div className="text-center py-5 text-xl amsfonts text-white space-y-2">

        <p className='text-sky-300'>Blog</p>
        <p className='text-2xl'>The <span className='text-sky-300'>Latest</span> About Team Ataullah Mesbah</p>

       </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto py-10">
          {blogs.map((blog) => (
            <article key={blog.slug} className="border rounded-lg overflow-hidden shadow-lg">

           
              <Image
                src={blog.mainImage}
                alt={blog.title}
                width={500}
                height={500}
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
    </div>
  );
}