// app/admin/ads/page.js
'use client';
import { useState, useEffect } from 'react';
import { Plus, Settings, Eye, Edit3, Trash2, Play, Pause, Calendar } from 'lucide-react';

export default function AdsAdmin() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('create');
    const [formData, setFormData] = useState({
        title: '',
        buttonText: 'Get Started',
        buttonLink: '',
        targetPages: ['*'],
        displayLimit: 3,
        displayTime: 10,
        startDate: '',
        endDate: '',
        isActive: true,
        image: null
    });
    const [editingAd, setEditingAd] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [customPage, setCustomPage] = useState('');

    // Available pages for selection
    const availablePages = [
        { value: '*', label: 'All Pages' },
        { value: '/', label: 'Home Page' },
        { value: '/shop', label: 'Shop' },
        { value: '/blog', label: 'Blog' },
        { value: '/about', label: 'About' },
        { value: '/contact', label: 'Contact' },
        { value: '/services', label: 'Services' },
        { value: '/products', label: 'Products' }
    ];

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/ads');
            const data = await res.json();
            if (data.success) setAds(data.data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const addCustomPage = () => {
        if (customPage && !formData.targetPages.includes(customPage)) {
            setFormData({
                ...formData,
                targetPages: [...formData.targetPages, customPage]
            });
            setCustomPage('');
        }
    };

    const removePage = (pageToRemove) => {
        setFormData({
            ...formData,
            targetPages: formData.targetPages.filter(page => page !== pageToRemove)
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form data before submit:', formData);

        try {
            const data = new FormData();

            // Append all form data
            data.append('title', formData.title);
            data.append('buttonText', formData.buttonText);
            data.append('buttonLink', formData.buttonLink);
            data.append('displayLimit', formData.displayLimit.toString());
            data.append('displayTime', formData.displayTime.toString());
            data.append('startDate', formData.startDate);
            data.append('endDate', formData.endDate);
            data.append('isActive', formData.isActive.toString());

            // Append target pages
            formData.targetPages.forEach(page => {
                data.append('targetPages', page);
            });

            // Append new image if uploaded
            if (formData.image) {
                data.append('image', formData.image);
            } else if (editingAd && previewImage) {
                // Append existing image URL if no new image
                data.append('imageUrl', previewImage);
            }

            console.log('Sending FormData with:', {
                title: formData.title,
                targetPages: formData.targetPages,
                hasImage: !!formData.image || !!previewImage
            });

            const url = editingAd ? `/api/admin/ads/${editingAd._id}` : '/api/admin/ads';
            const method = editingAd ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                body: data
            });

            const result = await res.json();
            console.log('API Response:', result);

            if (res.ok) {
                alert(editingAd ? 'Ad updated successfully!' : 'Ad created successfully!');
                resetForm();
                fetchAds();
                setActiveTab('list');
            } else {
                alert(`Error: ${result.error || 'Failed to save ad'}`);
            }
        } catch (error) {
            console.error('Error saving ad:', error);
            alert('Network error: ' + error.message);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            buttonText: 'Get Started',
            buttonLink: '',
            targetPages: ['*'],
            displayLimit: 3,
            displayTime: 10,
            startDate: '',
            endDate: '',
            isActive: true,
            image: null
        });
        setEditingAd(null);
        setPreviewImage('');
        setCustomPage('');
    };

    const editAd = (ad) => {
        setFormData({
            title: ad.title,
            buttonText: ad.buttonText,
            buttonLink: ad.buttonLink,
            targetPages: ad.targetPages,
            displayLimit: ad.displayLimit,
            displayTime: ad.displayTime,
            startDate: ad.startDate.split('T')[0],
            endDate: ad.endDate.split('T')[0],
            isActive: ad.isActive,
            image: null
        });
        setEditingAd(ad);
        setPreviewImage(ad.imageUrl);
        setActiveTab('create');
    };

    const toggleAdStatus = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/admin/ads/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            if (res.ok) {
                fetchAds();
            }
        } catch (error) {
            console.error('Error updating ad status:', error);
        }
    };

    const deleteAd = async (id) => {
        if (confirm('Are you sure you want to delete this ad?')) {
            try {
                const res = await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
                if (res.ok) fetchAds();
            } catch (error) {
                console.error('Error deleting ad:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading Ads...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Advanced Ads Management</h1>
                    <p className="text-purple-200">Professional advertisement system for your website</p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex space-x-1 bg-gray-800 rounded-xl p-1 mb-8 max-w-2xl mx-auto">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 flex-1 justify-center ${activeTab === 'create'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>{editingAd ? 'Edit Ad' : 'Create New Ad'}</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-300 flex-1 justify-center ${activeTab === 'list'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        <Eye className="w-5 h-5" />
                        <span>Existing Ads ({ads.length})</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700/50">
                    {/* Create/Edit Tab */}
                    {activeTab === 'create' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
                                            Basic Information
                                        </h3>

                                        <div>
                                            <label className="block text-purple-200 mb-2">Ad Title *</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter ad title..."
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-purple-200 mb-2">Button Text</label>
                                            <input
                                                type="text"
                                                value={formData.buttonText}
                                                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Button text..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-purple-200 mb-2">Button Link *</label>
                                            <input
                                                type="url"
                                                value={formData.buttonLink}
                                                onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="https://example.com"
                                                required
                                            />
                                        </div>

                                        {!editingAd && (
                                            <div>
                                                <label className="block text-purple-200 mb-2">Ad Image (300x500px) *</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                                    required={!editingAd}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Settings & Targeting */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-purple-300 border-b border-purple-500/30 pb-2">
                                            Settings & Targeting
                                        </h3>

                                        <div>
                                            <label className="block text-purple-200 mb-2">Target Pages *</label>
                                            <div className="space-y-3">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {availablePages.map(page => (
                                                        <label key={page.value} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.targetPages.includes(page.value)}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        setFormData({
                                                                            ...formData,
                                                                            targetPages: [...formData.targetPages, page.value]
                                                                        });
                                                                    } else {
                                                                        setFormData({
                                                                            ...formData,
                                                                            targetPages: formData.targetPages.filter(p => p !== page.value)
                                                                        });
                                                                    }
                                                                }}
                                                                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                                            />
                                                            <span className="text-white text-sm">{page.label}</span>
                                                        </label>
                                                    ))}
                                                </div>

                                                {/* Custom Page Input */}
                                                <div className="flex space-x-2">
                                                    <input
                                                        type="text"
                                                        value={customPage}
                                                        onChange={(e) => setCustomPage(e.target.value)}
                                                        placeholder="/custom-page"
                                                        className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={addCustomPage}
                                                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm"
                                                    >
                                                        Add
                                                    </button>
                                                </div>

                                                {/* Selected Pages */}
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.targetPages.map(page => (
                                                        <span key={page} className="bg-purple-600 text-white px-2 py-1 rounded text-sm flex items-center">
                                                            {availablePages.find(p => p.value === page)?.label || page}
                                                            <button
                                                                type="button"
                                                                onClick={() => removePage(page)}
                                                                className="ml-1 hover:text-red-300"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-purple-200 mb-2">Display Limit</label>
                                                <input
                                                    type="number"
                                                    value={formData.displayLimit}
                                                    onChange={(e) => setFormData({ ...formData, displayLimit: e.target.value })}
                                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    min="1"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-purple-200 mb-2">Display Time (seconds)</label>
                                                <input
                                                    type="number"
                                                    value={formData.displayTime}
                                                    onChange={(e) => setFormData({ ...formData, displayTime: e.target.value })}
                                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    min="5"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-purple-200 mb-2">Start Date *</label>
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-purple-200 mb-2">End Date *</label>
                                                <input
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <label className="flex items-center text-purple-200">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    className="mr-2 w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                                />
                                                Active Advertisement
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Preview */}
                                {previewImage && (
                                    <div className="border-2 border-purple-500/30 rounded-xl p-4 bg-gray-900/50">
                                        <h4 className="text-purple-300 mb-3">Image Preview</h4>
                                        <div className="flex justify-center">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="max-w-xs max-h-64 rounded-lg shadow-lg"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-4 pt-6 border-t border-gray-700">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                                    >
                                        <Play className="w-5 h-5" />
                                        <span>{editingAd ? 'Update Advertisement' : 'Create Advertisement'}</span>
                                    </button>

                                    {editingAd && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                setActiveTab('list');
                                            }}
                                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                                        >
                                            <Settings className="w-5 h-5" />
                                            <span>Cancel Edit</span>
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}

                    {/* List Tab */}
                    {activeTab === 'list' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Existing Advertisements</h2>
                                <span className="text-purple-300">{ads.length} ads total</span>
                            </div>

                            {ads.length === 0 ? (
                                <div className="text-center text-purple-200 py-12 border-2 border-dashed border-gray-700 rounded-2xl">
                                    <Settings className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                                    <div className="text-xl mb-2">No advertisements yet</div>
                                    <div className="text-gray-400 mb-4">Create your first ad to get started</div>
                                    <button
                                        onClick={() => setActiveTab('create')}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300"
                                    >
                                        Create First Ad
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {ads.map(ad => (
                                        <div key={ad._id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300 group">
                                            <div className="relative mb-4">
                                                <img
                                                    src={ad.imageUrl}
                                                    alt={ad.title}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <div className="absolute top-2 right-2 flex space-x-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ad.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                                        }`}>
                                                        {ad.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                    <span className="px-2 py-1 bg-purple-600 text-white rounded-full text-xs">
                                                        {ad.displayTime}s
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="text-white font-semibold mb-2 truncate">{ad.title}</h3>

                                            <div className="grid grid-cols-2 gap-2 text-xs text-purple-200 mb-4">
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{ad.impressions} views</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Play className="w-3 h-3" />
                                                    <span>{ad.clicks} clicks</span>
                                                </div>
                                                <div>Limit: {ad.displayLimit}</div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(ad.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => editAd(ad)}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                    <span>Edit</span>
                                                </button>

                                                <button
                                                    onClick={() => toggleAdStatus(ad._id, ad.isActive)}
                                                    className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1 ${ad.isActive ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
                                                        } text-white`}
                                                >
                                                    {ad.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                    <span>{ad.isActive ? 'Pause' : 'Activate'}</span>
                                                </button>

                                                <button
                                                    onClick={() => deleteAd(ad._id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center space-x-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}