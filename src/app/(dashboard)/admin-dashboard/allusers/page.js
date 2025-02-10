const AllUsers = () => {
    // Dummy User Data
    const users = [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
        { id: 3, name: "David Miller", email: "david@example.com" },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold">👤 All Users</h2>
            <ul className="mt-4 space-y-2">
                {users.map((user) => (
                    <li key={user.id} className="p-2 bg-gray-200 rounded">
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllUsers;
