'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
import Loader from '@/app/components/Loader/Loader';
import { FiSearch, FiRefreshCw, FiFilter } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AllFeaturedStories() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = ['featured', 'tech', 'travel', 'seo', 'personal'];

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/feature${categoryFilter ? `?category=${encodeURIComponent(categoryFilter)}` : ''}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch stories');
      const { stories: data } = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid API response');
      setStories(data);
      setFilteredStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Error loading stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
  }, [categoryFilter]);

  useEffect(() => {
    setFilteredStories(
      stories.filter(story =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, stories]);

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const res = await fetch(`/api/feature/${slug}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete story');
      setStories(stories.filter((story) => story.slug !== slug));
      setFilteredStories(filteredStories.filter((story) => story.slug !== slug));
      toast.success('Story deleted successfully!');
    } catch (error) {
      console.error('Error deleting story:', error);
      toast.error('Error deleting story');
    }
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setCategoryFilter('');
    fetchStories();
    toast.success('Page refreshed!');
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white" data-aos="fade-down">
            All Featured Stories
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-white text-black w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
            <div className="relative w-full sm:w-40">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 text-white transition"
              title="Refresh"
              data-aos="fade-left"
            >
              <FiRefreshCw className="text-xl" />
            </button>
            <Link
              href="/admin-dashboard/story/add-featured-story"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              data-aos="fade-left"
            >
              Create New Story
            </Link>
          </div>
        </div>

        {filteredStories.length === 0 ? (
          <div className="bg-blue-800 rounded-xl p-8 text-center shadow-lg" data-aos="fade-up">
            <p className="text-white text-lg">No stories found</p>
          </div>
        ) : (
          <>
            {/* Mobile View: Card Layout */}
            <div className="md:hidden grid grid-cols-1 gap-6">
              {filteredStories.map((story, index) => (
                <div
                  key={story._id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={story.mainImage || '/images/placeholder.jpg'}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      sizes="100vw"
                      quality={85}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="/images/placeholder-blur.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-2">{story.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                      {story.shortDescription || story.metaDescription || 'No description available.'}
                    </p>
                    <div className="flex items-center text-gray-400 text-sm mb-3">
                      <span className="mr-4">{story.category || 'featured'}</span>
                      <span>Views: {story.views || 0}</span>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Link href={`/featured-story/${story.slug}`}>
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition">
                          View
                        </button>
                      </Link>
                      <Link href={`/admin-dashboard/story/edit-featured-story/${story.slug}`}>
                        <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(story.slug)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-gray-900 rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-gray-800/30 text-white">
                    <th className="py-4 px-6 text-left">Title</th>
                    <th className="py-4 px-6 text-left">Category</th>
                    <th className="py-4 px-6 text-left">Views</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStories.map((story, index) => (
                    <tr
                      key={story._id}
                      className="border-b border-gray-700 hover:bg-blue-750 transition"
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <td className="py-4 px-6 text-white">{story.title}</td>
                      <td className="py-4 px-6 text-white">{story.category || 'featured'}</td>
                      <td className="py-4 px-6 text-white">{story.views || 0}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/featured-story/${story.slug}`}>
                            <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition">
                              View
                            </button>
                          </Link>
                          <Link href={`/admin-dashboard/story/edit-featured-story/${story.slug}`}>
                            <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(story.slug)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}