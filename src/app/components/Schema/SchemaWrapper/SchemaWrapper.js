'use client';

import Head from "next/head";

const SchemaWrapper = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Search Engine Optimization Services",
                "description":
                    "Professional SEO services by Ataullah Mesbah to improve website rankings, drive organic traffic, and enhance online visibility.",
                "provider": {
                    "@type": "Person",
                    "name": "Ataullah Mesbah",
                    "url": "https://www.ataullahmesbah.com",
                    "sameAs": [
                        "https://www.linkedin.com/in/ataullahmesbah",
                        "https://twitter.com/ataullahmesbah",
                    ],
                },
                "offers": {
                    "@type": "Offer",
                    "url": "https://www.ataullahmesbah.com/seo",
                    "priceCurrency": "USD",
                    "description": "Custom SEO packages tailored to your business needs.",
                },
            },
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "jobTitle": "SEO Expert & Digital Marketer",
                "url": "https://www.ataullahmesbah.com",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullahmesbah",
                    "https://twitter.com/ataullahmesbah",
                ],
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
                        "name": "SEO Services",
                        "item": "https://www.ataullahmesbah.com/seo",
                    },
                ],
            },
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