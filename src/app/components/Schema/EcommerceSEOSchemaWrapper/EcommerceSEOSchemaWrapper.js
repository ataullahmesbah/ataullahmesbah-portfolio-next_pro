'use client';

import Head from "next/head";

const EcommerceSEOSchemaWrapper = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "Ecommerce SEO Services",
                "description": "Professional Ecommerce SEO optimization services including product page optimization, category SEO, technical ecommerce optimization, and AI search optimization for online stores.",
                "provider": {
                    "@type": "Person",
                    "name": "Ataullah Mesbah",
                    "url": "https://www.ataullahmesbah.com",
                    "jobTitle": "Ecommerce SEO Expert",
                    "sameAs": [
                        "https://www.linkedin.com/in/ataullah-mesbah",
                        "https://x.com/ataullah_mesbah",
                    ],
                },
                "serviceType": "Ecommerce Search Engine Optimization",
                "areaServed": "Worldwide",
                "availableLanguage": ["English"],
                "offers": {
                    "@type": "Offer",
                    "url": "https://www.ataullahmesbah.com/seo/ecommerce-seo",
                    "priceCurrency": "USD",
                    "description": "Professional Ecommerce SEO packages for online stores and product optimization.",
                    "category": "Ecommerce Digital Marketing"
                }
            },
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "jobTitle": "Ecommerce SEO Expert & AI Search Specialist",
                "url": "https://www.ataullahmesbah.com",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah",
                ],
                "knowsAbout": [
                    "Ecommerce SEO Optimization",
                    "Product Page SEO",
                    "Category Page Optimization",
                    "Ecommerce Technical SEO",
                    "Product Schema Markup",
                    "Shopping Cart Optimization",
                    "GEO for Ecommerce",
                    "SGE Optimization for Products"
                ],
                "description": "Professional SEO expert specializing in Ecommerce SEO optimization and AI search strategies for online stores."
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
                        "name": "Ecommerce SEO",
                        "item": "https://www.ataullahmesbah.com/seo/ecommerce-seo",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is included in your Ecommerce SEO services?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Our Ecommerce SEO services include product page optimization, category structure improvement, technical ecommerce SEO, product schema markup implementation, shopping cart optimization, and AI search (GEO/SGE) optimization for online stores."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How do you optimize product pages for SEO?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We optimize product pages through comprehensive keyword research, meta tag optimization, product schema markup, image optimization, content enhancement, internal linking, and user experience improvements for better conversions and rankings."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you work with specific ecommerce platforms?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, we work with all major ecommerce platforms including Shopify, WooCommerce, Magento, BigCommerce, and custom-built ecommerce solutions. Our strategies are tailored to each platform's specific requirements."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is GEO/SGE optimization for ecommerce?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "GEO (Generative Engine Optimization) and SGE (Search Generative Experience) optimization prepares your product content for AI-powered search, ensuring your products appear in conversational search results and AI-generated shopping recommendations."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does ecommerce SEO take to show results?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Initial improvements can be seen within 4-8 weeks, with significant traffic and sales growth typically occurring within 3-6 months. Technical optimizations often show faster results than content-based improvements."
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

export default EcommerceSEOSchemaWrapper;