'use client';

import Head from "next/head";

const WebSchemaWrapper = ({ page }) => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "name": "Ataullah Mesbah Portfolio",
                "url": "https://www.ataullahmesbah.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.ataullahmesbah.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                },
            },
            {
                "@type": "Service",
                "name": page === "web-packages" ? "Web Development Packages" : page === "web-development" ? "Web Development Services" : "Search Engine Optimization Services",
                "description": page === "web-packages"
                    ? "Tailored web development packages by Ataullah Mesbah, including custom websites, ecommerce platforms, and portfolio sites."
                    : page === "web-development"
                        ? "Professional web development services by Ataullah Mesbah, including custom websites, ecommerce platforms, WordPress solutions, and performance optimization."
                        : "Professional SEO services by Ataullah Mesbah to improve website rankings, drive organic traffic, and enhance online visibility.",
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
                    "@type": "OfferCatalog",
                    "name": page === "web-packages" ? "Web Development Packages" : page === "web-development" ? "Web Development Services" : "SEO Services",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": page === "web-development" ? "Custom Website Development" : page === "web-packages" ? "Custom Website Package" : "SEO Audit",
                            },
                            "url": `https://www.ataullahmesbah.com/${page}`,
                            "priceCurrency": "USD",
                            "description": page === "web-development"
                                ? "Custom web development solutions tailored to your business needs."
                                : page === "web-packages"
                                    ? "Pre-designed web development packages for various business types."
                                    : "Comprehensive SEO audits and optimization strategies.",
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": page === "web-development" ? "Ecommerce Development" : page === "web-packages" ? "Ecommerce Package" : "Keyword Research",
                            },
                            "url": `https://www.ataullahmesbah.com/${page}`,
                            "priceCurrency": "USD",
                            "description": page === "web-development"
                                ? "Robust ecommerce platforms with payment integration and scalability."
                                : page === "web-packages"
                                    ? "Complete ecommerce solutions with payment gateways."
                                    : "Targeted keyword research to boost search rankings.",
                        },
                    ],
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
                        "name": page === "web-packages" ? "Web Development Packages" : page === "web-development" ? "Web Development Services" : "SEO Services",
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