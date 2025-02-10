'use client';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    // Check if the current path starts with '/admin-dashboard' or '/moderator-dashboard'
    const isNestedDashboard =
        pathname.startsWith('/admin-dashboard') || pathname.startsWith('/moderator-dashboard');

    return (
        <div className="flex">
            {/* Render this sidebar only if not in nested dashboards */}
            {!isNestedDashboard && (
                <aside className="w-1/4 bg-gray-800 text-white">
                    <nav>
                        <ul className="space-y-2">
                            <li>Home</li>
                            <li>Admin Panel</li>
                            <li>User Panel</li>
                        </ul>
                    </nav>
                </aside>
            )}
            <main className="flex-1">{children}</main>
        </div>
    );
}
