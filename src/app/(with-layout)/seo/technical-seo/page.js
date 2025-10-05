
import TechnicalSEOSchemaWrapper from '@/app/components/Schema/TechnicalSEOSchemaWrapper/TechnicalSEOSchemaWrapper';
import TechnicalSEOContent from '@/app/Dashboard/Services/TechnicalSEOContent/TechnicalSEOContent';


export const metadata = {
    title: "Technical SEO Services Expert | Comprehensive Technical SEO Audit & Optimization",
    description: "Professional Technical SEO services by Ataullah Mesbah. Core Web Vitals optimization, site structure, speed optimization, and comprehensive technical SEO audits.",
    keywords: [
        "technical SEO services",
        "Core Web Vitals optimization",
        "website speed optimization",
        "SEO audit services",
        "site structure optimization",
        "technical SEO expert",
        "website performance SEO",
        "crawlability optimization"
    ],
    alternates: {
        canonical: "https://www.ataullahmesbah.com/seo/technical-seo",
    },
    openGraph: {
        title: "Technical SEO Expert | Comprehensive Technical Optimization Services",
        description: "Professional Technical SEO services including Core Web Vitals, site speed, and comprehensive technical audits for better search rankings.",
        url: "https://www.ataullahmesbah.com/seo/technical-seo",
        siteName: "Ataullah Mesbah - SEO Expert",
        images: [
            {
                url: "https://www.ataullahmesbah.com/images/technical-seo-services.jpg",
                width: 1200,
                height: 630,
                alt: "Technical SEO Services - Core Web Vitals & Performance Optimization",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Technical SEO Expert | Comprehensive Optimization Services",
        description: "Professional Technical SEO services for better website performance and search rankings.",
        images: ["https://www.ataullahmesbah.com/images/technical-seo-services.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

export default function TechnicalSEOPage() {
    return (
        <div>
            <TechnicalSEOSchemaWrapper />
            <TechnicalSEOContent />
        </div>
    );
}