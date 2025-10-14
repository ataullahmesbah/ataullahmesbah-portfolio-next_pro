// app/components/Blog/CategoryFilter/CategoryFilter.jsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FiTag } from 'react-icons/fi';

export default function CategoryFilter({ categories, currentCategory }) {
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page') || '1';

    return (
        <div className="space-y-2">
            {/* All Categories Link */}
            <Link
                href="/blog"
                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ${!currentCategory
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                prefetch={false}
            >
                <FiTag className="w-4 h-4 mr-2" />
                All Categories
            </Link>

            {/* Category List */}
            {categories.map((category, index) => {
                const categorySlug = category.toLowerCase().replace(/ /g, '-');
                const isActive = currentCategory === categorySlug;

                return (
                    <Link
                        key={category}
                        href={`/blog/category/${categorySlug}?page=1`}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-300 ${isActive
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        prefetch={false}
                    >
                        <span className="truncate">{category}</span>
                        {/* Optional: Add count if available */}
                        {/* <span className="ml-auto text-xs bg-gray-600 px-1.5 py-0.5 rounded">
              {categoryCount}
            </span> */}
                    </Link>
                );
            })}
        </div>
    );
}