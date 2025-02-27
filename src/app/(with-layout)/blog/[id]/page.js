import Image from 'next/image';
import { notFound } from 'next/navigation';
import Head from 'next/head';

export async function generateStaticParams() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch blogs');
        const blogs = await res.json();
        return blogs.map(blog => ({ id: blog._id.toString() }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${params.id}`, { cache: 'no-store' });
        if (!res.ok) return { title: 'Blog Not Found' };
        const blog = await res.json();
        return {
            title: `${blog.title} | My Blog`,
            description: blog.metaDescription,
            keywords: blog.tags?.join(', ') || 'blog, article, news',
            openGraph: {
                title: blog.title,
                description: blog.metaDescription,
                images: blog.content.filter(item => item.type === 'image').map(img => ({ url: img.src })),
            },
            twitter: {
                card: 'summary_large_image',
                title: blog.title,
                description: blog.metaDescription,
                images: blog.content.filter(item => item.type === 'image').map(img => img.src)[0] || '',
            },
        };
    } catch {
        return { title: 'Blog Not Found' };
    }
}

export default async function BlogDetails({ params }) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blogs/${params.id}`, { cache: 'no-store' });
        if (!res.ok) notFound();
        const blog = await res.json();

        return (
            <main className="p-6 space-y-4">
                <Head>
                    <title>{blog.title} | My Blog</title>
                    <meta name="description" content={blog.metaDescription} />
                    <meta property="og:title" content={blog.title} />
                    <meta property="og:description" content={blog.metaDescription} />
                    {blog.content.filter(item => item.type === 'image').map((img, index) => (
                        <meta key={index} property="og:image" content={img.src} />
                    ))}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={blog.title} />
                    <meta name="twitter:description" content={blog.metaDescription} />
                    <meta name="twitter:image" content={blog.content.filter(item => item.type === 'image').map(img => img.src)[0] || ''} />
                </Head>
                <h1 className="text-3xl font-bold">{blog.title}</h1>
                <div className="space-y-4">
                    {blog.content.map((item, index) => (
                        item.type === 'image' ? (
                            <Image
                                key={index}
                                src={item.src}
                                alt={item.alt}
                                width={1200}
                                height={630}
                                className="w-full h-64 object-cover rounded-lg"
                                priority
                            />
                        ) : (
                            <div key={index} dangerouslySetInnerHTML={{ __html: item.value }} />
                        )
                    ))}
                </div>
                <footer className="text-gray-500 text-sm">
                    Published on: {new Date(blog.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </footer>
            </main>
        );
    } catch {
        notFound();
    }
}