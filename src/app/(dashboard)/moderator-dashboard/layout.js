'use client';


import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaUser, FaUserTie, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import Image from 'next/image';
import Loading from '@/app/loading';
import DynamicDropDown from '@/app/components/Share/DynamicDropDown/DynamicDropDown';

export default function ModeratorDashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const FolderData = [
    {
      label: 'MODERATOR DASHBOARD',
      children: [
        { label: 'Dashboard Home', link: '/moderator-dashboard' },
      ],
    },
    {
      label: 'BLOGS',
      children: [
        { label: 'All Blogs', link: '/moderator-dashboard/blog/all-blogs' },
        { label: 'Add Blogs', link: '/moderator-dashboard/blog/attachblogpost' },
        { label: 'Comment Check', link: '/moderator-dashboard/blog/comment-check' },
      ],
    },
    {
      label: 'CONTENT CREATION',
      children: [
        { label: 'All Content', link: '/moderator-dashboard/content-creation/all-content' },
        { label: 'Attach Content', link: '/moderator-dashboard/content-creation/attach-content' },
      ],
    },
    {
      label: 'FEATURED STORY',
      children: [
        { label: 'All Story', link: '/moderator-dashboard/featured-story/all-story' },
        { label: 'Attach Story', link: '/moderator-dashboard/featured-story/attach-story' },
      ],
    },
    {
      label: 'NEWS LETTER',
      children: [
        { label: 'All Letter', link: '/moderator-dashboard/newsletter/all-letter' },
        { label: 'Attach Letter', link: '/moderator-dashboard/newsletter/attach-letter' },
      ],
    },
    {
      label: 'SHOPPING',
      children: [
        { label: 'Orders Management', link: '/moderator-dashboard/shop/orders-management' },
        { label: 'All Products', link: '/moderator-dashboard/shop/all-products' },
        { label: 'Add Products', link: '/moderator-dashboard/shop/add-product' },
        { label: 'Accept Orders', link: '/moderator-dashboard/shop/accept-orders' },
        { label: 'Reject Orders', link: '/moderator-dashboard/shop/reject-orders' },


      ],
    },
  ]


  // Redirect if user is not authenticated or not a moderator
  if (status === 'unauthenticated' || session?.user?.role !== 'moderator') {
    router.push('/');
    return null;
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="moderator-dashboard-layout min-h-screen flex">

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
            ) : session.user.gender === 'female' ? (
              <FaUserTie className="w-16 h-16 mx-auto text-gray-500" />
            ) : (
              <FaUser className="w-16 h-16 mx-auto text-gray-500" />
            )}

            {/* User Name */}
            <h2 className="text-xl font-bold mt-4">Moderator Panel</h2>

            {/* Welcome Message */}
            <p className="text-base text-blue-300 font-medium bg-gray-800 text-center rounded-md p-1 mt-2">
              Hello, {session?.user?.name}!
            </p>

            {/* Email Display */}
            <p className="text-blue-200 mt-2">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="Flex">
            <DynamicDropDown data={FolderData} />
          </div>


          <Link href="/" className="block p-2 hover:bg-gray-700 rounded">
            ➕ Home
          </Link>
        </div>
      </div>

      {/* Main Content with Suspense for Loading */}
      <div className="flex-1 p-3 bg-gray-800 overflow-y-auto">
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}
