"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DeleteTestimonial = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch testimonials
    const fetchTestimonials = async () => {
        try {
            const response = await fetch("/api/testimonials");
            const data = await response.json();
            if (response.ok) {
                setTestimonials(data);
            } else {
                toast.error("Failed to fetch testimonials.");
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            toast.error("An error occurred while fetching testimonials.");
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    // Handle delete
    const handleDelete = async (id) => {
        if (!id) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this testimonial?");
        if (!confirmDelete) return;

        setLoading(true);
        try {
            const response = await fetch("/api/testimonials", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (data.message === "Testimonial deleted successfully") {
                toast.success(data.message);
                fetchTestimonials();
            } else {
                toast.error(data.error || "Failed to delete testimonial.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 py-10">
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-white mb-6">Manage Testimonials</h1>
                {testimonials.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border border-gray-700 text-white">
                            <thead className="bg-blue-600">
                                <tr>
                                    <th className="p-3 border">Name</th>
                                    <th className="p-3 border">Position</th>
                                    <th className="p-3 border">Rating</th>
                                    <th className="p-3 border">Description</th>
                                    <th className="p-3 border">Image</th>
                                    <th className="p-3 border">Category</th>
                                    <th className="p-3 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testimonials.map((testimonial) => (
                                    <tr key={testimonial._id} className="hover:bg-gray-800">
                                        <td className="p-3 border">{testimonial.user_name}</td>
                                        <td className="p-3 border">{testimonial.user_position}</td>
                                        <td className="p-3 border">{testimonial.rating}</td>
                                        <td className="p-3 border">{testimonial.description}</td>
                                        <td className="p-3 border">
                                            <Image src={testimonial.image} alt="testimonial" width={50} height={50} className="w-12 h-12 rounded-full" />
                                        </td>
                                        <td className="p-3 border">{testimonial.categories}</td>
                                        <td className="p-3 border text-center">
                                            <button
                                                onClick={() => handleDelete(testimonial._id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md disabled:opacity-50"
                                                disabled={loading}
                                            >
                                                {loading ? "Deleting..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-center text-gray-400">No testimonials found.</p>
                )}
            </div>
        </div>
    );
};

export default DeleteTestimonial;
