// app/components/Blog/BlogSkeleton.js
export default function BlogSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="text-center mb-8">
                <div className="h-12 bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Skeleton */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                        <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
                        <div className="space-y-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-8 bg-gray-700 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 animate-pulse">
                                <div className="h-48 bg-gray-700 w-full"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                                    <div className="h-6 bg-gray-700 rounded w-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-700 rounded w-full"></div>
                                        <div className="h-3 bg-gray-700 rounded w-4/5"></div>
                                    </div>
                                    <div className="flex justify-between pt-3 border-t border-gray-700">
                                        <div className="h-4 bg-gray-700 rounded w-16"></div>
                                        <div className="h-4 bg-gray-700 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}