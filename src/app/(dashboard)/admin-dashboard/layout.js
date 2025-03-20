'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserTie, FaBars, FaTimes } from 'react-icons/fa';
import Link from "next/link";
import { useState } from 'react'; // Add useState for drawer toggle
import DynamicDropDown from '@/app/components/Share/DynamicDropDown/DynamicDropDown';
import Image from 'next/image';

const AdminDashboardLayout = ({ children }) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer toggle

    const FolderData = [
        {
            label: 'DASHBOARD',
            children: [
                { label: 'Dashboard Home', link: '/admin-dashboard' },
            ],
        },
        {
            label: 'BLOGS',
            children: [
                { label: 'Add Blogs', link: '/admin-dashboard/addblogpost' },
                { label: 'All Blogs', link: '/admin-dashboard/allblogs' },
            ],
        },
        {
            label: 'TESTIMONIALS',
            children: [
                { label: 'Add Testimonials', link: '/admin-dashboard/addtestimonial' },
                { label: 'Delete Testimonial', link: '/admin-dashboard/deletetestimonial' },
            ],
        },
        {
            label: 'MANAGE USERS',
            children: [
                { label: 'Manager Users', link: '/admin-dashboard/users' },
            ],
        },
        {
            label: 'USER PROFILE CONTROL',
            children: [
                { label: 'PROFILE CONTROL', link: '/admin-dashboard/userprofilecontrol' },
            ],
        },
    ];

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
        <div className="admin-dashboard-layout min-h-screen flex">

            {/* Drawer Toggle Button (Mobile) */}
            <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md lg:hidden"
            >
                {isDrawerOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed lg:relative lg:block w-80 bg-gray-900 text-white p-6 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}
            >
                <div className="flex flex-col items-center text-center poppins-regular mb-5">
                    <div className="rounded-lg p-6">
                        {/* User Image / Avatar */}
                        {session.user.image ? (
                            <Image
                                src={session?.user?.image}
                                alt="User Avatar"
                                width={64}  // w-16 = 64px
                                height={64} // h-16 = 64px
                                className="w-20 h-20 rounded-full mx-auto border-2 border-sky-900 object-cover"
                            />
                        ) : session.user.gender === "female" ? (
                            <FaUserTie className="w-16 h-16 mx-auto text-gray-500" />
                        ) : (
                            <FaUser className="w-16 h-16 mx-auto text-gray-500" />
                        )}


                        {/* User Name */}
                        <h2 className="text-xl font-bold mt-4">Admin Panel</h2>

                        {/* Welcome Message */}
                        <p className="text-base text-blue-300 font-medium bg-gray-800 text-center rounded-md p-1 mt-2">
                            Hello, {session?.user?.name}!
                        </p>

                        {/* Email Display */}
                        <p className="text-blue-200 mt-2">{session?.user?.email}</p>
                    </div>
                </div>

                <nav className="space-y-3">
                    <Link href="/admin-dashboard/allusers" className="block p-2 hover:bg-gray-700 rounded">
                        👤 All Users
                    </Link>

                    <div className="Flex">
                        <DynamicDropDown data={FolderData} />
                    </div>

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
            <div className="flex-1 p-6 bg-gray-800 overflow-y-auto">
                {children} {/* Dynamic content will load here */}
            </div>
        </div>
    );
};

export default AdminDashboardLayout;