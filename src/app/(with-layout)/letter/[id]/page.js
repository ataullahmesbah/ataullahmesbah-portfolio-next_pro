import newsletters from "/public/newsletters.json";

const LetterDetailPage = ({ params }) => {
    // Extract the ID from params
    const { id } = params;

    // Find the specific newsletter
    const singleNewsLetter = newsletters.find((newsletter) => newsletter.id === parseInt(id));

    // Handle case where the newsletter is not found
    if (!singleNewsLetter) {
        return (
            <div className="text-center py-20">
                <h3 className="text-2xl font-semibold text-red-500">Newsletter Not Found</h3>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-16 px-6">
            <h2 className="text-3xl font-bold text-center mb-6">{singleNewsLetter.title}</h2>
            <div className="max-w-4xl mx-auto">
               
                <p className="text-lg text-gray-800">{singleNewsLetter.description}</p>
                <div className="mt-4">
                    <span className="text-sm text-gray-600">Category: {singleNewsLetter.category}</span>
                </div>
            </div>
        </div>
    );
};

export default LetterDetailPage;
