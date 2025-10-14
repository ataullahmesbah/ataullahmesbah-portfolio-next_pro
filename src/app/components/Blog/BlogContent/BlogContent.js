// app/components/Blog/BlogContent.jsx

import BlogGrid from "../BlogGrid/BlogGrid";
import BlogHeader from "../BlogHeader/BlogHeader";
import BlogSidebar from "../BlogSidebar/BlogSidebar";


async function getBlogData(page = 1) {
    try {
        console.log('📡 Fetching blog data for page:', page);

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const [blogsRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/blog?page=${page}&limit=9`, {
                next: { revalidate: 3600 }
            }),
            fetch(`${baseUrl}/api/blog/categories`, {
                next: { revalidate: 86400 }
            })
        ]);

        console.log('📊 Blogs response status:', blogsRes.status);
        console.log('📊 Categories response status:', categoriesRes.status);

        if (!blogsRes.ok) {
            throw new Error(`Blogs API failed with status: ${blogsRes.status}`);
        }

        const blogsData = await blogsRes.json();
        const categories = await categoriesRes.json();

        console.log('✅ Blog data received:', {
            blogsCount: blogsData.blogs?.length || 0,
            categoriesCount: categories?.length || 0,
            success: blogsData.success
        });

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

    // Schema for SEO
    const schemaData = {
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
                    "image": blog.mainImage,
                    "url": `https://ataullahmesbah.com/blog/${blog.slug}`,
                    "author": {
                        "@type": "Person",
                        "name": "Ataullah Mesbah"
                    }
                }
            }))
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <BlogHeader
                    totalBlogs={blogs.length}
                    currentPage={currentPage}
                    error={error}
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <BlogSidebar
                            categories={categories}
                            currentCategory={null}
                        />
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                        <BlogGrid
                            blogs={blogs}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            error={error}
                        />
                    </main>
                </div>
            </div>
        </>
    );
}