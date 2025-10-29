'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function NavAdsAdmin() {
    const [navAds, setNavAds] = useState([]);
    const [formData, setFormData] = useState({
        shopName: 'SOOQRA ONE',
        adText: '',
        couponCode: '',
        buttonText: 'Shop Now',
        buttonLink: '',
        backgroundColor: 'bg-gradient-to-r from-purple-900 to-indigo-900',
        textColor: 'text-white',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNavAds();
    }, []);

    const fetchNavAds = async () => {
        try {
            const res = await fetch('/api/products/nav-ads/admin');
            const { data } = await res.json();
            setNavAds(data || []);
        } catch (error) {
            console.error('Error fetching nav ads:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/products/nav-ads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await res.json();

            if (result.success) {
                alert('Nav ad created successfully!');
                setFormData({
                    shopName: 'SOOQRA ONE',
                    adText: '',
                    couponCode: '',
                    buttonText: 'Shop Now',
                    buttonLink: '',
                    backgroundColor: 'bg-gradient-to-r from-purple-900 to-indigo-900',
                    textColor: 'text-white',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    isActive: true
                });
                fetchNavAds();
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert('Error creating nav ad: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteNavAd = async (id) => {
        if (confirm('Are you sure you want to delete this nav ad?')) {
            try {
                await fetch(`/api/products/nav-ads/${id}`, { method: 'DELETE' });
                fetchNavAds();
                alert('Nav ad deleted successfully!');
            } catch (error) {
                alert('Error deleting nav ad: ' + error.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Nav Ads Management</h1>

                {/* Create Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-md rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold mb-4">Create New Nav Ad</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Shop Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.shopName}
                                    onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ad Text * (Max 100 chars)
                                </label>
                                <input
                                    type="text"
                                    maxLength={100}
                                    value={formData.adText}
                                    onChange={(e) => setFormData({ ...formData, adText: e.target.value })}
                                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    placeholder="Special offer! Get 50% off on all products..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Coupon Code (Optional)
                                </label>
                                <input
                                    type="text"
                                    maxLength={20}
                                    value={formData.couponCode}
                                    onChange={(e) => setFormData({ ...formData, couponCode: e.target.value })}
                                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    placeholder="SUMMER50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Button Text
                                </label>
                                <input
                                    type="text"
                                    value={formData.buttonText}
                                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Button Link (Optional)
                                </label>
                                <input
                                    type="url"
                                    value={formData.buttonLink}
                                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                    placeholder="https://example.com/shop"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="rounded text-purple-600 focus:ring-purple-500"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-300">
                                Active Advertisement
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            type="submit"
                            disabled={loading}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Nav Ad'}
                        </motion.button>
                    </form>
                </motion.div>

                {/* Nav Ads List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 backdrop-blur-md rounded-lg p-6"
                >
                    <h2 className="text-xl font-semibold mb-4">Active Nav Ads</h2>

                    {navAds.length > 0 ? (
                        <div className="space-y-4">
                            {navAds.map((ad) => (
                                <div key={ad._id} className="border border-gray-600 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{ad.shopName}</h3>
                                            <p className="text-gray-300 mt-1">{ad.adText}</p>
                                            {ad.couponCode && (
                                                <p className="text-yellow-400 mt-1">Coupon: {ad.couponCode}</p>
                                            )}
                                            <div className="flex space-x-4 text-sm text-gray-400 mt-2">
                                                <span>Impressions: {ad.impressions || 0}</span>
                                                <span>Clicks: {ad.clicks || 0}</span>
                                                <span>Active: {ad.isActive ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(ad.startDate).toLocaleDateString()} - {new Date(ad.endDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteNavAd(ad._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No nav ads created yet.</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
}