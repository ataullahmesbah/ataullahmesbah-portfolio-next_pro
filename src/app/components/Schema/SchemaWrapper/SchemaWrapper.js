'use client';

import Head from "next/head";

const SchemaWrapper = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Global SEO Services",
                "description": "Professional international SEO services including technical SEO, ecommerce SEO, and AI-search optimization for global businesses.",
                "provider": {
                    "@type": "Person",
                    "name": "Ataullah Mesbah",
                    "url": "https://www.ataullahmesbah.com",
                    "jobTitle": "International SEO Expert",
                    "sameAs": [
                        "https://www.linkedin.com/in/ataullah-mesbah",
                        "https://x.com/ataullah_mesbah",
                    ],
                },
                "serviceType": "Search Engine Optimization",
                "areaServed": "Worldwide",
                "availableLanguage": ["English"],
                "offers": {
                    "@type": "Offer",
                    "url": "https://www.ataullahmesbah.com/seo",
                    "priceCurrency": "USD",
                    "description": "Custom SEO packages for global businesses and international markets.",
                },
            },
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "jobTitle": "International SEO Expert & Digital Marketer",
                "url": "https://www.ataullahmesbah.com",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah",
                ],
                "knowsAbout": [
                    "Search Engine Optimization",
                    "Technical SEO",
                    "International SEO",
                    "E-commerce SEO",
                    "AI Search Optimization",
                    "Digital Marketing"
                ]
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.ataullahmesbah.com",
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Global SEO Services",
                        "item": "https://www.ataullahmesbah.com/seo",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Do you provide SEO services for international businesses?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, I specialize in global SEO strategies for international businesses, including multi-language optimization, geo-targeting, and international technical SEO implementation."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What types of SEO do you specialize in?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "I specialize in Technical SEO, E-commerce SEO, International SEO, AI Search Optimization (SGE), and comprehensive digital marketing strategies for global reach."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does it take to see SEO results?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Initial improvements can be seen in 4-8 weeks, with significant traffic growth typically occurring within 3-6 months, depending on competition and website authority."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you work with ecommerce websites?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, I specialize in ecommerce SEO including product page optimization, category structure, technical SEO for online stores, and international ecommerce strategies."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What makes your SEO services different?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "I combine traditional SEO excellence with modern AI-search optimization, focusing on future-proof strategies that work in both current and emerging search environments like Google's SGE."
                        }
                    }
                ]
            }
        ],
    };

    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
        </Head>
    );
};

export default SchemaWrapper;