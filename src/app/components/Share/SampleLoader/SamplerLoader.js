// components/Share/Loading/Loading.jsx
export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto py-20 text-center">
            <div className="h-8 w-8 mx-auto border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-400">Loading testimonials...</p>
        </div>
    );
}