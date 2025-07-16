'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function EditFeaturedStory() {
    const { data: session } = useSession();
    const router = useRouter();
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        metaTitle: '',
        metaDescription: '',
        shortDescription: '',
        mainImage: null,
        category: 'featured',
        tags: '',
        keyPoints: '',
        contentBlocks: [{ type: 'paragraph', content: '', caption: '' }],
    });

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const res = await fetch(`/api/feature/${slug}`);
                if (!res.ok) throw new Error('Failed to fetch story');
                const data = await res.json();

                setFormData({
                    title: data.title,
                    metaTitle: data.metaTitle,
                    metaDescription: data.metaDescription,
                    shortDescription: data.shortDescription,
                    mainImage: null,
                    category: data.category,
                    tags: data.tags.join(', '),
                    keyPoints: data.keyPoints.join('\n'),
                    contentBlocks: data.contentBlocks.map(block => ({
                        ...block,
                        imageFile: null,
                        imageUrl: block.type === 'image' ? block.imageUrl : ''
                    }))
                });
            } catch (error) {
                toast.error('Error loading story');
            } finally {
                setLoading(false);
            }
        };
        fetchStory();
    }, [slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!session) {
            toast.error('You must be logged in to update a story');
            return;
        }

        setLoading(true);

        // Validate required fields
        if (!formData.title || !formData.metaTitle || !formData.metaDescription ||
            !formData.shortDescription) {
            toast.error('Please fill all required fields');
            setLoading(false);
            return;
        }

        // Validate content blocks
        const invalidBlock = formData.contentBlocks.find((block, index) => {
            if (block.type === 'image' && !block.imageUrl && !block.imageFile) {
                toast.error(`Image block ${index + 1} is missing an image`);
                return true;
            }
            if (block.type !== 'image' && !block.content) {
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
        if (formData.mainImage) formDataToSend.append('mainImage', formData.mainImage);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('tags', formData.tags);
        formDataToSend.append('keyPoints', formData.keyPoints);

        // Prepare content blocks with image references
        const blocksForSubmission = formData.contentBlocks.map((block, index) => {
            if (block.type === 'image' && block.imageFile) {
                const imageKey = `image-${index}`;
                formDataToSend.append(imageKey, block.imageFile);
                return {
                    type: 'image',
                    imageKey,
                    imageUrl: block.imageUrl,
                    caption: block.caption || ''
                };
            }
            return block;
        });

        formDataToSend.append('contentBlocks', JSON.stringify(blocksForSubmission));

        try {
            const response = await fetch(`/api/feature/${slug}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update story');
            }

            toast.success('Story updated successfully!');
            router.push('/admin-dashboard/story/all-featured-story');
        } catch (error) {
            console.error('Error updating story:', error);
            toast.error(error.message || 'Error updating story');
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
        setFormData(prev => ({ ...prev, mainImage: e.target.files[0] }));
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
                caption: updatedBlocks[index].caption || ''
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-800 py-12 px-4">
            <Toaster position="top-right" />
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8">Edit Featured Story</h1>
                <form onSubmit={handleSubmit} className="bg-gray-700 p-6 rounded-lg shadow-lg">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white mb-2" htmlFor="title">Title*</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2" htmlFor="metaTitle">Meta Title*</label>
                                <input
                                    type="text"
                                    id="metaTitle"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                    required
                                    maxLength={60}
                                />
                                <p className="text-gray-400 text-sm mt-1">{formData.metaTitle.length}/60 characters</p>
                            </div>
                            <div>
                                <label className="block text-white mb-2" htmlFor="metaDescription">Meta Description*</label>
                                <textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                    rows={3}
                                    required
                                    maxLength={160}
                                />
                                <p className="text-gray-400 text-sm mt-1">{formData.metaDescription.length}/160 characters</p>
                            </div>
                            <div>
                                <label className="block text-white mb-2" htmlFor="shortDescription">Short Description*</label>
                                <textarea
                                    id="shortDescription"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                    rows={3}
                                    required
                                    maxLength={300}
                                />
                                <p className="text-gray-400 text-sm mt-1">{formData.shortDescription.length}/300 characters</p>
                            </div>
                            <div>
                                <label className="block text-white mb-2" htmlFor="mainImage">Main Image (800*450 Px)</label>
                                <input
                                    type="file"
                                    id="mainImage"
                                    name="mainImage"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                />
                                {formData.mainImage ? (
                                    <div className="mt-2">
                                        <img src={URL.createObjectURL(formData.mainImage)} alt="Preview" className="max-h-40 rounded" />
                                    </div>
                                ) : (
                                    <div className="mt-2">
                                        <img src={formData.mainImage || '/images/placeholder.jpg'} alt="Current" className="max-h-40 rounded" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Blocks */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                            Content Blocks
                        </h2>
                        <div className="space-y-6">
                            {formData.contentBlocks.map((block, index) => (
                                <div key={index} className="border border-gray-600 rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-white mb-2">Block {index + 1}</label>
                                        <button
                                            type="button"
                                            onClick={() => removeContentBlock(index)}
                                            className="text-red-500 hover:text-red-400 text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-white mb-2">Type</label>
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
                                                    ...(newType === 'heading' && { level: block.level || 2 }),
                                                };
                                                setFormData(prev => ({ ...prev, contentBlocks: updatedBlocks }));
                                            }}
                                            className="w-full p-2 rounded bg-gray-600 text-white"
                                        >
                                            <option value="paragraph">Paragraph</option>
                                            <option value="heading">Heading</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                            <option value="code">Code</option>
                                        </select>
                                    </div>
                                    {block.type === 'heading' && (
                                        <div className="mb-3">
                                            <label className="block text-white mb-2">Heading Level</label>
                                            <select
                                                value={block.level || 2}
                                                onChange={(e) => handleContentBlockChange(index, 'level', parseInt(e.target.value))}
                                                className="w-full p-2 rounded bg-gray-600 text-white"
                                            >
                                                {[1, 2, 3, 4, 5, 6].map(level => (
                                                    <option key={level} value={level}>H{level}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    {block.type === 'image' ? (
                                        <div className="mb-3">
                                            <label className="block text-white mb-2">Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(index, e.target.files[0])}
                                                className="w-full p-2 rounded bg-gray-600 text-white"
                                            />
                                            {block.imageUrl && (
                                                <div className="mt-2">
                                                    <img src={block.imageUrl} alt="Preview" className="max-h-40 rounded" />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="mb-3">
                                            <label className="block text-white mb-2">
                                                {block.type === 'paragraph' ? 'Text Content' :
                                                    block.type === 'heading' ? 'Heading Text' :
                                                        block.type === 'video' ? 'Video URL' : 'Code Content'}
                                            </label>
                                            <textarea
                                                value={block.content}
                                                onChange={(e) => handleContentBlockChange(index, 'content', e.target.value)}
                                                className="w-full p-2 rounded bg-gray-600 text-white"
                                                rows={block.type === 'code' ? 6 : 4}
                                                required={block.type !== 'image'}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-white mb-2">Caption (Optional)</label>
                                        <input
                                            type="text"
                                            value={block.caption}
                                            onChange={(e) => handleContentBlockChange(index, 'caption', e.target.value)}
                                            className="w-full p-2 rounded bg-gray-600 text-white"
                                            placeholder="Add a caption if needed"
                                        />
                                    </div>
                                </div>
                            ))}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('paragraph')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Add Paragraph
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('heading')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Add Heading
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addContentBlock('image')}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                                >
                                    Add Image
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">
                            Additional Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white mb-2" htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="tech">Tech</option>
                                    <option value="travel">Travel</option>
                                    <option value="seo">SEO</option>
                                    <option value="personal">Personal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-white mb-2" htmlFor="tags">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>
                            <div>
                                <label className="block text-white mb-2" htmlFor="keyPoints">Key Points (one per line)</label>
                                <textarea
                                    id="keyPoints"
                                    name="keyPoints"
                                    value={formData.keyPoints}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded bg-gray-600 text-white"
                                    rows={4}
                                    placeholder="Enter each key point on a new line"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full disabled:bg-blue-400"
                        disabled={loading}
                    >
                        {loading ? 'Updating Story...' : 'Update Story'}
                    </button>
                </form>
            </div>
        </div>
    );
}