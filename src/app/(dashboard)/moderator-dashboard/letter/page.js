export default function Letters() {
    const letters = [
        { id: 1, title: "Letter 1", content: "This is the first letter." },
        { id: 2, title: "Letter 2", content: "This is the second letter." },
    ];

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Letters</h1>
            <ul className="space-y-4">
                {letters.map((letter) => (
                    <li key={letter.id} className="p-4 bg-white shadow rounded-lg">
                        <h2 className="text-lg font-semibold">{letter.title}</h2>
                        <p>{letter.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
