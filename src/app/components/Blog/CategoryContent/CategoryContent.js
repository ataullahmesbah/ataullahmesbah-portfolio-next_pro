// app/components/Blog/CategoryContent.jsx

import Link from 'next/link';
import { GoArrowLeft } from 'react-icons/go';
import BlogSidebar from '../BlogSidebar/BlogSidebar';
import BlogGrid from '../BlogGrid/BlogGrid';


async function getCategoryData(category, page = 1) {
    try {
        console.log('📡 Fetching category data:', { category, page });

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const [categoryRes, categoriesRes] = await Promise.all([
            fetch(`${baseUrl}/api/blog/categories/${category}?page=${page}&limit=9`, {
                next: { revalidate: 3600 }
            }),
            fetch(`${baseUrl}/api/blog/categories`, {
                next: { revalidate: 86400 }
            })
        ]);

        console.log('📊 Category response status:', categoryRes.status);

        if (!categoryRes.ok) {
            throw new Error(`Category API failed with status: ${categoryRes.status}`);
        }

        const categoryData = await categoryRes.json();
        const categories = await categoriesRes.json();

        console.log('✅ Category data received:', {
            blogsCount: categoryData.blogs?.length || 0,
            total: categoryData.total || 0,
            success: categoryData.success
        });

        return {
            blogs: categoryData.blogs || [],
            total: categoryData.total || 0,
            currentPage: categoryData.currentPage || 1,
            totalPages: categoryData.totalPages || 1,
            categories: Array.isArray(categories) ? categories : [],
            error: categoryData.error || null
        };
    } catch (error) {
        console.error('❌ Error in getCategoryData:', error);
        return {
            blogs: [],
            total: 0,
            currentPage: 1,
            totalPages: 1,
            categories: [],
            error: error.message
        };
    }
}

export default async function CategoryContent({ params, searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const { blogs, total, currentPage, totalPages, categories, error } = await getCategoryData(params.category, page);
    const categoryName = decodeURIComponent(params.category).replace(/-/g, ' ');

    // Schema for SEO
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": `${categoryName} Blogs - Ataullah Mesbah`,
        "description": `Explore ${categoryName} blog posts by Ataullah Mesbah.`,
        "url": `https://ataullahmesbah.com/blog/category/${params.category}`,
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
                    "articleSection": categoryName,
                    "url": `https://ataullahmesbah.com/blog/${blog.slug}`
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
                {/* Back Navigation */}
                <div className="mb-6" data-aos="fade-right">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group"
                        prefetch={false}
                    >
                        <GoArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to All Blogs
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-8" data-aos="fade-down">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
                        {categoryName}
                    </h1>
                    <p className="text-xl text-gray-300">
                        {error ? (
                            <span className="text-red-400">Error loading category</span>
                        ) : (
                            `Found ${total} blog${total !== 1 ? 's' : ''} in ${categoryName}`
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <BlogSidebar
                            categories={categories}
                            currentCategory={params.category}
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