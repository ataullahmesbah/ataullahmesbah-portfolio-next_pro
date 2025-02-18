"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const RegisterForm = () => {
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

    const validateForm = () => {
        if (form.password !== form.confirmPassword) {
            toast.error("Passwords do not match.");
            return false;
        }
        if (form.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            toast.error("Invalid email address.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            console.log("Form data being sent:", form); // Debugging: Log form data

            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            console.log("Response from API:", data); // Debugging: Log API response

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

            console.log("Router object:", router); // Debugging: Log the router object
            console.log("Redirecting to /auth/login"); // Debugging: Log the redirect URL

            router.push("/auth/login"); // Ensure this is a valid URL
        } catch (error) {
            console.error("Error during registration:", error); // Debugging: Log errors
            toast.error("Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    const formFields = [
        { name: "firstName", type: "text", placeholder: "First Name" },
        { name: "lastName", type: "text", placeholder: "Last Name" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
        { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formFields.map((field) => (
                        <input
                            key={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={form[field.name]}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    ))}
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
};

export default RegisterForm;