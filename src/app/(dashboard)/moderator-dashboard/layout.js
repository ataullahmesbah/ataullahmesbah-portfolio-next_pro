import Link from "next/link";
import { FaUsers, FaEnvelope, FaBlog } from 'react-icons/fa';

export default function ModeratorDashboardLayout({ children }) {
    const links = [
        { label: "All Users", href: "/moderator-dashboard/alluser", icon: <FaUsers /> },
        { label: "Letters", href: "/moderator-dashboard/letter", icon: <FaEnvelope /> },
        { label: "Blogs", href: "/moderator-dashboard/blogs", icon: <FaBlog /> },
    ];

    return (
        <div className="flex h-screen bg-gray-200">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-6 text-center">Moderator Dashboard</h2>
                <nav>
                    <ul className="space-y-4">
                        {links.map(({ label, href, icon }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="flex items-center p-3 rounded-lg text-lg font-medium hover:bg-indigo-600 hover:text-white transition-all duration-200"
                                >
                                    <span className="mr-3">{icon}</span> {/* Add icon here */}
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
