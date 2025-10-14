// app/components/Blog/Pagination.jsx
import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, basePath }) {
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    let prev = 0;
    for (const i of range) {
      if (i - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <nav className="flex items-center space-x-1">
      {/* Previous Button */}
      <Link
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          currentPage === 1
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700 transform hover:-translate-y-0.5'
        }`}
        aria-disabled={currentPage === 1}
        prefetch={false}
      >
        Previous
      </Link>

      {/* Page Numbers */}
      {getPageNumbers().map((pageNum, index) =>
        pageNum === '...' ? (
          <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <Link
            key={pageNum}
            href={`${basePath}?page=${pageNum}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              currentPage === pageNum
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
            prefetch={false}
          >
            {pageNum}
          </Link>
        )
      )}

      {/* Next Button */}
      <Link
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
          currentPage === totalPages
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700 transform hover:-translate-y-0.5'
        }`}
        aria-disabled={currentPage === totalPages}
        prefetch={false}
      >
        Next
      </Link>
    </nav>
  );
}