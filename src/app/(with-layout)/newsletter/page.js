// src/app/(with-layout)/newsletter/page.js
import NewsLetter from "@/app/components/News/NewsLetter/Newsletter";
import LetterSchemaWrapper from "@/app/components/Schema/LetterSchemaWrapper/LetterSchemaWrapper";

export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ataullahmesbah.com';

    return {
        title: 'Newsletters | Ataullah Mesbah - Tech, Travel & Innovation Insights',
        description: 'Explore curated newsletters on web development, SEO, digital marketing, travel experiences, and tech innovations by Ataullah Mesbah.',
        keywords: 'newsletters, tech newsletters, travel blogs, web development, SEO tips, digital marketing, innovation, Ataullah Mesbah',
        authors: [{ name: 'Ataullah Mesbah' }],
        creator: 'Ataullah Mesbah',
        publisher: 'Ataullah Mesbah',
        robots: 'index, follow, max-image-preview:large',
        openGraph: {
            title: 'Newsletters | Ataullah Mesbah - Tech, Travel & Innovation Insights',
            description: 'Explore curated newsletters on web development, SEO, digital marketing, travel experiences, and tech innovations.',
            images: [
                {
                    url: '/images/og-newsletter.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Ataullah Mesbah Newsletters',
                },
            ],
            url: `${baseUrl}/newsletter`,
            siteName: 'Ataullah Mesbah',
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Newsletters | Ataullah Mesbah - Tech, Travel & Innovation Insights',
            description: 'Explore curated newsletters on web development, SEO, digital marketing, travel experiences, and tech innovations.',
            images: ['/images/og-newsletter.jpg'],
            creator: '@ataullahmesbah',
            site: '@ataullahmesbah',
        },
        alternates: {
            canonical: `${baseUrl}/newsletter`,
        },
        verification: {
            google: process.env.GOOGLE_SITE_VERIFICATION,
        },
    };
}

export default function page() {
    // Schema for the newsletter listing page
    const listingSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Newsletters - Ataullah Mesbah',
        description: 'Collection of newsletters on tech, travel, and innovation topics',
        url: 'https://ataullahmesbah.com/newsletter',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: 0, // This will be dynamically set
            itemListOrder: 'https://schema.org/ItemListOrderDescending',
        }
    };

    return (
        <div>
            <NewsLetter />
            <LetterSchemaWrapper schema={listingSchema} />
        </div>
    );
}