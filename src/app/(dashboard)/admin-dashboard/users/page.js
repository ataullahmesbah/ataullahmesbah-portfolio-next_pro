import AdminUsersPage from '@/app/Dashboard/AdminDashboard/ManageUser/ManageUser';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const page = () => {
    return (
        <div>
            <AdminUsersPage />
        </div>
    );
};

export default page;