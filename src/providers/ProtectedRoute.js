// components/ProtectedRoute.js

import { useAuth } from "./AuthProvider";


export default function ProtectedRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <p>Loading...</p>;
    }

    return children;
}
