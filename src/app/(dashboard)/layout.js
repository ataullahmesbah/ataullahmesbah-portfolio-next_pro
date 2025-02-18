// src/app/dashboard/layout.js
import { useAuth } from "@/providers/AuthProvider";
import AdminDashboardLayout from "./admin-dashboard/layout";
import ModeratorDashboardLayout from "./moderator-dashboard/layout";
import UserDashboardLayout from "./user-dashboard/layout";

export default function DashboardLayout({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <div>Loading...</div>;
    }


    
    if (user.role === "admin") {
        return <AdminDashboardLayout>
            {children}
        </AdminDashboardLayout>;
    } else if (user.role === "moderator") {
        return <ModeratorDashboardLayout>
            {children}
        </ModeratorDashboardLayout>
    } else {
        return <UserDashboardLayout>
            {children}
        </UserDashboardLayout>
    }
}