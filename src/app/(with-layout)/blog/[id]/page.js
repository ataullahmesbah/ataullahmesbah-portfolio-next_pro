import Image from 'next/image';
import { notFound } from 'next/navigation';
import Head from 'next/head';

export async function generateStaticParams() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
    const blogs = await res.json();
    return blogs.map(blog => ({ id: blog._id.toString() }));
}

export async function generateMetadata({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${params.id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Blog Not Found' };
    const blog = await res.json();
    return {
        title: `${blog.title} | My Blog`,
        description: blog.metaDescription,
    };
}

export default async function BlogDetails({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${params.id}`, { cache: 'no-store' });
    if (!res.ok) notFound();
    const blog = await res.json();

    // Fetch latest 3 blogs
    const latestRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
    const latestBlogs = (await latestRes.json()).slice(0, 3);

    // Get unique categories
    const categories = [...new Set(latestBlogs.map(blog => blog.category))];

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Side - Blog Details */}
                <div className="lg:col-span-3">
                    <h1 className="text-3xl font-bold mb-6">{blog.title}</h1>
                    {blog.image && (
                        <div className="space-y-4">
                            {blog.image.map((img, index) => (
                                <Image
                                    key={index}
                                    src={img}
                                    alt={`${blog.title} - Image ${index + 1}`}
                                    width={1200}
                                    height={630}
                                    className="w-full h-64 object-cover rounded-lg"
                                    priority
                                />
                            ))}
                        </div>
                    )}
                    <article className="prose lg:prose-xl max-w-none mt-6">
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </article>
                </div>

                {/* Right Side - Latest Blogs + Categories */}
                <div className="lg:col-span-1">
                    {/* Latest 3 Blogs */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4">Latest Blogs</h2>
                        {latestBlogs.map((blog) => (
                            <div key={blog._id} className="mb-4">
                                <Link href={`/blog/${blog._id}`} legacyBehavior>
                                    <a className="text-blue-500 underline">{blog.title}</a>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Categories */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Categories</h2>
                        {categories.map((category) => (
                            <div key={category} className="mb-2">
                                <Link href={`/blog/category/${category.toLowerCase()}`} legacyBehavior>
                                    <a className="text-blue-500 underline">{category}</a>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}