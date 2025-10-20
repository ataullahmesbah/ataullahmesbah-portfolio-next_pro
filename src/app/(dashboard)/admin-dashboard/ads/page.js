'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const availablePages = ['*', '/', '/shop', '/blog', '/about', '/contact'];

export default function AdsAdmin() {
  const [ads, setAds] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    image: null,
    buttonText: 'Shop Now',
    buttonLink: '',
    viewLimitPerUser: 5,
    pages: ['*'],
    displaySeconds: 10,
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    isActive: true,
    priority: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [stats, setStats] = useState({ totalImpressions: 0, totalClicks: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'list') {
      fetchAds();
      fetchStats();
    }
  }, [activeTab]);

  const fetchAds = async () => {
    try {
      const res = await fetch('/api/admin/ads');
      const data = await res.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/ads/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.image && formData.image instanceof File) {
        const img = await createImageBitmap(formData.image);
        if (img.width !== 300 || img.height !== 500) {
          throw new Error('Image must be exactly 300x500 pixels');
        }
        img.close();
      }

      await submitForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const submitForm = async () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'image' && value) {
        fd.append(key, value);
      } else if (key === 'pages' && Array.isArray(value)) {
        value.forEach(p => {
          if (p) fd.append('pages', p.toString());
        });
      } else if (value !== null && value !== undefined) {
        fd.append(key, value.toString());
      }
    });

    const url = editingId ? `/api/admin/ads/${editingId}` : '/api/admin/ads';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: fd });
      if (res.ok) {
        setActiveTab('list');
        resetForm();
        alert(editingId ? 'Ad updated successfully!' : 'Ad created successfully!');
      } else {
        const error = await res.json();
        alert(error.error || 'Something went wrong!');
      }
    } catch (error) {
      alert('Network error: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      image: null,
      buttonText: 'Shop Now',
      buttonLink: '',
      viewLimitPerUser: 5,
      pages: ['*'],
      displaySeconds: 10,
      startDate: '2025-10-01',
      endDate: '2025-10-31',
      isActive: true,
      priority: 1,
    });
    setEditingId(null);
    setPreviewImage('');
  };

  const editAd = (ad) => {
    setFormData({
      image: null,
      buttonText: ad.buttonText || 'Shop Now',
      buttonLink: ad.buttonLink || '',
      viewLimitPerUser: ad.viewLimitPerUser || 5,
      pages: Array.isArray(ad.pages) ? ad.pages : [ad.pages || '*'],
      displaySeconds: ad.displaySeconds || 10,
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().split('T')[0] : '2025-10-01',
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split('T')[0] : '2025-10-31',
      isActive: ad.isActive !== undefined ? ad.isActive : true,
      priority: ad.priority || 1,
    });
    setEditingId(ad._id);
    setPreviewImage(ad.imageUrl || '');
    setActiveTab('create');
  };

  const deleteAd = async (id) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        await fetch(`/api/admin/ads/${id}`, { method: 'DELETE' });
        fetchAds();
        alert('Ad deleted successfully!');
      } catch (error) {
        alert('Error deleting ad: ' + error.message);
      }
    }
  };

  const toggleActive = async (id, isActive) => {
    try {
      await fetch(`/api/admin/ads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchAds();
      alert(`Ad ${!isActive ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      alert('Error updating ad: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto backdrop-blur-sm bg-white/10 rounded-xl shadow-2xl p-4 sm:p-6">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg">
            <p className="text-purple-300 font-semibold">Total Ads</p>
            <p className="text-2xl font-bold text-white">{ads.length}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg">
            <p className="text-purple-300 font-semibold">Total Impressions</p>
            <p className="text-2xl font-bold text-white">{stats.totalImpressions}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-lg">
            <p className="text-purple-300 font-semibold">Total Clicks</p>
            <p className="text-2xl font-bold text-white">{stats.totalClicks}</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all ${
              activeTab === 'create' ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            {editingId ? 'Edit Ad' : 'Create New Ad'}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 px-4 rounded-md text-center font-medium transition-all ${
              activeTab === 'list' ? 'bg-purple-600 text-white shadow' : 'text-gray-300 hover:text-white'
            }`}
          >
            All Ads
          </motion.button>
        </div>

        {activeTab === 'create' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ad Image (300×500px required)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, image: file });
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30"
                />
                {previewImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Preview (300×500px):</p>
                    <img src={previewImage} alt="Ad preview" className="w-[150px] h-[250px] object-cover rounded-lg" />
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">Image must be exactly 300 pixels wide and 500 pixels tall</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Button Text *</label>
                  <input
                    type="text"
                    placeholder="e.g., Shop Now, Learn More"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Button Link *</label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Time (seconds) *</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={formData.displaySeconds}
                    onChange={(e) => setFormData({ ...formData, displaySeconds: parseInt(e.target.value) || 10 })}
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-3 bg-white/10 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Show on Pages *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availablePages.map(page => (
                    <label key={page} className="flex items-center space-x-2 p-3 bg-white/10 rounded-lg hover:bg-white/20 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pages.includes(page)}
                        onChange={(e) => {
                          let newPages = [...formData.pages];
                          if (e.target.checked) {
                            newPages.push(page);
                          } else {
                            newPages = newPages.filter(p => p !== page);
                          }
                          setFormData({ ...formData, pages: newPages });
                        }}
                        className="rounded text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-300">{page === '*' ? 'All Pages' : page}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-purple-600 focus:ring-purple-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-300">Active Advertisement</label>
              </div>

              <div className="flex space-x-4 pt-6 border-t border-gray-600">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : editingId ? 'Update Ad' : 'Create Ad'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="bg-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {activeTab === 'list' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">All Ads ({ads.length})</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveTab('create')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Create New Ad
              </motion.button>
            </div>

            {ads.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {ads.map(ad => (
                  <motion.div
                    key={ad._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white/10"
                  >
                    <div className="relative">
                      <div className="w-full h-48 relative">
                        <img
                          src={ad.imageUrl}
                          alt={`Ad: ${ad.buttonText}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjUwMCIgdmlld0JveD0iMCAwIDMwMCA1MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iNTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMjUgMjI1SDE3NVYyNzVIMTI1VjIyNVpNMTUwIDE3NUMxNjMuODA3IDE3NSAxNzUgMTg2LjE5MyAxNzUgMjAwQzE3NSAyMTMuODA3IDE2My44MDcgMjI1IDE1MCAyMjVDMTM2LjE5MyAyMjUgMTI1IDIxMy44MDcgMTI1IDIwMEMxMjUgMTg2LjE5MyAxMzYuMTkzIDE3NSAxNTAgMTc1WiIgZmlsbD0iOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yMDAgMzI1SDEwMEM5NC40NzcgMzI1IDkwIDMyMC41MjMgOTAgMzE1VjE4NUM5MCAxNzkuNDc3IDk0LjQ3NyAxNzUgMTAwIDE3NUgyMDBDMjA1LjUyMyAxNzUgMjEwIDE3OS40NzcgMjEwIDE4NVYzMTVDMjEwIDMyMC41MjMgMjA1LjUyMyAzMjUgMjAwIDMyNVpNMTAwIDE4NVYzMTVIMjAwVjE4NUgxMDBaIiBmaWxsPSI5QjlCOUIiLz4KPC9zdmc+';
                          }}
                        />
                      </div>
                      <div
                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                          ad.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className="absolute top-2 left-2 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold">
                        Priority: {ad.priority}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-2 truncate">{ad.buttonText}</h3>
                      <p className="text-sm text-gray-400 mb-1 truncate" title={ad.buttonLink}>
                        {ad.buttonLink}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                        <div className="flex items-center">
                          <span className="mr-1">👁️</span>
                          {ad.impressions || 0}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">👆</span>
                          {ad.clicks || 0}
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">⏱️</span>
                          {ad.displaySeconds}s
                        </div>
                        <div className="flex items-center">
                          <span className="mr-1">📅</span>
                          {new Date(ad.startDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        Pages: {Array.isArray(ad.pages) ? ad.pages.join(', ').replace('*', 'All Pages') : 'All Pages'}
                      </p>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => editAd(ad)}
                          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => toggleActive(ad._id, ad.isActive)}
                          className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                            ad.isActive ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-green-500 text-white hover:bg-green-600'
                          }`}
                        >
                          {ad.isActive ? 'Deactivate' : 'Activate'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => deleteAd(ad._id)}
                          className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <div className="text-6xl mb-4">📺</div>
                <p className="text-lg mb-2">No ads created yet</p>
                <p className="text-sm mb-4">Create your first advertisement to get started</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveTab('create')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Create Your First Ad
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}