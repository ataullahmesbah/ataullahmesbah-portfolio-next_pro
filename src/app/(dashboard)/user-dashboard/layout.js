



const UserDashboardLayout = ({ children }) => {
  return (

    <div className="grid grid-cols-12 min-h-screen">
      {/* Sidebar */}
      <div className="col-span-3 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-4">User Panel</h2>

      </div>

      {/* Main Content */}
      <div className="col-span-9 p-6">
        {children} {/* Dynamic content will load here */}
      </div>
    </div>

  );
};

export default UserDashboardLayout;