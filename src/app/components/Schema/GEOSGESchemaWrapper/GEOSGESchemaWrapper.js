'use client';

import Head from "next/head";

const GEOSGESchemaWrapper = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": "GEO & SGE Optimization Services",
                "description": "Professional Generative Engine Optimization (GEO) and Search Generative Experience (SGE) optimization services. AI-search ready SEO strategies for Google's AI-powered search.",
                "provider": {
                    "@type": "Person",
                    "name": "Ataullah Mesbah",
                    "url": "https://www.ataullahmesbah.com",
                    "jobTitle": "AI Search Optimization Expert",
                    "sameAs": [
                        "https://www.linkedin.com/in/ataullah-mesbah",
                        "https://x.com/ataullah_mesbah",
                    ],
                },
                "serviceType": "AI Search Optimization",
                "areaServed": "Worldwide",
                "availableLanguage": ["English"],
                "offers": {
                    "@type": "Offer",
                    "url": "https://www.ataullahmesbah.com/seo/geo-sge-optimization",
                    "priceCurrency": "USD",
                    "description": "Professional GEO and SGE optimization packages for businesses preparing for AI-powered search.",
                    "category": "Digital Marketing Services"
                },
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "GEO SGE Optimization Packages",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Basic GEO Optimization",
                                "description": "Foundation AI-search optimization including technical setup and content structure"
                            }
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": "Advanced SGE Optimization",
                                "description": "Comprehensive GEO and SGE optimization with ongoing AI-search monitoring"
                            }
                        }
                    ]
                }
            },
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "jobTitle": "AI Search Optimization Expert & SEO Specialist",
                "url": "https://www.ataullahmesbah.com",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah",
                ],
                "knowsAbout": [
                    "Generative Engine Optimization (GEO)",
                    "Search Generative Experience (SGE)",
                    "AI Search Optimization",
                    "Natural Language Processing",
                    "Conversational Search",
                    "Structured Data for AI",
                    "E-E-A-T Optimization",
                    "Technical SEO",
                    "Content Strategy for AI"
                ],
                "description": "Professional SEO expert specializing in GEO and SGE optimization for AI-powered search engines."
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
                        "name": "GEO SGE Optimization",
                        "item": "https://www.ataullahmesbah.com/seo/geo-sge-optimization",
                    },
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is GEO (Generative Engine Optimization)?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "GEO (Generative Engine Optimization) is the practice of optimizing content for AI-powered search engines and generative interfaces. It focuses on preparing content to be featured in AI-generated answers and conversational search results rather than traditional blue links."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is SGE (Search Generative Experience)?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "SGE (Search Generative Experience) is Google's AI-powered search interface that provides conversational, summarized answers by pulling information from multiple high-quality sources. It represents the future of search beyond traditional result pages."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Why is GEO SGE optimization important now?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "GEO SGE optimization is crucial because industry experts predict 70% of searches will be AI-generated by 2025. Early data shows SGE already impacts 84% of queries, and early adopters gain significantly more visibility in AI search results."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How is GEO different from traditional SEO?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Traditional SEO focuses on ranking in blue links, while GEO optimizes for AI-generated answers, conversational queries, and interactive results. GEO emphasizes E-E-A-T signals, entity authority, and content structure that AI systems can easily understand and cite."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What's included in your GEO SGE optimization service?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Our GEO SGE optimization includes AI search audit, technical GEO setup with structured data, content transformation for conversational AI, E-E-A-T signal implementation, entity optimization, and ongoing monitoring for AI search algorithm updates."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does it take to see results from GEO optimization?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Initial technical implementations show within 2-4 weeks, while comprehensive GEO optimization demonstrating in SGE results typically takes 2-3 months as Google's AI systems learn to trust and cite your content as an authoritative source."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you work with international businesses for GEO optimization?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, we provide GEO and SGE optimization services for international businesses, including multi-language AI search optimization, geo-specific entity targeting, and global E-E-A-T signal building for worldwide AI search visibility."
                        }
                    }
                ]
            },
            {
                "@type": "WebPage",
                "@id": "https://www.ataullahmesbah.com/seo/geo-sge-optimization",
                "url": "https://www.ataullahmesbah.com/seo/geo-sge-optimization",
                "name": "GEO & SGE Optimization Expert | AI Search Optimization Services 2024",
                "description": "Professional GEO (Generative Engine Optimization) & SGE (Search Generative Experience) services. Prepare your website for AI-powered search. Get AI-ready SEO strategy.",
                "isPartOf": {
                    "@type": "WebSite",
                    "@id": "https://www.ataullahmesbah.com/#website",
                    "url": "https://www.ataullahmesbah.com",
                    "name": "Ataullah Mesbah - SEO Expert",
                    "description": "Professional SEO and digital marketing services"
                },
                "about": {
                    "@type": "Thing",
                    "name": "AI Search Optimization"
                },
                "primaryImageOfPage": {
                    "@type": "ImageObject",
                    "url": "https://www.ataullahmesbah.com/images/geo-sge-optimization.jpg",
                    "width": 1200,
                    "height": 630,
                    "caption": "GEO SGE Optimization Services - AI Search Ready"
                },
                "datePublished": "2024-01-01",
                "dateModified": "2024-01-01",
                "breadcrumb": {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://www.ataullahmesbah.com"
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "SEO Services",
                            "item": "https://www.ataullahmesbah.com/seo"
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": "GEO SGE Optimization",
                            "item": "https://www.ataullahmesbah.com/seo/geo-sge-optimization"
                        }
                    ]
                }
            },
            {
                "@type": "Organization",
                "name": "Ataullah Mesbah SEO Services",
                "url": "https://www.ataullahmesbah.com",
                "logo": "https://www.ataullahmesbah.com/logo.png",
                "description": "Professional SEO and digital marketing services specializing in AI search optimization",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah"
                ],
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "BD"
                }
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

export default GEOSGESchemaWrapper;