'use client';

import Head from "next/head";

const WebSchemaWrapper = ({ page }) => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": page === "web-development" ? "Web Development Services" : "Search Engine Optimization Services",
                "description": page === "web-development"
                    ? "Professional web development services by Ataullah Mesbah, including custom websites, ecommerce platforms, and performance optimization."
                    : "Professional SEO services by Ataullah Mesbah to improve website rankings and drive organic traffic.",
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
                    "url": `https://www.ataullahmesbah.com/${page}`,
                    "priceCurrency": "USD",
                    "description": page === "web-development"
                        ? "Custom web development solutions tailored to your business."
                        : "Custom SEO packages for your business needs.",
                },
            },
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "jobTitle": "Web Developer & SEO Expert",
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
                        "name": page === "web-development" ? "Web Development Services" : "SEO Services",
                        "item": `https://www.ataullahmesbah.com/${page}`,
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

export default WebSchemaWrapper;