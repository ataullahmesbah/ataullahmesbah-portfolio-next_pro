// src/app/admin/projects/page.js
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageProjectsPage = () => {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        contentShort: '', // Renamed from shortDescription to contentShort
        contentSections: [{ content: '', tag: 'p', bulletPoints: [] }],
        category: 'Marketing',
        newCategory: '',
        keyPoints: [],
        websiteFeatures: [],
        supportSystem: '',
        metaDescription: '',
        imageAlt: '',
        mainImage: null,
        gallery: [],
        galleryNames: [],
        galleryAlts: [],
    });

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (!response.ok) throw new Error('Failed to fetch projects');
                const data = await response.json();
                setProjects(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'metaDescription' && value.length > 160) {
            return;
        }
        if (name === 'contentShort' && value.length > 250) { // Updated to contentShort
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'mainImage') {
            setFormData((prev) => ({ ...prev, mainImage: files[0] }));
        } else if (name === 'gallery') {
            const newGallery = Array.from(files);
            setFormData((prev) => ({
                ...prev,
                gallery: [...prev.gallery, ...newGallery],
                galleryNames: [...prev.galleryNames, ...newGallery.map(() => '')],
                galleryAlts: [...prev.galleryAlts, ...newGallery.map(() => '')],
            }));
        }
    };

    const handleArrayInputChange = (e, field) => {
        const values = e.target.value.split(',').map(item => item.trim()).filter(item => item);
        setFormData((prev) => ({ ...prev, [field]: values }));
    };

    const handleContentSectionChange = (index, field, value) => {
        const updatedSections = [...formData.contentSections];
        if (field === 'bulletPoints') {
            updatedSections[index][field] = value ? value.split(',').map(item => item.trim()).filter(item => item) : [];
        } else {
            updatedSections[index][field] = value;
        }
        setFormData((prev) => ({ ...prev, contentSections: updatedSections }));
    };

    const addContentSection = () => {
        setFormData((prev) => ({
            ...prev,
            contentSections: [...prev.contentSections, { content: '', tag: 'p', bulletPoints: [] }],
        }));
    };

    const handleGalleryMetaChange = (index, field, value) => {
        setFormData((prev) => {
            const updatedArray = [...prev[field]];
            updatedArray[index] = value;
            return { ...prev, [field]: updatedArray };
        });
    };

    const addMoreImages = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.name = 'gallery';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = handleFileChange;
        input.click();
    };

    const handleEdit = (project) => {
        if (!confirm(`Are you sure you want to edit the project "${project.title}"?`)) return;
        setEditingProject(project);
        setFormData({
            title: project.title,
            subtitle: project.subtitle,
            description: project.description,
            contentShort: project.contentShort || '', // Updated to contentShort
            contentSections: project.content && project.content.length > 0
                ? project.content.map(section => ({
                    content: section.content,
                    tag: section.tag,
                    bulletPoints: section.bulletPoints || [],
                }))
                : [{ content: '', tag: 'p', bulletPoints: [] }],
            category: project.category,
            newCategory: '',
            keyPoints: project.keyPoints || [],
            websiteFeatures: project.websiteFeatures || [],
            supportSystem: project.supportSystem || '',
            metaDescription: project.metaDescription,
            imageAlt: project.imageAlt,
            mainImage: null,
            gallery: [],
            galleryNames: [],
            galleryAlts: [],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('subtitle', formData.subtitle);
        data.append('description', formData.description);
        data.append('contentShort', formData.contentShort); // Updated to contentShort

        // Append content sections as a JSON string
        data.append('content', JSON.stringify(formData.contentSections.map(section => ({
            content: section.content,
            tag: section.tag,
            bulletPoints: section.bulletPoints,
        }))));

        data.append('category', formData.newCategory || formData.category);
        formData.keyPoints.forEach((point) => data.append('keyPoints', point));
        formData.websiteFeatures.forEach((feature) => data.append('websiteFeatures', feature));
        data.append('supportSystem', formData.supportSystem);
        data.append('metaDescription', formData.metaDescription);
        data.append('imageAlt', formData.imageAlt);
        if (formData.mainImage) data.append('mainImage', formData.mainImage);

        formData.gallery.forEach((file, index) => {
            data.append('gallery', file);
            data.append('galleryNames', formData.galleryNames[index] || `Gallery Image ${index + 1}`);
            data.append('galleryAlts', formData.galleryAlts[index] || `Gallery image ${index + 1} for ${formData.title}`);
        });

        try {
            const response = await fetch(`/api/projects/${editingProject._id}`, {
                method: 'PUT',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update project');
            }

            const result = await response.json();
            toast.success(result.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            // Refresh projects list
            const updatedProjects = await fetch('/api/projects').then(res => res.json());
            setProjects(updatedProjects);

            // Reset form
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                contentShort: '',
                contentSections: [{ content: '', tag: 'p', bulletPoints: [] }],
                category: 'Marketing',
                newCategory: '',
                keyPoints: [],
                websiteFeatures: [],
                supportSystem: '',
                metaDescription: '',
                imageAlt: '',
                mainImage: null,
                gallery: [],
                galleryNames: [],
                galleryAlts: [],
            });
            setEditingProject(null);
        } catch (err) {
            console.error('Error updating project:', err);
            toast.error('Error: ' + err.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!confirm(`Are you sure you want to delete the project "${title}"?`)) return;
        try {
            const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete project');
            const result = await response.json();
            toast.success(`Project "${title}" deleted successfully!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setProjects(projects.filter(project => project._id !== id));
        } catch (err) {
            console.error('Error deleting project:', err);
            toast.error('Error: ' + err.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const predefinedCategories = ['Marketing', 'Ecommerce', 'Travel', 'Blog', 'Personal Portfolio', 'Other'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-lg text-center max-w-md mx-auto mt-10">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="bg-gray-900 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-12 text-center tracking-tight">
                Manage Projects
            </h1>
            <div className="text-center mb-12">
                <Link href="/admin-dashboard/projects/add">
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-md">
                        Add New Project
                    </button>
                </Link>
            </div>

            {/* Edit Project Form */}
            {editingProject && (
                <div className="max-w-3xl mx-auto bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg mb-12">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Edit Project</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Subtitle</label>
                            <input
                                type="text"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Short Description (max 250 characters)</label>
                            <textarea
                                name="contentShort" // Updated to contentShort
                                value={formData.contentShort}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                required
                            />
                            <p className="text-gray-400 text-sm mt-1">
                                {formData.contentShort.length}/250 characters
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                required
                            />
                        </div>
                        {/* Content Sections */}
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Additional Content</label>
                            {formData.contentSections.map((section, index) => (
                                <div key={index} className="space-y-3 mb-4 p-4 bg-gray-700 rounded-lg">
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Tag</label>
                                        <select
                                            value={section.tag}
                                            onChange={(e) => handleContentSectionChange(index, 'tag', e.target.value)}
                                            className="w-full p-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="p">Paragraph</option>
                                            <option value="h1">H1</option>
                                            <option value="h2">H2</option>
                                            <option value="h3">H3</option>
                                            <option value="h4">H4</option>
                                            <option value="h5">H5</option>
                                            <option value="h6">H6</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Content for {section.tag.toUpperCase()} (SEO)</label>
                                        <textarea
                                            value={section.content}
                                            onChange={(e) => handleContentSectionChange(index, 'content', e.target.value)}
                                            className="w-full p-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Add content for ${section.tag.toUpperCase()} tag...`}
                                            rows="3"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-sm mb-1">Bullet Points (comma-separated, optional)</label>
                                        <input
                                            type="text"
                                            value={section.bulletPoints.join(', ')}
                                            onChange={(e) => handleContentSectionChange(index, 'bulletPoints', e.target.value)}
                                            className="w-full p-2 rounded-lg bg-gray-600 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Point 1, Point 2"
                                        />
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addContentSection}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Add More Content
                            </button>
                        </div>
                        {/* Category */}
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {predefinedCategories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <div className="mt-3">
                                <label className="block text-gray-300 font-medium mb-1">Add New Category</label>
                                <input
                                    type="text"
                                    name="newCategory"
                                    value={formData.newCategory}
                                    onChange={handleInputChange}
                                    className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter new category (optional)"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Meta Description (SEO, max 160 characters)</label>
                            <textarea
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="2"
                                required
                            />
                            <p className="text-gray-400 text-sm mt-1">
                                {formData.metaDescription.length}/160 characters
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Main Image Alt Text (SEO)</label>
                            <input
                                type="text"
                                name="imageAlt"
                                value={formData.imageAlt}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Key Points (comma-separated, optional)</label>
                            <input
                                type="text"
                                value={formData.keyPoints.join(', ')}
                                onChange={(e) => handleArrayInputChange(e, 'keyPoints')}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Feature 1, Feature 2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Website Features (comma-separated, optional)</label>
                            <input
                                type="text"
                                value={formData.websiteFeatures.join(', ')}
                                onChange={(e) => handleArrayInputChange(e, 'websiteFeatures')}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. Feature 1, Feature 2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Support System (optional)</label>
                            <input
                                type="text"
                                name="supportSystem"
                                value={formData.supportSystem}
                                onChange={handleInputChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Main Image (Leave empty to keep existing) - 1600px × 900px (16:9 aspect ratio)</label>
                            <input
                                type="file"
                                name="mainImage"
                                onChange={handleFileChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                accept="image/*"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 font-medium mb-1">Gallery Images (Leave empty to keep existing)</label>
                            <input
                                type="file"
                                name="gallery"
                                onChange={handleFileChange}
                                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                accept="image/*"
                                multiple
                            />
                            <button
                                type="button"
                                onClick={addMoreImages}
                                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                            >
                                Add More Images
                            </button>
                        </div>
                        {/* Gallery Names and Alts */}
                        {formData.gallery.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-gray-300 font-medium">Gallery Image Details</h3>
                                {formData.gallery.map((_, index) => (
                                    <div key={index} className="space-y-2">
                                        <label className="block text-gray-400 text-sm">Image {index + 1} Name</label>
                                        <input
                                            type="text"
                                            value={formData.galleryNames[index] || ''}
                                            onChange={(e) => handleGalleryMetaChange(index, 'galleryNames', e.target.value)}
                                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Gallery Image ${index + 1}`}
                                        />
                                        <label className="block text-gray-400 text-sm">Image {index + 1} Alt Text (SEO)</label>
                                        <input
                                            type="text"
                                            value={formData.galleryAlts[index] || ''}
                                            onChange={(e) => handleGalleryMetaChange(index, 'galleryAlts', e.target.value)}
                                            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder={`Gallery image ${index + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full px-4 py-3 rounded-lg font-medium text-white transition flex items-center justify-center ${isSubmitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 mr-2 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Updating Project...
                                    </>
                                ) : (
                                    'Update Project'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingProject(null);
                                    setFormData({
                                        title: '',
                                        subtitle: '',
                                        description: '',
                                        contentShort: '',
                                        contentSections: [{ content: '', tag: 'p', bulletPoints: [] }],
                                        category: 'Marketing',
                                        newCategory: '',
                                        keyPoints: [],
                                        websiteFeatures: [],
                                        supportSystem: '',
                                        metaDescription: '',
                                        imageAlt: '',
                                        mainImage: null,
                                        gallery: [],
                                        galleryNames: [],
                                        galleryAlts: [],
                                    });
                                }}
                                className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition shadow-md"
                            >
                                Cancel Edit
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Projects Table */}
            <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-6">Projects List ({projects.length})</h2>
                {projects.length === 0 ? (
                    <p className="text-gray-400 text-center">No projects found. Add a new project to get started!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr className="bg-gray-700 text-gray-200">
                                    <th className="p-4 text-sm font-semibold rounded-tl-lg">Serial</th>
                                    <th className="p-4 text-sm font-semibold">Title</th>
                                    <th className="p-4 text-sm font-semibold">Category</th>
                                    <th className="p-4 text-sm font-semibold">Views</th>
                                    <th className="p-4 text-sm font-semibold rounded-tr-lg">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project, index) => (
                                    <tr
                                        key={project._id}
                                        className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors"
                                    >
                                        <td className="p-4 text-gray-300 text-sm">{index + 1}</td>
                                        <td className="p-4 text-base text-white font-medium">{project.title}</td>
                                        <td className="p-4 text-gray-300 text-sm">{project.category}</td>
                                        <td className="p-4 text-gray-300 text-sm">
                                            {(project.views || 0).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(project)}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(project._id, project.title)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                                <Link href={`/projects/${project.slug}`}>
                                                    <button className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition">
                                                        View
                                                    </button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default ManageProjectsPage;