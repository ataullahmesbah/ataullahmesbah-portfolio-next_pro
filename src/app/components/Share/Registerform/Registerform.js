"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Registration failed.");
                return;
            }

            toast.success("Registration successful!");
            setForm({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            router.push("/login");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400"
                    >
                        {isLoading ? "Registering..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
}