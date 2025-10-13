// Schema/TravelSchema.jsx

export default function TravelSchema({ data }) {
    const { pageTitle, description, travels, author, siteUrl, pageUrl } = data;

    // Create FAQ schema with 5 specific questions
    const faqQuestions = [
        {
            "@type": "Question",
            "name": "Who is Ataullah Mesbah and what is Mesbah Off We Go?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ataullah Mesbah, also known as Mesbah Off We Go, is a passionate traveler and content creator who shares global adventures, cultural experiences, and historical site explorations through engaging travel content and photography."
            }
        },
        {
            "@type": "Question",
            "name": "What type of travel content does Mesbah Off We Go feature?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Mesbah Off We Go features diverse travel content including historical site visits, cultural immersion experiences, adventure travels, photo galleries from around the world, travel tips, and personal journey stories across different continents and countries."
            }
        },
        {
            "@type": "Question",
            "name": "How often does Ataullah Mesbah post new travel content?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "New travel content is regularly updated featuring recent adventures and explorations. Follow Mesbah Off We Go on social media and check the website frequently for the latest travel stories, photo galleries, and cultural experiences from around the globe."
            }
        },
        {
            "@type": "Question",
            "name": "What are some featured destinations in Mesbah Off We Go travels?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The travel portfolio includes explorations of historical landmarks, cultural heritage sites, natural wonders, and urban adventures across multiple continents. Featured destinations cover both popular tourist spots and hidden gems from various cultures and geographical locations."
            }
        },
        {
            "@type": "Question",
            "name": "Can I follow Mesbah Off We Go on social media for travel updates?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, you can follow Ataullah Mesbah's travel adventures as Mesbah Off We Go across various social media platforms for regular updates, behind-the-scenes content, travel photography, and real-time journey updates from ongoing expeditions."
            }
        }
    ];

    // Add dynamic questions from travel data if available
    if (travels && travels.length > 0) {
        travels.slice(0, 2).forEach((travel, index) => {
            faqQuestions.push({
                "@type": "Question",
                "name": `What can I expect from ${travel.destination || travel.title} travel experience?`,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": travel.description || `Explore ${travel.destination} with detailed insights, cultural context, and visual documentation of the journey, including historical significance and personal experiences shared by Ataullah Mesbah.`
                }
            });
        });
    }

    const travelBreadcrumb = {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Travel",
                "item": `${siteUrl}/travel`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": pageTitle,
                "item": pageUrl
            }
        ]
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Ataullah Mesbah - Travel",
        "url": siteUrl,
        "description": description,
        "author": {
            "@type": "Person",
            "name": author
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    const travelPageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": pageTitle,
        "description": description,
        "url": pageUrl,
        "author": {
            "@type": "Person",
            "name": author,
            "url": siteUrl
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mesbah Off We Go",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/images/logo.jpg`
            }
        },
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": travels.length,
            "itemListElement": travels.map((travel, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "CreativeWork",
                    "name": travel.title || `Travel to ${travel.destination}`,
                    "description": travel.description,
                    "image": travel.imageUrl,
                    "author": {
                        "@type": "Person",
                        "name": author
                    },
                    "datePublished": travel.date || new Date().toISOString()
                }
            }))
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqQuestions
    };

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ataullah Mesbah",
        "alternateName": "Mesbah Off We Go",
        "url": siteUrl,
        "description": "Travel enthusiast and content creator sharing global adventures and cultural experiences",
        "knowsAbout": ["Travel", "Photography", "Cultural Exploration", "Historical Sites", "Adventure Travel"]
    };

    const allSchemas = [websiteSchema, travelPageSchema, faqSchema, travelBreadcrumb, personSchema];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(allSchemas)
            }}
        />
    );
}