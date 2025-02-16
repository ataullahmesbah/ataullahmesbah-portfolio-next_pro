"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AddBlogPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    tags: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Multiple Image Upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });

    // Show Previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const blogData = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((file) => blogData.append("images", file));
      } else {
        blogData.append(key, formData[key]);
      }
    }

    const res = await fetch("/api/blogs/add", {
      method: "POST",
      body: blogData,
    });

    const result = await res.json();
    if (res.ok) {
      alert("Blog post added successfully!");
      router.push("/with-layout/blog");
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add a New Blog Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Blog Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        {/* Meta Title */}
        <input
          type="text"
          name="metaTitle"
          placeholder="SEO Meta Title"
          value={formData.metaTitle}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Meta Description */}
        <textarea
          name="metaDescription"
          placeholder="SEO Meta Description"
          value={formData.metaDescription}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Tags */}
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Short Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Content */}
        <textarea
          name="content"
          placeholder="Full Blog Content"
          value={formData.content}
          onChange={handleChange}
          rows={6}
          className="w-full p-2 border rounded"
          required
        />

        {/* Image Upload */}
        <input
          type="file"
          name="images"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* Image Previews */}
        <div className="grid grid-cols-3 gap-2">
          {imagePreviews.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded"
              width={full}
              height={96}
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Publish Blog
        </button>
      </form>
    </main>
  );
}
