'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiImage, FiType, FiCode, FiVideo, FiSave, FiArrowLeft, FiTag } from 'react-icons/fi';
import { useDebounce } from '@/app/components/hooks/useDebounce';
import slugify from 'slugify';

// Predefined categories
const PREDEFINED_CATEGORIES = ['featured', 'tech', 'travel', 'seo', 'personal', 'lifestyle', 'business'];

export default function CreateFeaturedStory() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [categories, setCategories] = useState(PREDEFINED_CATEGORIES);
    const [slugError, setSlugError] = useState('');
    const [slugLoading, setSlugLoading] = useState(false);
    const [generatedSlug, setGeneratedSlug] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        metaTitle: '',
        metaDescription: '',
        shortDescription: '',
        mainImage: null,
        mainImageAlt: '',
        category: 'featured',
        tags: '',
        keyPoints: '',
        contentBlocks: [{
            type: 'paragraph',
            content: '',
            caption: '',
            alt: ''
        }],
    });

    // Use the debounce hook
    const debouncedTitle = useDebounce(formData.title, 500);

    // Load categories from localStorage on component mount
    useEffect(() => {
        const savedCategories = localStorage.getItem('customCategories');
        if (savedCategories) {
            const customCategories = JSON.parse(savedCategories);
            setCategories([...PREDEFINED_CATEGORIES, ...customCategories]);
        }
    }, []);

    // Generate slug and check availability
    useEffect(() => {
        if (debouncedTitle.trim()) {
            generateAndCheckSlug(debouncedTitle);
        } else {
            setGeneratedSlug('');
            setSlugError('');
        }
    }, [debouncedTitle]);

    const generateAndCheckSlug = async (title) => {
        const baseSlug = slugify(title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        });

        setGeneratedSlug(baseSlug);
        setSlugLoading(true);
        setSlugError('');

        try {
            const response = await fetch(`/api/feature/check-slug?slug=${encodeURIComponent(baseSlug)}`);
            if (response.ok) {
                const data = await response.json();

                if (data.exists) {
                    setSlugError(`"${baseSlug}" slug is already taken. A unique version will be generated automatically.`);
                } else {
                    setSlugError('');
                }
            }
        } catch (error) {
            console.error('Error checking slug:', error);
            setSlugError('Error checking slug availability');
        } finally {
            setSlugLoading(false);
        }
    };

    // Load categories from localStorage on component mount
    useEffect(() => {
        const savedCategories = localStorage.getItem('customCategories');
        if (savedCategories) {
            const customCategories = JSON.parse(savedCategories);
            setCategories([...PREDEFINED_CATEGORIES, ...customCategories]);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!session) {
            toast.error('You must be logged in to create a story');
            return;
        }

        setLoading(true);

        // Validate required fields
        if (!formData.title || !formData.metaTitle || !formData.metaDescription ||
            !formData.shortDescription || !formData.mainImage) {
            toast.error('Please fill all required fields');
            setLoading(false);
            return;
        }

        // Validate content blocks
        const invalidBlock = formData.contentBlocks.find((block, index) => {
            if (block.type === 'image') {
                if (!block.imageFile) {
                    toast.error(`Image block ${index + 1} is missing an image`);
                    return true;
                }
                if (!block.alt) {
                    toast.error(`Image block ${index + 1} is missing ALT text`);
                    return true;
                }
            } else if (!block.content) {
                toast.error(`Block ${index + 1} is missing content`);
                return true;
            }
            return false;
        });

        if (invalidBlock) {
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();

        // Append scalar fields
        formDataToSend.append('title', formData.title);
        formDataToSend.append('metaTitle', formData.metaTitle);
        formDataToSend.append('metaDescription', formData.metaDescription);
        formDataToSend.append('shortDescription', formData.shortDescription);
        formDataToSend.append('mainImage', formData.mainImage);
        formDataToSend.append('mainImageAlt', formData.mainImageAlt);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('tags', formData.tags);
        formDataToSend.append('keyPoints', formData.keyPoints);
        formDataToSend.append('slug', generatedSlug); // Add the generated slug to FormData

        // Prepare content blocks with image references and ALT text
        const blocksForSubmission = formData.contentBlocks.map((block, index) => {
            if (block.type === 'image') {
                const imageKey = `image-${index}`;
                formDataToSend.append(imageKey, block.imageFile);
                return {
                    type: 'image',
                    imageKey: imageKey,
                    caption: block.caption || '',
                    alt: block.alt || ''
                };
            }
            return {
                ...block,
                alt: block.alt || ''
            };
        });

        console.log('Submitting content blocks:', blocksForSubmission);
        formDataToSend.append('contentBlocks', JSON.stringify(blocksForSubmission));

        try {
            const response = await fetch('/api/feature', {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to create story');
            }

            console.log('Story created:', data);
            toast.success('Story created successfully!');
            router.push('/admin-dashboard/story/all-featured-story');
        } catch (error) {
            console.error('Error creating story:', error);
            toast.error(error.message || 'Error creating story');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentBlockChange = (index, field, value) => {
        const updatedBlocks = [...formData.contentBlocks];
        updatedBlocks[index][field] = value;
        setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
    };

    const addContentBlock = (type = 'paragraph') => {
        setFormData(prev => ({
            ...prev,
            contentBlocks: [
                ...prev.contentBlocks,
                {
                    type,
                    content: '',
                    caption: '',
                    alt: '',
                    ...(type === 'heading' && { level: 2 }),
                    ...(type === 'image' && { imageUrl: '', imageFile: null }),
                }
            ]
        }));
    };

    const removeContentBlock = (index) => {
        if (formData.contentBlocks.length <= 1) {
            toast.error('You must have at least one content block');
            return;
        }
        setFormData(prev => ({
            ...prev,
            contentBlocks: prev.contentBlocks.filter((_, i) => i !== index)
        }));
    };

    const handleMainImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            mainImage: e.target.files[0],
            mainImageAlt: '' // Reset ALT when new image is selected
        }));
    };

    const handleImageUpload = (index, file) => {
        if (!file) return;

        setLoading(true);
        try {
            const previewUrl = URL.createObjectURL(file);

            const updatedBlocks = [...formData.contentBlocks];
            updatedBlocks[index] = {
                ...updatedBlocks[index],
                type: 'image',
                imageUrl: previewUrl,
                imageFile: file,
                caption: updatedBlocks[index].caption || '',
                alt: updatedBlocks[index].alt || ''
            };

            setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
            toast.success('Image added successfully');
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to add image');
        } finally {
            setLoading(false);
        }
    };

    const addNewCategory = () => {
        if (!newCategory.trim()) {
            toast.error('Please enter a category name');
            return;
        }

        const categorySlug = newCategory.toLowerCase().replace(/\s+/g, '-');

        if (categories.includes(categorySlug)) {
            toast.error('Category already exists');
            return;
        }

        // Add to local state
        const updatedCategories = [...categories, categorySlug];
        setCategories(updatedCategories);

        // Save to localStorage
        const customCategories = updatedCategories.filter(cat => !PREDEFINED_CATEGORIES.includes(cat));
        localStorage.setItem('customCategories', JSON.stringify(customCategories));

        // Set as selected category
        setFormData(prev => ({ ...prev, category: categorySlug }));
        setNewCategory('');
        setShowNewCategory(false);
        toast.success('Category added successfully!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-purple-300 hover:text-purple-200 mb-4 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        <span>Back</span>
                    </button>

                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                        Create Featured Story
                    </h1>
                    <p className="text-gray-400">Create an engaging story with rich content</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 mb-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium" htmlFor="title">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="Enter story title"
                                        required
                                    />

                                    {/* Slug Preview & Validation */}
                                    {formData.title && (
                                        <div className="mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-gray-400 text-sm">Generated Slug:</span>
                                                <code className="text-purple-300 bg-purple-900/30 px-2 py-1 rounded text-xs font-mono">
                                                    {generatedSlug}
                                                </code>
                                                {slugLoading && (
                                                    <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                )}
                                            </div>
                                            {slugError && (
                                                <p className="text-yellow-400 text-xs flex items-center gap-1">
                                                    <span>⚠️</span>
                                                    {slugError}
                                                </p>
                                            )}
                                            {!slugError && generatedSlug && !slugLoading && (
                                                <p className="text-green-400 text-xs flex items-center gap-1">
                                                    <span>✓</span>
                                                    Slug is available
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium" htmlFor="metaTitle">
                                        Meta Title *
                                    </label>
                                    <input
                                        type="text"
                                        id="metaTitle"
                                        name="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="SEO meta title"
                                        required
                                        maxLength={65}
                                    />
                                    <p className="text-gray-400 text-sm mt-2">
                                        {formData.metaTitle.length}/65 characters
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium" htmlFor="metaDescription">
                                    Meta Description *
                                </label>
                                <textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    rows={3}
                                    placeholder="SEO meta description"
                                    required
                                    maxLength={160}
                                />
                                <p className="text-gray-400 text-sm mt-2">
                                    {formData.metaDescription.length}/160 characters
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-gray-300 mb-2 font-medium" htmlFor="shortDescription">
                                Short Description *
                            </label>
                            <textarea
                                id="shortDescription"
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                rows={3}
                                placeholder="Brief description of your story"
                                required
                                maxLength={300}
                            />
                            <p className="text-gray-400 text-sm mt-2">
                                {formData.shortDescription.length}/300 characters
                            </p>
                        </div>
                    </div>

                    {/* Main Image Section */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Main Image
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium" htmlFor="mainImage">
                                    Main Image * (800×450px)
                                </label>
                                <input
                                    type="file"
                                    id="mainImage"
                                    name="mainImage"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all"
                                    required
                                />
                                {formData.mainImage && (
                                    <div className="mt-4">
                                        <img
                                            src={URL.createObjectURL(formData.mainImage)}
                                            alt="Main image preview"
                                            className="max-h-48 rounded-xl border border-gray-600"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2 font-medium" htmlFor="mainImageAlt">
                                    Main Image ALT Text *
                                </label>
                                <input
                                    type="text"
                                    id="mainImageAlt"
                                    name="mainImageAlt"
                                    value={formData.mainImageAlt}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    placeholder="Describe the main image for accessibility"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Content Blocks Section */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Content Blocks
                        </h2>

                        <div className="space-y-6">
                            {formData.contentBlocks.map((block, index) => (
                                <div key={index} className="border border-gray-600 rounded-xl p-6 bg-gray-700/30">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                            <span className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs">
                                                {index + 1}
                                            </span>
                                            Block {index + 1} - {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => removeContentBlock(index)}
                                            className="flex items-center gap-2 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">Block Type</label>
                                            <select
                                                value={block.type}
                                                onChange={(e) => {
                                                    const newType = e.target.value;
                                                    const updatedBlocks = [...formData.contentBlocks];
                                                    updatedBlocks[index] = {
                                                        type: newType,
                                                        content: newType !== 'image' ? block.content || '' : '',
                                                        imageUrl: newType === 'image' ? block.imageUrl || '' : '',
                                                        imageFile: newType === 'image' ? block.imageFile || null : null,
                                                        caption: block.caption || '',
                                                        alt: block.alt || '',
                                                        ...(newType === 'heading' && { level: block.level || 2 }),
                                                    };
                                                    setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                                                }}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            >
                                                <option value="paragraph">Paragraph</option>
                                                <option value="heading">Heading</option>
                                                <option value="image">Image</option>
                                                <option value="video">Video</option>
                                                <option value="code">Code</option>
                                            </select>
                                        </div>

                                        {block.type === 'heading' && (
                                            <div>
                                                <label className="block text-gray-300 mb-2 font-medium">Heading Level</label>
                                                <select
                                                    value={block.level || 2}
                                                    onChange={(e) =>
                                                        handleContentBlockChange(index, 'level', parseInt(e.target.value))
                                                    }
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                                >
                                                    {[1, 2, 3, 4, 5, 6].map(level => (
                                                        <option key={level} value={level}>H{level}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {block.type === 'image' ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-gray-300 mb-2 font-medium">Image *</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 transition-all"
                                                />
                                                {block.imageUrl && (
                                                    <div className="mt-4">
                                                        <img
                                                            src={block.imageUrl}
                                                            alt="Content block preview"
                                                            className="max-h-48 rounded-xl border border-gray-600"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-gray-300 mb-2 font-medium">Image ALT Text *</label>
                                                <input
                                                    type="text"
                                                    value={block.alt}
                                                    onChange={(e) => handleContentBlockChange(index, 'alt', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                                    placeholder="Describe the image for accessibility"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block text-gray-300 mb-2 font-medium">
                                                {block.type === 'paragraph' ? 'Text Content' :
                                                    block.type === 'heading' ? 'Heading Text' :
                                                        block.type === 'video' ? 'Video URL' : 'Code Content'} *
                                            </label>
                                            <textarea
                                                value={block.content}
                                                onChange={(e) => handleContentBlockChange(index, 'content', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all font-mono"
                                                rows={block.type === 'code' ? 6 : 4}
                                                placeholder={
                                                    block.type === 'code' ? 'Enter your code here...' :
                                                        block.type === 'video' ? 'Enter video URL...' :
                                                            'Enter your content here...'
                                                }
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <label className="block text-gray-300 mb-2 font-medium">Caption (Optional)</label>
                                        <input
                                            type="text"
                                            value={block.caption}
                                            onChange={(e) => handleContentBlockChange(index, 'caption', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            placeholder="Add a caption if needed"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Add Block Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('paragraph')}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FiType className="w-4 h-4" />
                                    Add Paragraph
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('heading')}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FiType className="w-4 h-4" />
                                    Add Heading
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('image')}
                                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FiImage className="w-4 h-4" />
                                    Add Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('code')}
                                    className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <FiCode className="w-4 h-4" />
                                    Add Code
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 backdrop-blur-sm">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            Additional Information
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Category Section */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium" htmlFor="category">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Add New Category */}
                                {!showNewCategory ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCategory(true)}
                                        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Add New Category
                                    </button>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="block text-gray-300 mb-2 font-medium">New Category</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                className="flex-1 px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                                placeholder="Enter new category"
                                            />
                                            <button
                                                type="button"
                                                onClick={addNewCategory}
                                                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
                                            >
                                                Add
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNewCategory(false);
                                                    setNewCategory('');
                                                }}
                                                className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium" htmlFor="tags">
                                        Tags (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="technology, web-development, nextjs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-gray-300 mb-2 font-medium" htmlFor="keyPoints">
                                Key Points (one per line)
                            </label>
                            <textarea
                                id="keyPoints"
                                name="keyPoints"
                                value={formData.keyPoints}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                rows={4}
                                placeholder="Enter each key point on a new line"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <FiSave className="w-5 h-5" />
                            {loading ? 'Creating Story...' : 'Create Story'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}