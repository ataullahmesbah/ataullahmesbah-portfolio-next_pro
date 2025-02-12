"use client";
import { useEffect, useState } from "react";

export default function TID() {
    const [testimonials, setTestimonials] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchTestimonials() {
            try {
                const response = await fetch("/api/testimonials");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json(); // Parse JSON

                if (result.success) {
                    setTestimonials(result.data);
                } else {
                    throw new Error(result.message);
                }
            } catch (err) {
                setError(err.message || "Failed to load testimonials");
            }
        }

        fetchTestimonials();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-center mb-4 text-white">User Testimonials</h2>

            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                testimonials.length > 0 ? (
                    testimonials.map((test) => (
                        <div key={test._id} className="border bg-gray-900 text-white py-4 px-6 mb-4 rounded-md shadow-lg">
                            <h3 className="text-lg font-semibold">{test.user_name}</h3>
                            <p className="text-sm italic">{test.description}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No testimonials available.</p>
                )
            )}
        </div>
    );
}
