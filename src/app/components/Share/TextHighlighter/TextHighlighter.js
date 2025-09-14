// src/app/components/TextHighlighter/TextHighlighter.js
const TextHighlighter = ({ text }) => {
    if (!text) return null;

    // Regex to find patterns like "Text:"
    const parts = text.split(/(\b[A-Za-z\s]+:)/g);

    return (
        <p className="text-gray-800 my-4 leading-relaxed text-lg">
            {parts.map((part, index) => {
                // Check if this part matches the pattern (ends with colon)
                if (part.match(/\b[A-Za-z\s]+:$/)) {
                    return (
                        <span key={index} className="font-semibold text-purple-700 bg-purple-100 px-1 rounded-md">
                            {part}
                        </span>
                    );
                }
                return part;
            })}
        </p>
    );
};

export default TextHighlighter;