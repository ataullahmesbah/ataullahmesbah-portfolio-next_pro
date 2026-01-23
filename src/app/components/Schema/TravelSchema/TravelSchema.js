// app/components/Schema/TravelSchema/TravelSchema.jsx - UPDATED
export default function TravelSchema({ data }) {
    const { pageTitle, description, travels, author, siteUrl, pageUrl } = data;

    // Calculate statistics
    const totalTravels = travels.length;
    const historicalCount = travels.filter(t => t.category === 'Historical').length;
    const galleryCount = travels.filter(t => t.category === 'Gallery').length;
    const countries = [...new Set(travels.map(t => t.location).filter(Boolean))];
    const uniqueLocations = countries.length;

    // 1. Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Mesbah Off We Go - Travel Adventures",
        "url": siteUrl,
        "description": description,
        "inLanguage": "en-US",
        "author": {
            "@type": "Person",
            "name": author,
            "url": `${siteUrl}/about`,
            "sameAs": [
                "https://twitter.com/mesbahoffwego",
                "https://instagram.com/mesbahoffwego",
                "https://facebook.com/mesbahoffwego"
            ]
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": `${siteUrl}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // 2. Travel Agency Schema (Important for travel sites)
    const travelAgencySchema = {
        "@context": "https://schema.org",
        "@type": "TravelAgency",
        "name": "Mesbah Off We Go",
        "description": "Travel adventures and explorations by Ataullah Mesbah",
        "url": siteUrl,
        "logo": `${siteUrl}/images/logo.jpg`,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "Bangladesh"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "contact@ataullahmesbah.com"
        },
        "sameAs": [
            "https://twitter.com/mesbahoffwego",
            "https://instagram.com/mesbahoffwego"
        ]
    };

    // 3. Person Schema with detailed info
    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Ataullah Mesbah",
        "alternateName": ["Mesbah Off We Go"],
        "url": siteUrl,
        "image": `${siteUrl}/images/ataullah-mesbah.jpg`,
        "description": "Travel enthusiast, content creator, and photographer sharing global adventures and cultural experiences",
        "jobTitle": "Travel Content Creator",
        "knowsAbout": [
            "Travel Photography",
            "Cultural Exploration",
            "Historical Sites",
            "Adventure Travel",
            "Destination Guides",
            "Travel Blogging"
        ],
        "sameAs": [
            "https://twitter.com/mesbahoffwego",
            "https://instagram.com/mesbahoffwego",
            "https://facebook.com/mesbahoffwego",
            "https://youtube.com/@mesbahoffwego"
        ],
        "worksFor": {
            "@type": "Organization",
            "name": "Mesbah Off We Go"
        }
    };

    // 4. Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
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
                "name": "Travel Blog",
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

    // 5. Collection Page Schema
    const collectionPageSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": pageTitle,
        "description": description,
        "url": pageUrl,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": totalTravels,
            "itemListElement": travels.map((travel, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Article",
                    "headline": travel.title,
                    "description": travel.description?.substring(0, 200) || `Travel to ${travel.location}`,
                    "image": travel.imageUrl,
                    "datePublished": travel.date || new Date().toISOString(),
                    "dateModified": travel.updatedAt || new Date().toISOString(),
                    "author": {
                        "@type": "Person",
                        "name": author
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Mesbah Off We Go",
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${siteUrl}/images/logo.jpg`
                        }
                    }
                }
            }))
        }
    };

    // 6. FAQ Schema with travel-specific questions
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Mesbah Off We Go?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `Mesbah Off We Go is a travel blog by Ataullah Mesbah featuring ${totalTravels} travel adventures across ${uniqueLocations} locations. It includes ${historicalCount} historical sites and ${galleryCount} photo galleries from around the world.`
                }
            },
            {
                "@type": "Question",
                "name": "What type of travel content is featured?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The blog features historical site explorations, cultural experiences, adventure travels, destination guides, travel photography, personal journey stories, and practical travel tips from various countries and continents."
                }
            },
            {
                "@type": "Question",
                "name": "How often is new content added?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "New travel content is added regularly with updates from recent adventures. The site features both comprehensive destination guides and spontaneous travel experiences from ongoing explorations."
                }
            },
            {
                "@type": "Question",
                "name": "Can I use the photos for personal use?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "All photos are copyright protected. For usage inquiries, please contact via the website. High-quality travel photography from various destinations is available for viewing and inspiration."
                }
            }
        ]
    };

    // 7. LocalBusiness Schema (for location-based SEO)
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Mesbah Off We Go",
        "image": `${siteUrl}/images/logo.jpg`,
        "@id": `${siteUrl}/#organization`,
        "url": siteUrl,
        "telephone": "",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "",
            "addressLocality": "Dhaka",
            "addressRegion": "Dhaka",
            "postalCode": "",
            "addressCountry": "BD"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 23.8103,
            "longitude": 90.4125
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
        },
        "sameAs": [
            "https://twitter.com/mesbahoffwego",
            "https://instagram.com/mesbahoffwego"
        ]
    };

    // Combine all schemas
    const allSchemas = [
        websiteSchema,
        travelAgencySchema,
        personSchema,
        breadcrumbSchema,
        collectionPageSchema,
        faqSchema,
        localBusinessSchema
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(allSchemas)
                }}
                key="travel-schema"
            />
        </>
    );
}