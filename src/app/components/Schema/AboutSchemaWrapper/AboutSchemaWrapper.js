'use client';

import Head from "next/head";

const AboutSchemaWrapper = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "name": "Ataullah Mesbah",
                "description": "Professional Full Stack Developer and SEO Specialist with 6+ years of experience in web development, digital marketing, and AI search optimization.",
                "url": "https://ataullahmesbah.com/about",
                "image": "https://ataullahmesbah.com/images/about-profile.jpg",
                "jobTitle": "Full Stack Developer & Digital Strategist",
                "knowsAbout": [
                    "Full Stack Web Development",
                    "Search Engine Optimization",
                    "Generative Engine Optimization (GEO)",
                    "Search Generative Experience (SGE)",
                    "React.js Development",
                    "Next.js Development",
                    "Technical SEO",
                    "E-commerce Development",
                    "Content Strategy",
                    "Digital Marketing"
                ],
                "hasOccupation": {
                    "@type": "Occupation",
                    "name": "Web Developer & SEO Specialist",
                    "occupationLocation": {
                        "@type": "Country",
                        "name": "Bangladesh"
                    },
                    "estimatedSalary": {
                        "@type": "MonetaryAmountDistribution",
                        "name": "Base Salary",
                        "currency": "USD",
                        "percentile10": 20000,
                        "percentile25": 30000,
                        "median": 40000,
                        "percentile75": 50000,
                        "percentile90": 60000
                    }
                },
                "alumniOf": {
                    "@type": "EducationalOrganization",
                    "name": "Southeast University",
                    "sameAs": "https://www.seu.edu.bd/"
                },
                "sameAs": [
                    "https://www.linkedin.com/in/ataullah-mesbah",
                    "https://x.com/ataullah_mesbah",
                    "https://www.youtube.com/@ataullah.mesbah",
                    "https://github.com/ataullahmesbah"
                ],
                "worksFor": {
                    "@type": "Organization",
                    "name": "Freelance Digital Consultant"
                },
                "award": [
                    "6+ Years Industry Experience",
                    "100+ Projects Completed",
                    "15+ Countries Served"
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What services does Ataullah Mesbah offer?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ataullah offers comprehensive digital services including Full Stack Web Development, SEO Optimization, GEO & SGE AI Search Optimization, E-commerce Development, and Technical SEO audits for businesses worldwide."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How many years of experience does Ataullah have?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ataullah has over 6 years of professional experience in web development and digital marketing, working with clients from 15+ countries across various industries."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is GEO and SGE optimization?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "GEO (Generative Engine Optimization) and SGE (Search Generative Experience) are advanced SEO strategies for AI-powered search. GEO optimizes content for generative AI interfaces, while SGE focuses on Google's AI search experience to improve visibility in conversational and AI-generated results."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What technologies does Ataullah specialize in?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ataullah specializes in modern web technologies including React.js, Next.js, Node.js, MongoDB, Tailwind CSS, and various SEO tools. He also has expertise in AI search optimization, technical SEO, and performance optimization."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does Ataullah work with international clients?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, Ataullah works with clients from over 15 countries including USA, UK, Canada, Australia, Germany, and various Asian countries. He provides remote digital services to businesses worldwide."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What industries has Ataullah worked with?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ataullah has experience across multiple industries including E-commerce, SaaS, Education, Healthcare, Real Estate, Travel, and Digital Publishing. He adapts strategies based on industry-specific requirements and target audiences."
                        }
                    }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://ataullahmesbah.com"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "About",
                        "item": "https://ataullahmesbah.com/about"
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

export default AboutSchemaWrapper;