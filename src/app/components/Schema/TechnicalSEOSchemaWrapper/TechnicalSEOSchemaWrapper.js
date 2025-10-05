'use client';

import Head from "next/head";

const TechnicalSEOSchemaWrapper = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Technical SEO Services",
                "description": "Professional Technical SEO services including Core Web Vitals optimization, website speed optimization, site structure improvement, and comprehensive technical SEO audits.",
                "provider": {
                    "@type": "Person",
                    "name": "Ataullah Mesbah",
                    "url": "https://www.ataullahmesbah.com",
                    "jobTitle": "Technical SEO Expert",
                    "sameAs": [
                        "https://www.linkedin.com/in/ataullah-mesbah",
                        "https://x.com/ataullah_mesbah",
                    ],
                },
                "serviceType": "Technical Search Engine Optimization",
                "areaServed": "Worldwide",
                "availableLanguage": ["English"],
                "offers": {
                    "@type": "Offer",
                    "url": "https://www.ataullahmesbah.com/seo/technical-seo",
                    "priceCurrency": "USD",
                    "description": "Professional Technical SEO packages for website performance and search engine optimization.",
                    "category": "Digital Marketing Services"
                }
            },
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "jobTitle": "Technical SEO Expert & SEO Specialist",
                "url": "https://www.ataullahmesbah.com",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah",
                ],
                "knowsAbout": [
                    "Core Web Vitals Optimization",
                    "Website Performance",
                    "Site Structure Optimization",
                    "Crawlability Analysis",
                    "Indexation Management",
                    "Structured Data Implementation",
                    "Mobile-First Optimization",
                    "Technical SEO Audits"
                ],
                "description": "Professional SEO expert specializing in Technical SEO optimization and website performance."
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
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Technical SEO",
                        "item": "https://www.ataullahmesbah.com/seo/technical-seo",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is included in your Technical SEO services?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Our Technical SEO services include Core Web Vitals optimization, site speed improvement, crawlability analysis, site structure optimization, mobile optimization, and comprehensive technical audits to identify and fix issues affecting your search rankings."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does Technical SEO take to show results?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Technical SEO improvements can show results within 2-8 weeks, depending on the issues fixed. Core Web Vitals and speed optimizations often show immediate improvements, while crawlability and indexation fixes may take longer to fully impact rankings."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you work with all types of websites?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, we work with all types of websites including WordPress, Shopify, custom-built sites, e-commerce platforms, and enterprise-level websites. Our Technical SEO services are tailored to your specific platform and business needs."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What are Core Web Vitals and why are they important?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Core Web Vitals are Google's user experience metrics including loading performance (LCP), interactivity (FID), and visual stability (CLS). They are important ranking factors and directly impact user experience and conversion rates."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How often should I do a Technical SEO audit?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We recommend comprehensive Technical SEO audits every 6-12 months, or after major website updates. Ongoing monitoring should be done monthly to catch new issues early and maintain optimal performance."
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

export default TechnicalSEOSchemaWrapper;