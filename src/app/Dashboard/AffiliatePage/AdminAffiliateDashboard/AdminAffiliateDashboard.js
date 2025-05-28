'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function AdminAffiliateDashboard() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAffiliate, setSelectedAffiliate] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated' || (status === 'authenticated' && session.user.role !== 'admin')) {
            router.push('/');
            return;
        }
        if (status === 'authenticated') {
            fetchStats();
        }
    }, [status, session, router]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/affiliate/stats');
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            } else {
                toast.error(data.message || 'Failed to fetch affiliate stats');
            }
        } catch (error) {
            console.error('Fetch affiliate stats error:', error);
            toast.error('Error fetching affiliate stats');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (affiliate) => {
        setSelectedAffiliate(affiliate);
    };

    const handleInitiatePayout = async (affiliateId, amount) => {
        try {
            const res = await fetch('/api/affiliate/payout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ affiliateId, amount }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Payout initiated successfully');
                fetchStats();
            } else {
                toast.error(data.message || 'Failed to initiate payout');
            }
        } catch (error) {
            console.error('Initiate payout error:', error);
            toast.error('Error initiating payout');
        }
    };

    const closeModal = () => {
        setSelectedAffiliate(null);
    };

    const getChartData = (affiliate) => {
        const earningsDates = Object.keys(affiliate.earningsByDate || {}).sort();
        const earningsValues = earningsDates.map((date) => affiliate.earningsByDate[date]);
        const visitsPages = Object.keys(affiliate.visitsByPage || {});
        const visitsCounts = visitsPages.map((page) => affiliate.visitsByPage[page]);

        return {
            earningsChart: {
                labels: earningsDates,
                datasets: [
                    {
                        label: 'Earnings (৳)',
                        data: earningsValues,
                        borderColor: 'rgb(139, 92, 246)',
                        backgroundColor: 'rgba(139, 92, 246, 0.5)',
                        tension: 0.4,
                    },
                ],
            },
            visitsChart: {
                labels: visitsPages,
                datasets: [
                    {
                        label: 'Page Visits',
                        data: visitsCounts,
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1,
                    },
                ],
            },
        };
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                    Affiliate Program Dashboard
                </h1>
                <div className="grid gap-6">
                    <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Affiliate URL</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Earnings</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Sales</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Visits</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Payouts</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {stats.map((affiliate) => (
                                    <tr key={affiliate._id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm text-white">{affiliate.username}</td>
                                        <td className="px-6 py-4 text-sm text-white">{affiliate.email}</td>
                                        <td className="px-6 py-4 text-sm text-white">
                                            <a
                                                href={`https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:underline"
                                            >
                                                {`https://ataullahmesbah.com/?aff=${affiliate.affiliateCode}`}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white">৳{affiliate.totalEarnings.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-white">{affiliate.totalSales}</td>
                                        <td className="px-6 py-4 text-sm text-white">{affiliate.totalVisits}</td>
                                        <td className="px-6 py-4 text-sm text-white">৳{affiliate.totalPayouts.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleViewDetails(affiliate)}
                                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {selectedAffiliate && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full">
                            <h2 className="text-xl font-semibold mb-4 text-white">Affiliate Details: {selectedAffiliate.username}</h2>
                            <div className="grid gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">Earnings Over Time</h3>
                                    <Line
                                        data={getChartData(selectedAffiliate).earningsChart}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: 'top', labels: { color: '#fff' } },
                                                title: { display: true, text: 'Earnings Trend', color: '#fff' },
                                            },
                                            scales: {
                                                x: { ticks: { color: '#fff' } },
                                                y: { ticks: { color: '#fff' } },
                                            },
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">Visits by Page</h3>
                                    <Bar
                                        data={getChartData(selectedAffiliate).visitsChart}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: 'top', labels: { color: '#fff' } },
                                                title: { display: true, text: 'Page Visit Distribution', color: '#fff' },
                                            },
                                            scales: {
                                                x: { ticks: { color: '#fff' } },
                                                y: { ticks: { color: '#fff' } },
                                            },
                                        }}
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-white mb-2">Referral Payouts</h3>
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead className="bg-gray-900">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {selectedAffiliate.payouts?.map((payout) => (
                                                <tr key={payout._id} className="hover:bg-gray-700">
                                                    <td className="px-4 py-2 text-sm text-white">৳{payout.amount.toFixed(2)}</td>
                                                    <td className="px-4 py-2 text-sm text-white">{payout.status}</td>
                                                    <td className="px-4 py-2 text-sm text-white">
                                                        {new Date(payout.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            )) || (
                                                    <tr>
                                                        <td colSpan="3" className="px-4 py-2 text-sm text-gray-400 text-center">
                                                            No payouts yet
                                                        </td>
                                                    </tr>
                                                )}
                                        </tbody>
                                    </table>
                                    <div className="mt-4">
                                        <input
                                            type="number"
                                            placeholder="Enter payout amount"
                                            id="payoutAmount"
                                            className="px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none"
                                        />
                                        <button
                                            onClick={() => {
                                                const amount = parseFloat(document.getElementById('payoutAmount').value);
                                                if (amount > 0) handleInitiatePayout(selectedAffiliate._id, amount);
                                                else toast.error('Invalid payout amount');
                                            }}
                                            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                        >
                                            Initiate Payout
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}