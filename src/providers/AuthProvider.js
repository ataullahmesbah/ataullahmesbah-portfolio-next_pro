// providers/AuthProvider.js
"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            console.log("Stored User Found:", storedUser); // ✅ Debugging
            setUser(storedUser);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User Logged In:", userData); // ✅ Debugging

        setTimeout(() => {
            router.push("/dashboard"); // Ensure navigation works
        }, 1000);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        console.log("User Logged Out"); // ✅ Debugging
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
