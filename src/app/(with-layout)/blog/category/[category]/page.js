//src/app/(with-layout)/blog/category/[category]/page.js
import Link from 'next/link';
import { GoDotFill } from "react-icons/go";

export async function generateMetadata({ params }) {
    return {
        title: `${params.category} Blogs - My Website`,
        description: `Explore the latest blogs in the ${params.category} category.`,
    };
}

export default async function CategoryPage({ params, searchParams }) {
    const page = searchParams.page || 1; // Get the current page from query params
    const limit = 10; // Number of blogs per page

    // Fetch blogs filtered by category from the API
    const res = await fetch(
        `${process.env.NEXTAUTH_URL}/api/blog/categories/${params.category}?page=${page}&limit=${limit}`,
        {
            cache: 'no-store',
        }
    );

    if (!res.ok) {
        throw new Error('Failed to fetch blogs');
    }

    const { blogs, total } = await res.json();

    if (!blogs || blogs.length === 0) {
        return (
            <div className='bg-sky-50 min-h-screen'>
                <div className="container mx-auto px-4 py-8">
                    <div className="py-5 text-xl amsfonts text-gray-800 space-y-2">
                        <p className='text-blue-700'>Category</p>
                        <p className='text-2xl'>No blogs found in <span className='text-blue-700'>{params.category}</span></p>
                    </div>
                </div>
            </div>
        );
    }

    const totalPages = Math.ceil(total / limit); // Calculate total pages for pagination

    return (
        <div className=' max-w-5xl mx-auto'>
            <div className="container mx-auto px-4 py-8">
                <div className="py-5 text-xl amsfonts text-gray-800 space-y-2">

                    <p className='text-2xl uppercase'>Blogs in <span className='text-blue-700'>{params.category}</span></p>
                </div>

                <div className="space-y-6">
                    {blogs.map((blog) => {
                        // Format the publish date
                        const formattedDate = new Intl.DateTimeFormat('en-US', {
                            weekday: 'long', // "Thursday"
                            month: 'long',   // "March"
                            day: '2-digit',  // "06"
                            year: 'numeric'  // "2025"
                        }).format(new Date(blog.publishDate));

                        return (
                            <article key={blog.slug} className="rounded-lg overflow-hidden shadow-sm bg-gray-50 px-4 py-6 flex justify-between items-center border-b border-b-gray-300">

                                <div className="mt-2">
                                    <Link href={`/blog/${blog.slug}`}>
                                        <h2 className="text-xl font-semibold text-blue-950 hover:text-blue-700">{blog.title}</h2>
                                    </Link>
                                    <p className="mt-2 text-gray-500">{blog.shortDescription}</p>
                                </div>

                                <div className="">
                                    <p className="text-gray-800">
                                        {formattedDate}
                                    </p>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <Link
                                key={i + 1}
                                href={`/blog/category/${params.category}?page=${i + 1}`}
                                className={`px-4 py-2 rounded-md ${i + 1 === Number(page)
                                    ? 'bg-blue-700 text-white'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                            >
                                {i + 1}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}