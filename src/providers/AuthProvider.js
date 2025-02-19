// providers/AuthProvider.js
"use client"; // ✅ Ensure this is a client component

import { createContext, useContext, useState, useEffect } from "react";

// Create AuthContext
export const AuthContext = createContext(null);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user data (example)
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to Use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
