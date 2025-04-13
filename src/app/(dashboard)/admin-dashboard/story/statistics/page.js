
// app/admin/statistics/page.js

import StatisticsClient from "@/app/components/Story/Statistics/Statistics";


// export async function generateMetadata() {
//     return {
//         title: 'Story Statistics | Admin Dashboard',
//         description: 'View detailed statistics for your featured stories, including total stories, views, and more.',
//     };
// }

async function fetchStatistics() {
    try {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/feature/statistics`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            console.error(`Fetch failed with status: ${res.status}`);
            throw new Error('Failed to fetch statistics');
        }
        const data = await res.json();
        console.log('Fetched statistics:', data);
        return data;
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return null;
    }
}

export default async function Statistics() {
    const stats = await fetchStatistics();
    if (!stats) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-lg">Failed to load statistics</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4">
            <StatisticsClient stats={stats} />
        </div>
    );
}