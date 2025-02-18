"use client";

import { useRouter } from 'next/router';
import { useAuth } from './AuthProvider';


const ProtectedRoute = ({ children, role }) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/login'); // Redirect to login if not authenticated
        } else if (role && user.role !== role) {
            router.push('/unauthorized'); // Redirect if role doesn't match
        }
    }, [user, role]);

    return user ? children : null;
};

export default ProtectedRoute;
