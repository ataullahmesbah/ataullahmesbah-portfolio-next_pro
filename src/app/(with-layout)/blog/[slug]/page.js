// src/app/blog/[slug]/page.js
import Image from 'next/image';
import Script from 'next/script';

async function getBlogBySlug(slug) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/blog/${slug}`, {
        cache: 'no-store',
        headers: {
            'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch blog');
    }

    const blog = await res.json();
    console.log('Fetched Blog:', blog); // Debugging: Log the fetched blog data
    return blog;
}

export async function generateMetadata({ params }) {
    const blog = await getBlogBySlug(params.slug);

    return {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.shortDescription,
        keywords: blog.tags.join(', '),
        openGraph: {
            title: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.shortDescription,
            images: [blog.mainImage],
        },
    };
}

export default async function BlogDetail({ params }) {
    const blog = await getBlogBySlug(params.slug);

    if (!blog) {
        return <div>Blog not found</div>;
    }

    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    const schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blog.title,
        "metaDescription": blog.metaDescription,
        "description": blog.shortDescription,
        "image": blog.mainImage,
        "author": {
            "@type": "Person",
            "name": blog.author || 'Unknown Author', // Use 'author' field
        },
        "datePublished": blog.publishDate,
        "dateModified": blog.publishDate,
        "url": `${siteUrl}/blog/${blog.slug}`,
    };

    const categories = blog.categories || [];
    const author = blog.author || 'Unknown Author';
    const readTime = blog.readTime || 1; // Fallback to 1 min if readTime is missing

    return (
        <div className="bg-gray-50">
            <div className="container max-w-3xl mx-auto px-4 py-8">
                <div>
                    <Script
                        id="schema-markup"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
                    />
                    <div className="md:col-span-2 p-6">
                        <div className="py-5 px-4">
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category, index) => (
                                    <span key={index} className="text-blue-800 text-sm rounded">
                                        {category}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl py-3 poppins-regular">{blog.title}</h1>
                            <div className="flex gap-2 items-center text-sm mb-3">
                                <div className="flex gap-2 items-center">
                                    <p className="text-gray-600">By {author}</p>
                                </div>
                                |
                                <p>Published</p>
                                <p className="text-gray-800">
                                    {new Intl.DateTimeFormat('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: '2-digit',
                                        year: 'numeric'
                                    }).format(new Date(blog.publishDate))}
                                </p>
                                |
                                <p>{readTime} min read</p>
                            </div>
                        </div>
                        <Image
                            src={blog.mainImage}
                            alt={blog.title}
                            width={800}
                            height={400}
                            className="w-full h-64 md:h-96 object-cover rounded-lg"
                            priority
                        />
                        <div className="py-5 px-4 poppins-regular">
                            <p className="mt-4">{blog.metaDescription}</p>
                            <p className="mt-4">{blog.shortDescription}</p>
                            <div className="mt-6 space-y-4">
                                {blog.content.map((item, index) => (
                                    <div key={index}>
                                        {item.type === 'text' && (
                                            <div className="text-gray-800">
                                                {item.data.split(/<br\s*\/?>/).map((text, idx) => (
                                                    <div key={idx} className="mt-3">
                                                        {text}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {item.type === 'image' && (
                                            <Image
                                                src={item.data}
                                                alt={item.alt || blog.title}
                                                width={600}
                                                height={400}
                                                className="w-full h-64 object-cover rounded-lg"
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <h2 className="text-2xl font-bold mt-8">Key Points</h2>
                            <ul className="list-disc list-inside mt-2">
                                {blog.keyPoints.map((point, index) => (
                                    <li key={index} className="">{point}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}