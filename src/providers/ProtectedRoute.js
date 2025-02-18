// components/ProtectedRoute.js

'use client';

import { useRouter } from "next/router";
import { useAuth } from "./AuthProvider";


export default function ProtectedRoute({ roles, children }) {
    const { user } = useAuth();
    const router = useRouter();

    if (!user) {
        router.push("/auth/login");
        return null;
    }

    if (!roles.includes(user.role)) {
        router.push("/dashboard");
        return null;
    }

    return children;
}