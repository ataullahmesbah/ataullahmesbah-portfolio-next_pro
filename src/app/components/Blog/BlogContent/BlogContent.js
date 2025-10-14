// app/components/Blog/BlogContent.jsx

import BlogGrid from "../BlogGrid/BlogGrid";
import BlogHeader from "../BlogHeader/BlogHeader";
import BlogSidebar from "../BlogSidebar/BlogSidebar";

async function getBlogData(page = 1) {
    try {
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const limit = 9;

        const [blogsRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/blog?page=${page}&limit=${limit}`, {
                next: {
                    revalidate: 3600,
                    tags: ['blogs', `page-${page}`]
                }
            }),
            fetch(`${baseUrl}/api/blog/categories`, {
                next: {
                    revalidate: 86400,
                    tags: ['categories']
                }
            })
        ]);

        if (!blogsRes.ok) {
            throw new Error(`Blogs API failed with status: ${blogsRes.status}`);
        }

        const blogsData = await blogsRes.json();
        const categories = await categoriesRes.json();

        return {
            blogs: blogsData.blogs || [],
            currentPage: blogsData.currentPage || 1,
            totalPages: blogsData.totalPages || 1,
            categories: Array.isArray(categories) ? categories : [],
            error: blogsData.error || null
        };
    } catch (error) {
        console.error('❌ Error in getBlogData:', error);
        return {
            blogs: [],
            currentPage: 1,
            totalPages: 1,
            categories: [],
            error: error.message
        };
    }
}

export default async function BlogContent({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const { blogs, currentPage, totalPages, categories, error } = await getBlogData(page);

    // Enhanced Schema for SEO
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ataullah Mesbah Blog",
        "description": "Technology blog featuring AI, quantum computing, and web development insights",
        "url": "https://ataullahmesbah.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://ataullahmesbah.com/blog?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `Blog - Page ${currentPage} | Ataullah Mesbah`,
        "description": "Explore the latest blog posts on AI, quantum computing, web development, and more by Ataullah Mesbah.",
        "url": `https://ataullahmesbah.com/blog?page=${currentPage}`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": blogs.length,
            "itemListElement": blogs.map((blog, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "BlogPosting",
                    "headline": blog.title,
                    "description": blog.metaDescription,
                    "datePublished": blog.publishDate,
                    "dateModified": blog.updatedAt || blog.publishDate,
                    "image": blog.mainImage,
                    "url": `https://ataullahmesbah.com/blog/${blog.slug}`,
                    "author": {
                        "@type": "Person",
                        "name": "Ataullah Mesbah",
                        "url": "https://ataullahmesbah.com/about"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Ataullah Mesbah",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://ataullahmesbah.com/logo.png"
                        }
                    },
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": `https://ataullahmesbah.com/blog/${blog.slug}`
                    }
                }
            }))
        }
    };

    return (
        <>
            {/* Enhanced Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />

            {/* Semantic Main Content */}
            <main itemScope itemType="https://schema.org/Blog">
                <div className="container mx-auto px-4 py-8">

                    {/* Header with proper hierarchy */}
                    <BlogHeader
                        totalBlogs={blogs.length}
                        currentPage={currentPage}
                        error={error}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">

                        {/* Sidebar Section */}
                        <aside className="lg:col-span-1" itemScope itemType="https://schema.org/WPSideBar">
                            <BlogSidebar
                                categories={categories}
                                currentCategory={null}
                            />
                        </aside>

                        {/* Main Content Section */}
                        <div className="lg:col-span-3">
                            <section itemScope itemType="https://schema.org/ItemList">
                                <BlogGrid
                                    blogs={blogs}
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    error={error}
                                />
                            </section>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}