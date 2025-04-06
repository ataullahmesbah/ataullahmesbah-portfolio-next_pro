// app/components/Travel/LoadingSkeleton.jsx


export default function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Hero Skeleton */}
                <div className="h-80 bg-gray-800 rounded-lg animate-pulse"></div>

                {/* Tabs Skeleton */}
                <div className="flex gap-4">
                    <div className="h-12 w-32 bg-gray-800 rounded animate-pulse"></div>
                    <div className="h-12 w-32 bg-gray-800 rounded animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}