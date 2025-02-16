// src/providers/AuthProvider.js

"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const login = (token, userData) => {
        localStorage.setItem("token", token);
        setUser(userData);
        toast.success("Logged in successfully!");

        // Redirect based on role
        if (userData.role === "admin") {
            router.push("/admin/dashboard");
        } else {
            router.push("/user/dashboard");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        toast.success("Logged out!");
        router.push("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // Decode or fetch user info from token
            setUser({ email: "demo@example.com", role: "user" });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
