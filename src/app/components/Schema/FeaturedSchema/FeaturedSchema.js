// app/components/Story/FeaturedSchema.js
export default function FeaturedSchema(stories) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: stories.map((story, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Article',
                headline: story.title,
                description: story.metaDescription,
                image: story.mainImage,
                url: `https://ataullahmesbah.com/featured-story/${story.slug}`,
                author: { '@type': 'Person', name: story.author || 'Ataullah Mesbah' },
                datePublished: new Date(story.publishedDate).toISOString(),
                publisher: {
                    '@type': 'Organization',
                    name: 'Ataullah Mesbah',
                    logo: { '@type': 'ImageObject', url: 'https://ataullahmesbah.com/images/logo.png' },
                },
            },
        })),
    };
}