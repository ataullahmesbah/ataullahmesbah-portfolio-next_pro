

import NewsLetter from "@/app/components/News/LetterNews/LetterNews";
import Head from "next/head";

const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Letter - Ataullah Mesbah",
    "description": "Subscribe to Ataullah Mesbah's newsletter for the latest updates, insights, and exclusive content. Stay connected with our community.",
    "url": "https://ataullahmesbah.com/letter",
    "publisher": {
        "@type": "Organization",
        "name": "Ataullah Mesbah",
        "url": "https://ataullahmesbah.com",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "info@ataullahmesbah.com",
            "contactType": "Customer Support"
        }
    },
    "lastReviewed": "2025-05-18"
};

const page = () => {
    return (
        <div className="">

            {/* JSON-LD Schema */}
            <Head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
                />
            </Head>

            {/* Newsletter Component */}
            <div>
                <NewsLetter />

            </div>

        </div>
    );
};

export const metadata = {
    title: 'Letter - Ataullah Mesbah',
    description: "Subscribe to Ataullah Mesbah's newsletter for the latest updates, insights, and exclusive content. Stay connected with our community.",
    keywords: 'newsletter, Ataullah Mesbah, updates, insights, subscription, exclusive content',
    authors: [{ name: 'Ataullah Mesbah' }],
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    openGraph: {
        title: 'Letter - Ataullah Mesbah',
        description: "Subscribe to Ataullah Mesbah's newsletter for the latest updates and exclusive content.",
        url: 'https://ataullahmesbah.com/letter',
        type: 'website',
        siteName: 'Ataullah Mesbah',
        images: [{ url: 'https://ataullahmesbah.com/images/og-letter.jpg' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Letter - Ataullah Mesbah',
        description: "Join Ataullah Mesbah's newsletter for updates and exclusive content.",
        images: ['https://ataullahmesbah.com/images/og-letter.jpg'],
    },
};

export default page;