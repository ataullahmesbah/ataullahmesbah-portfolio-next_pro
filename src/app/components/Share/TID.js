'use client'

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

                const result = await response.json(); // Handle JSON properly

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
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                testimonials.map((test) => (
                    <div key={test._id} className="border text-white py-16 p-2 mb-2">
                        <h3 className="text-lg font-bold">{test.user_name}</h3>
                    </div>
                ))
            )}
        </div>
    );
}
