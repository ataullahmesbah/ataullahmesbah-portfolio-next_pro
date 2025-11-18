'use client';

import Head from "next/head";

const WebSchemaWrapper = ({ page }) => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            // ✅ Website Info
            {
                "@type": "WebSite",
                "name": "Ataullah Mesbah Portfolio",
                "url": "https://www.ataullahmesbah.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.ataullahmesbah.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },

            // ✅ Organization Info
            {
                "@type": "Organization",
                "name": "Ataullah Mesbah Web Solutions",
                "url": "https://www.ataullahmesbah.com",
                "logo": "https://www.ataullahmesbah.com/logo.png",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah"
                ],
                "contactPoint":

                {
                    "@type": "ContactPoint",
                    "telephone": "+8801571083401",
                    "email": "info@ataullahmesbah.com",
                    "url": "https://www.ataullahmesbah.com/contact",
                    "contactType": ["customer service", "technical support"],
                    "areaServed": "BD",
                    "availableLanguage": ["English", "Bengali"],
                    "hoursAvailable": {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                        "opens": "09:00",
                        "closes": "22:00"
                    }
                }

            },

            {
                "@type": "LocalBusiness",
                "name": "Ataullah Mesbah Web Solutions",
                "description": "Professional Full Stack Web Developer specializing in React, Next.js, and scalable web applications",
                "url": "https://www.ataullahmesbah.com",
                "telephone": "+8801571083401",
                "email": "contact@ataullahmesbah.com",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "BD",
                    "addressRegion": "Dhaka",
                    "addressLocality": "Dhaka"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "23.8103",
                    "longitude": "90.4125"
                },
                "openingHours": "Mo-Su 09:00-22:00",
                "priceRange": "$$",
                "areaServed": "Worldwide",
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah"
                ],
                "serviceArea": {
                    "@type": "GeoCircle",
                    "geoMidpoint": {
                        "@type": "GeoCoordinates",
                        "latitude": "23.8103",
                        "longitude": "90.4125"
                    },
                    "geoRadius": "50000"
                }
            },



            //  Person Schema এ contact info 
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "url": "https://www.ataullahmesbah.com",
                "telephone": "+8801571083401",
                "email": "contact@ataullahmesbah.com",
                "jobTitle": "Full Stack Developer",
                "skills": "React, Next.js, Node.js, MongoDB, Express.js, CSS, SaaS, API Integration, Database Design",
                "knowsAbout": [
                    "Web Development",
                    "Full Stack Development",
                    "Ecommerce Solutions",
                    "SEO Optimization",
                    "Responsive Design",
                    "Database Management",
                    "API Integration",
                    "Performance Optimization"
                ],
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah",
                    "https://github.com/ataullahmesbah"
                ],
                "description": "Professional Full Stack Developer specializing in building scalable, responsive websites and web applications with modern technologies."
            },

            // ✅ Main Service
            {
                "@type": "Service",
                "name":
                    page === "web-packages"
                        ? "Web Development Packages"
                        : page === "web-development"
                            ? "Web Development Services"
                            : "Search Engine Optimization Services",
                "description":
                    page === "web-packages"
                        ? "Tailored web development packages by Ataullah Mesbah, including custom websites, ecommerce platforms, and portfolio sites."
                        : page === "web-development"
                            ? "Professional full-stack web development services by Ataullah Mesbah, covering custom sites, ecommerce solutions, SEO optimization, and performance improvements."
                            : "Professional SEO services by Ataullah Mesbah to improve website rankings, drive organic traffic, and enhance online visibility.",
                "provider": {
                    "@type": "Person",
                    "name": "Ataullah Mesbah",
                    "url": "https://www.ataullahmesbah.com",
                    "sameAs": [
                        "https://www.linkedin.com/in/ataullah-mesbah",
                        "https://x.com/ataullah_mesbah"
                    ]
                },
                "offers": {
                    "@type": "OfferCatalog",
                    "name":
                        page === "web-packages"
                            ? "Web Development Packages"
                            : page === "web-development"
                                ? "Web Development Services"
                                : "SEO Services",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name":
                                    page === "web-development"
                                        ? "Custom Website Development"
                                        : page === "web-packages"
                                            ? "Custom Website Package"
                                            : "SEO Audit",
                                "description":
                                    page === "web-development"
                                        ? "Custom full-stack websites built with Node.js, React, and MongoDB for businesses needing dynamic functionality."
                                        : page === "web-packages"
                                            ? "Pre-designed custom website packages for startups and enterprises."
                                            : "Comprehensive SEO audits and keyword research.",
                                "url": `https://www.ataullahmesbah.com/${page}`
                            },
                            "priceCurrency": "USD",
                            "price": "299.00",
                            "availability": "https://schema.org/InStock"
                        },
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name":
                                    page === "web-development"
                                        ? "Ecommerce Development"
                                        : page === "web-packages"
                                            ? "Ecommerce Package"
                                            : "Keyword Research",
                                "description":
                                    page === "web-development"
                                        ? "Ecommerce platforms with secure checkout, payment integration, and custom product management."
                                        : page === "web-packages"
                                            ? "Ecommerce website package including cart, product management, and SEO."
                                            : "Targeted keyword research for ranking growth.",
                                "url": `https://www.ataullahmesbah.com/${page}`
                            },
                            "priceCurrency": "USD",
                            "price": "699.00",
                            "availability": "https://schema.org/InStock"
                        }
                    ]
                },
                "datePublished": "2025-10-06"
            },

            // ✅ FAQ Section
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Why choose custom web development?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Custom web development ensures your website is built specifically for your business goals — offering full control, scalability, and unique design aligned with your brand identity."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How long does it take to build an ecommerce website?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Typically, an ecommerce site takes between 3 to 6 weeks depending on design complexity, product volume, and integration needs."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do you provide maintenance and updates?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, all packages include post-launch support and monthly maintenance options to ensure your site remains fast, secure, and up-to-date."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Can you integrate APIs or third-party services?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Absolutely. We integrate RESTful APIs, payment gateways, analytics tools, and other third-party systems to enhance your website's functionality."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Is SEO included with your web development packages?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, every site we build includes SEO-friendly architecture, meta optimization, and performance improvements for better Google ranking."
                        }
                    }
                ]
            },

            // ✅ Breadcrumb
            {
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
                        "name":
                            page === "web-packages"
                                ? "Web Development Packages"
                                : page === "web-development"
                                    ? "Web Development Services"
                                    : "SEO Services",
                        "item": `https://www.ataullahmesbah.com/${page}`
                    }
                ]
            }
        ]
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
