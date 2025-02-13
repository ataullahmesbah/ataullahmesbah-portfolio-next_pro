import Link from "next/link";

const AdminDashboardLayout = ({ children }) => {
    return (
        <div className="grid grid-cols-12 min-h-screen">
            {/* Sidebar */}
            <div className="col-span-3 bg-gray-900 text-white p-6">
                <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

                <nav className="space-y-3">
                    <Link href="/admin-dashboard" className="block p-2 hover:bg-gray-700 rounded">🏠 Dashboard Home</Link>
                    <Link href="/admin-dashboard/allusers" className="block p-2 hover:bg-gray-700 rounded">👤 All Users</Link>
                    <Link href="/admin-dashboard/addtestimonial" className="block p-2 hover:bg-gray-700 rounded">👤 Add Testimonial</Link>
                    <Link href="/admin-dashboard/manageusers" className="block p-2 hover:bg-gray-700 rounded">🔧 Manage Users</Link>
                    <Link href="/admin-dashboard/allblogs" className="block p-2 hover:bg-gray-700 rounded">📝 All Blogs</Link>
                    <Link href="/admin-dashboard/blogspost" className="block p-2 hover:bg-gray-700 rounded">➕ Blog Post</Link>
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
