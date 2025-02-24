import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TestimonialStatistics from '@/app/Dashboard/AdminDashboard/TestimonialStatistics/TestimonialStatistics';

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    // Redirect or deny access if the user is not an admin
    if (session?.user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-2xl">Access Denied</p>
            </div>
        );
    }

    return (
        <main
            className="min-h-screen"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}
        >
            <div className="space-y-6 py-10">
                <h2 className="text-3xl text-center text-white font-bold">Welcome to the Admin Dashboard</h2>
                <div className="mt-10">
                    <TestimonialStatistics />
                </div>
            </div>
        </main>
    );
}