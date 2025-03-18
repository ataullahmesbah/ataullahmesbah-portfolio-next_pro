// app/admin/addBlog/page.js

'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

export default function CreateBlog() {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState([
    { type: 'text', data: '', alt: '' }, // Default content block
  ]);
  const [keyPoints, setKeyPoints] = useState(['']); // Default key point
  const [tags, setTags] = useState(['']); // Default tag
  const [categories, setCategories] = useState(['']); // Default category
  const [loading, setLoading] = useState(false);
  const [metaDescription, setMetaDescription] = useState('');

  // Add a new content block (text or image)
  const addContentBlock = (type) => {
    setContent([...content, { type, data: '', alt: '' }]);
  };

  // Update content block data
  const updateContentBlock = (index, field, value) => {
    const updatedContent = [...content];
    updatedContent[index][field] = value;
    setContent(updatedContent);
  };

  // Add a new key point
  const addKeyPoint = () => {
    setKeyPoints([...keyPoints, '']);
  };

  // Update a key point
  const updateKeyPoint = (index, value) => {
    const updatedKeyPoints = [...keyPoints];
    updatedKeyPoints[index] = value;
    setKeyPoints(updatedKeyPoints);
  };

  // Add a new tag
  const addTag = () => {
    setTags([...tags, '']);
  };

  // Update a tag
  const updateTag = (index, value) => {
    const updatedTags = [...tags];
    updatedTags[index] = value;
    setTags(updatedTags);
  };

  // Add a new category
  const addCategory = () => {
    setCategories([...categories, '']);
  };

  // Update a category
  const updateCategory = (index, value) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = value;
    setCategories(updatedCategories);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare the form data
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('mainImage', mainImage);
    formData.append('shortDescription', shortDescription);
    formData.append('metaDescription', metaDescription); // Use the new metaDescription field
    formData.append('author', session.user.name); // Default to logged-in user's name

    // Ensure content is properly formatted
    const formattedContent = content.map((block, index) => {
      if (block.type === 'image' && block.data instanceof File) {
        // Append each image file to FormData with a unique field name
        formData.append(`contentImages_${index}`, block.data); // Unique field name for each image
        return {
          type: block.type,
          data: block.data.name, // Use the file name as a placeholder
          alt: block.alt || '', // Alt text for image
        };
      } else {
        return {
          type: block.type,
          data: block.data, // String for text
          alt: block.alt || '', // Alt text for image (if applicable)
        };
      }
    });

    formData.append('content', JSON.stringify(formattedContent)); // Ensure this is an array of objects
    formData.append('keyPoints', JSON.stringify(keyPoints)); // Ensure this is an array of strings
    formData.append('publishDate', new Date().toISOString());
    formData.append('metaTitle', title); // Meta title same as title
    formData.append('tags', JSON.stringify(tags)); // Ensure this is an array of strings
    formData.append('categories', JSON.stringify(categories)); // Ensure this is an array of strings
    formData.append('auth', session.user.id); // User ID or auth token

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Blog post created successfully');
        // Reset form fields after successful submission
        setTitle('');
        setSlug('');
        setMainImage(null);
        setShortDescription('');
        setMetaDescription(''); // Reset metaDescription
        setContent([{ type: 'text', data: '', alt: '' }]);
        setKeyPoints(['']);
        setTags(['']);
        setCategories(['']);
      } else {
        toast.error(data.error || 'Failed to create blog post');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const formatSlug = (text) => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/\s+/g, '-') // Replace spaces with '-'
      .slice(0, 60); // Limit to 60 characters
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Create Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title: (50-60)* characters</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            maxLength={60} // Enforce 60-character limit
            required
          />
        </div>


        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Slug: (50-60)* characters</label>

          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(formatSlug(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Main Image</label>
          <input
            type="file"
            onChange={(e) => setMainImage(e.target.files[0])}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Meta Description (SEO) (Max 160)* characters</label>
          <textarea
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))} // Limit to 160 characters
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            maxLength={160} // Enforce 160-character limit
            required
          />
          <p className="text-sm text-gray-500">{metaDescription.length}/160</p> {/* Character counter */}
        </div>

        {/* Content Blocks */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          {content.map((block, index) => (
            <div key={index} className="mt-4">
              {block.type === 'text' ? (
                <textarea
                  value={block.data}
                  onChange={(e) => updateContentBlock(index, 'data', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter text content"
                  required
                />
              ) : (
                <div>
                  <input
                    type="file"
                    onChange={(e) => updateContentBlock(index, 'data', e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    value={block.alt}
                    onChange={(e) => updateContentBlock(index, 'alt', e.target.value)}
                    className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Alt text for image"
                  />
                </div>
              )}
              <button
                type="button"
                onClick={() => addContentBlock('text')}
                className="mt-2 text-sm text-blue-500"
              >
                Add Text Block
              </button>
              <button
                type="button"
                onClick={() => addContentBlock('image')}
                className="mt-2 ml-2 text-sm text-blue-500"
              >
                Add Image Block
              </button>
            </div>
          ))}
        </div>

        {/* Key Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Key Points</label>
          {keyPoints.map((point, index) => (
            <div key={index} className="mt-2">
              <input
                type="text"
                value={point}
                onChange={(e) => updateKeyPoint(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter key point"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addKeyPoint}
            className="mt-2 text-sm text-blue-500"
          >
            Add Key Point
          </button>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          {tags.map((tag, index) => (
            <div key={index} className="mt-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter tag"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addTag}
            className="mt-2 text-sm text-blue-500"
          >
            Add Tag
          </button>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Categories</label>
          {categories.map((category, index) => (
            <div key={index} className="mt-2">
              <input
                type="text"
                value={category}
                onChange={(e) => updateCategory(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter category"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addCategory}
            className="mt-2 text-sm text-blue-500"
          >
            Add Category
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {loading ? 'Creating...' : 'Create Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
}