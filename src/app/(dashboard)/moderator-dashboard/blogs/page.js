export default function Blogs() {
    const blogs = [
        { id: 1, title: "Blog Post 1", author: "Author A" },
        { id: 2, title: "Blog Post 2", author: "Author B" },
    ];

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Blogs</h1>
            <ul className="space-y-4">
                {blogs.map((blog) => (
                    <li key={blog.id} className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold">{blog.title}</h2>
                        <p className="text-sm text-gray-600">by {blog.author}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}


