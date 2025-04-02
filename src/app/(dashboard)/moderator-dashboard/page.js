'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaBell } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { FaSun, FaCloudSun, FaMoon, FaStar } from 'react-icons/fa';

export default function ModeratorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState(null); // State for the icon

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hours = now.getHours();

      let timeGreeting;
      let GreetingIcon;
      if (hours >= 5 && hours < 12) {
        timeGreeting = 'Good Morning';
        GreetingIcon = <FaSun className="text-yellow-500" />; // Sun for morning
      } else if (hours >= 12 && hours < 17) {
        timeGreeting = 'Good Afternoon';
        GreetingIcon = <FaCloudSun className="text-orange-400" />; // CloudSun for afternoon
      } else if (hours >= 17 && hours < 22) {
        timeGreeting = 'Good Evening';
        GreetingIcon = <FaMoon className="text-indigo-500" />; // Moon for evening
      } else {
        timeGreeting = 'Good Night';
        GreetingIcon = <FaStar className="text-blue-300" />; // Star for night
      }

      const userName = session?.user?.name || 'Guest';
      setGreeting(`${timeGreeting}, ${userName}`);
      setIcon(GreetingIcon);
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [session]);


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
    <main className="min-h-screen bg-gray-800">
      <div className="space-y-3 py-10">
        <div className="text-white px-5 space-y-3">
          <h2 className="text-3xl font-bold">Welcome back!</h2>
          <h1 className="text-gray-200 mb-4 flex items-center gap-2">
            {icon}
            <span>{greeting}</span>
          </h1>
          <div className="flex gap-4 items-center">
            <FaBell />
            <p>Hello, our wonderful friend! May your day be filled with laughter, love, and all things amazing!</p>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


          This is Moderator Page Content !!!

        </div>





      </div>
    </main>
  );
}