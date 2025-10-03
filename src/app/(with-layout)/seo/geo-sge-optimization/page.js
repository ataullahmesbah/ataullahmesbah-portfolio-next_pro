
import GEOSGESchemaWrapper from '@/app/components/Schema/GEOSGESchemaWrapper/GEOSGESchemaWrapper';
import GEOSGEContent from '@/app/Dashboard/Services/GEOSGEContent/GEOSGEContent';



export const metadata = {
    title: "GEO & SGE Optimization Expert | AI Search Optimization Services 2024",
    description: "Professional GEO (Generative Engine Optimization) & SGE (Search Generative Experience) services. Prepare your website for AI-powered search. Get AI-ready SEO strategy.",
    keywords: [
        "GEO optimization",
        "SGE optimization",
        "AI search optimization",
        "Generative Engine Optimization",
        "Google SGE services",
        "AI-ready SEO",
        "search generative experience",
        "future-proof SEO"
    ],
    alternates: {
        canonical: "https://www.ataullahmesbah.com/seo/geo-sge-optimization",
    },
    openGraph: {
        title: "GEO & SGE Optimization Expert | AI Search Ready SEO",
        description: "Get your website optimized for Google's AI search. Professional GEO & SGE optimization services for future-proof rankings.",
        url: "https://www.ataullahmesbah.com/seo/geo-sge-optimization",
        siteName: "Ataullah Mesbah - SEO Expert",
        images: [
            {
                url: "https://www.ataullahmesbah.com/images/geo-sge-optimization.jpg",
                width: 1200,
                height: 630,
                alt: "GEO SGE Optimization Services - AI Search Ready",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GEO & SGE Optimization Expert | AI Search Services",
        description: "Professional GEO & SGE optimization for Google's AI search. Future-proof your website rankings.",
        images: ["https://www.ataullahmesbah.com/images/geo-sge-optimization.jpg"],
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

export default function GEOSGEPage() {
    return (
        <div>
            <GEOSGESchemaWrapper />
            <GEOSGEContent />
        </div>
    );
}