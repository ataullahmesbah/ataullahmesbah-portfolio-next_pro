'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ModeratorDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
    <div>
      <h2>Welcome to the Moderator Dashboard</h2>
      <p>Hello, {session.user.name}!</p>
    </div>
  );
}