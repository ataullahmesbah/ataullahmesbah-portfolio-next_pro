"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTestimonial = () => {
    const [formData, setFormData] = useState({
        user_name: "",
        user_position: "",
        rating: "",
        description: "",
        image: "",
        categories: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const { user_name, user_position, rating, description, image, categories } = formData;
        if (!user_name || !user_position || !rating || !description || !image || !categories) {
            toast.error("❌ All fields are required!");
            return;
        }

        // Validate rating
        const ratingValue = parseInt(rating);
        if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
            toast.error("❌ Rating must be between 1 and 5!");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("Testimonial added successfully!");
                setFormData({
                    user_name: "",
                    user_position: "",
                    rating: "",
                    description: "",
                    image: "",
                    categories: ""
                });
            } else {
                toast.error(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error submitting testimonial:", error);
            toast.error("❌ Failed to add testimonial.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen py-16">
            {/* ToastContainer for displaying toast messages */}
            <ToastContainer position="top-center" autoClose={3000} />

            <div className="max-w-4xl mx-auto text-white text-center space-y-5 py-5">
                <h1 className="text-3xl font-semibold">When my clients speak, their experiences tell the story.</h1>
                <p className="text-xl">Discover what our clients say about their journeys with us — real stories, genuine feedback, and trusted experiences that define our commitment to excellence.</p>
            </div>

            <div className="max-w-lg mx-auto bg-gray-700 border-e-purple-600 border-e-4 shadow-md shadow-blue-500 hover:shadow-2xl hover:shadow-blue-500 rounded-lg p-6 text-center transition-transform transform hover:scale-105 duration-1000">
                <h2 className="text-xl font-bold text-blue-500 mb-4">Add Testimonial</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {Object.entries(formData).map(([key, value]) => (
                        <input
                            key={key}
                            type={key === "rating" ? "number" : "text"}
                            name={key}
                            value={value}
                            onChange={handleChange}
                            placeholder={key.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            className={`w-full p-2 rounded text-black ${key === "rating" && (value > 5 ? "border border-red-500" : "")}`}
                            required
                        />
                    ))}

                    <div className="py-5">
                        <div className="grid gap-8 justify-center items-center">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <button
                                    type="submit"
                                    className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center disabled:opacity-50"
                                    disabled={loading}
                                >
                                    <p className="text-indigo-400 group-hover:text-gray-100 transition duration-200">
                                        {loading ? "Adding..." : "Add Testimonial"}
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTestimonial;
