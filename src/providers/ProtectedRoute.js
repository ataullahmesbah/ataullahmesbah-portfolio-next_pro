"use client";


import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (adminOnly && user.role !== "admin") {
            router.push("/unauthorized");
        }
    }, [user, adminOnly, router]);

    return user ? children : null;
};

export default ProtectedRoute;
