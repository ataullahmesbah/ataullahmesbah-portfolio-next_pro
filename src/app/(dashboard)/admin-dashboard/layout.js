'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


import Link from "next/link";

const AdminDashboardLayout = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect if user is not authenticated or not an admin
    if (status === 'unauthenticated' || session?.user?.role !== 'admin') {
        router.push('/');
        return null;
    }

    // Show loading state while checking session
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="admin-dashboard-layout grid grid-cols-12 min-h-screen">
            {/* Sidebar */}
            <div className="col-span-3 bg-gray-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
                <p className='text-xl text-black font-semibold bg-lime-500 text-center rounded-md p-2'>Hello, {session.user.name}!</p>
                <nav className="space-y-3">
                    <Link href="/admin-dashboard" className="block p-2 hover:bg-gray-700 rounded">
                        🏠 Dashboard Home
                    </Link>
                    <Link href="/admin-dashboard/allusers" className="block p-2 hover:bg-gray-700 rounded">
                        👤 All Users
                    </Link>
                    <Link href="/admin-dashboard/addtestimonial" className="block p-2 hover:bg-gray-700 rounded">
                        ⭐ Add Testimonial
                    </Link>
                    <Link href="/admin-dashboard/deletetestimonial" className="block p-2 hover:bg-gray-700 rounded">
                        ❌ Delete Testimonial
                    </Link>
                    <Link href="/admin-dashboard/addblogpost" className="block p-2 hover:bg-gray-700 rounded">
                        📝 Add Blog Post
                    </Link>
                    <Link href="/admin-dashboard/users" className="block p-2 hover:bg-gray-700 rounded">
                        🔧 Manage Users
                    </Link>
                    <Link href="/admin-dashboard/allblogs" className="block p-2 hover:bg-gray-700 rounded">
                        📚 All Blogs
                    </Link>
                    <Link href="/admin-dashboard/logs" className="block p-2 hover:bg-gray-700 rounded">
                        📚 LOGS
                    </Link>
                    <Link href="/admin-dashboard/blogspost" className="block p-2 hover:bg-gray-700 rounded">
                        ➕ Create Blog Post
                    </Link>
                    <Link href="/" className="block p-2 hover:bg-gray-700 rounded">
                        ➕ Home
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="col-span-9 p-6">
                {children} {/* Dynamic content will load here */}
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
