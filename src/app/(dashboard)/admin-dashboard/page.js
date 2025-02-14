import TestimonialStatistics from "@/app/Dashboard/AdminDashboard/TestimonialStatistics/TestimonialStatistics";

const AdminDashboardHome = () => {
    return (
        <div>
            <h2 className="text-3xl font-bold">Welcome to the Admin Dashboard</h2>
            <p className="text-gray-600 mt-2">Select an option from the sidebar.</p>
            <TestimonialStatistics />
        </div>
    );
};

export default AdminDashboardHome;
