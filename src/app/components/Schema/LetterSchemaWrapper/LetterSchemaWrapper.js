
const LetterSchemaWrapper = ({ schema }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
};

export default LetterSchemaWrapper;