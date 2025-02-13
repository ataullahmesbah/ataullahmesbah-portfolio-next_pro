"use client";
import { useState } from "react";

const AddTestimonial = () => {
    const [formData, setFormData] = useState({
        user_name: "",
        user_position: "",
        rating: "",
        description: "",
        image: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage("✅ Testimonial added successfully!");
                setFormData({
                    user_name: "",
                    user_position: "",
                    rating: "",
                    description: "",
                    image: ""
                });
            } else {
                setMessage(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error submitting testimonial:", error);
            setMessage("❌ Failed to add testimonial.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-6 p-6 bg-gray-700 text-white rounded-lg">
            <h2 className="text-xl font-bold mb-4">Add Testimonial</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="user_name"
                    value={formData.user_name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full p-2 rounded text-black"
                    required
                />
                <input
                    type="text"
                    name="user_position"
                    value={formData.user_position}
                    onChange={handleChange}
                    placeholder="Position"
                    className="w-full p-2 rounded text-black"
                />
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Rating (1-5)"
                    className="w-full p-2 rounded text-black"
                    min="1"
                    max="5"
                    required
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full p-2 rounded text-black"
                    required
                />
                <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL (optional)"
                    className="w-full p-2 rounded text-black"
                />
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Testimonial"}
                </button>
            </form>
            {message && <p className="mt-3 text-center">{message}</p>}
        </div>
    );
};

export default AddTestimonial;