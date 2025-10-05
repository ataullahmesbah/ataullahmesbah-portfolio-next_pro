import EcommerceSEOSchemaWrapper from "@/app/components/Schema/EcommerceSEOSchemaWrapper/EcommerceSEOSchemaWrapper";
import EcommerceSEOContent from "@/app/Dashboard/Services/EcommerceSEOContent/EcommerceSEOContent";


export const metadata = {
    title: "Ecommerce SEO Expert | Product Page & Online Store SEO Optimization",
    description: "Professional Ecommerce SEO services for online stores. Product page optimization, category SEO, technical ecommerce SEO, and AI search optimization for higher sales.",
    keywords: [
        "ecommerce SEO services",
        "product page optimization",
        "online store SEO",
        "shopify SEO expert",
        "ecommerce technical SEO",
        "product schema markup",
        "ecommerce GEO optimization",
        "shopping cart SEO"
    ],
    alternates: {
        canonical: "https://www.ataullahmesbah.com/seo/ecommerce-seo",
    },
    openGraph: {
        title: "Ecommerce SEO Expert | Online Store Optimization Services",
        description: "Professional Ecommerce SEO services including product page optimization, technical SEO, and AI search optimization for higher conversions.",
        url: "https://www.ataullahmesbah.com/seo/ecommerce-seo",
        siteName: "Ataullah Mesbah - SEO Expert",
        images: [
            {
                url: "https://www.ataullahmesbah.com/images/ecommerce-seo-services.jpg",
                width: 1200,
                height: 630,
                alt: "Ecommerce SEO Services - Product Page & Online Store Optimization",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Ecommerce SEO Expert | Online Store Optimization",
        description: "Professional Ecommerce SEO services for product pages, category optimization, and AI search.",
        images: ["https://www.ataullahmesbah.com/images/ecommerce-seo-services.jpg"],
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

export default function EcommerceSEOPage() {
    return (
        <div>
            <EcommerceSEOSchemaWrapper />
            <EcommerceSEOContent />
        </div>
    );
}