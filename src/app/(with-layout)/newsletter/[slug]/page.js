// src/app/(with-layout)/newsletter/[slug]/page.js
import { notFound } from 'next/navigation';
import LetterSchemaWrapper from '@/app/components/Schema/LetterSchemaWrapper/LetterSchemaWrapper';
import NewsletterDetail from '@/app/components/News/NewsletterDetail/NewsletterDetail';


// Generate metadata for each newsletter
export async function generateMetadata({ params }) {
    const { slug } = params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ataullahmesbah.com';

    try {
        const res = await fetch(`${baseUrl}/api/newsletter/letter/${slug}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return {
                title: 'Newsletter Not Found | Ataullah Mesbah',
                description: 'The requested newsletter could not be found.',
            };
        }

        const newsletter = await res.json();

        return {
            title: `${newsletter.metaTitle || newsletter.title} | Ataullah Mesbah`,
            description: newsletter.metaDescription || newsletter.description?.substring(0, 160),
            keywords: newsletter.keywords || `${newsletter.category}, newsletter, ${newsletter.author}`,
            authors: [{ name: newsletter.author || 'Ataullah Mesbah' }],
            openGraph: {
                title: newsletter.metaTitle || newsletter.title,
                description: newsletter.metaDescription || newsletter.description?.substring(0, 160),
                images: [
                    {
                        url: newsletter.mainImage,
                        width: 1200,
                        height: 630,
                        alt: newsletter.imageAlt || newsletter.title,
                    },
                ],
                url: `${baseUrl}/newsletter/${slug}`,
                type: 'article',
                publishedTime: newsletter.publishedDate,
                modifiedTime: newsletter.updatedAt,
                authors: [newsletter.author || 'Ataullah Mesbah'],
            },
            twitter: {
                card: 'summary_large_image',
                title: newsletter.metaTitle || newsletter.title,
                description: newsletter.metaDescription || newsletter.description?.substring(0, 160),
                images: [newsletter.mainImage],
                creator: '@ataullahmesbah',
            },
            alternates: {
                canonical: `${baseUrl}/newsletter/${slug}`,
            },
            robots: 'index, follow',
        };
    } catch (error) {
        return {
            title: 'Newsletter | Ataullah Mesbah',
            description: 'Read our latest newsletter on tech, travel, and innovation.',
        };
    }
}

// Generate static params for better performance
export async function generateStaticParams() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ataullahmesbah.com';

    try {
        const res = await fetch(`${baseUrl}/api/newsletter/letter`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return [];
        }

        const newsletters = await res.json();

        return newsletters.map((newsletter) => ({
            slug: newsletter.slug,
        }));
    } catch (error) {

        return [];
    }
}

export default async function NewsletterSlugPage({ params }) {
    const { slug } = params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ataullahmesbah.com';

    let newsletter = null;

    try {
        const res = await fetch(`${baseUrl}/api/newsletter/letter/${slug}`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            notFound();
        }

        newsletter = await res.json();
    } catch (error) {
        notFound();
    }

    // Schema for individual newsletter
    const newsletterSchema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: newsletter.metaTitle || newsletter.title,
        description: newsletter.metaDescription || newsletter.description,
        image: newsletter.mainImage,
        datePublished: newsletter.publishedDate || newsletter.createdAt,
        dateModified: newsletter.updatedAt || newsletter.createdAt,
        author: {
            '@type': 'Person',
            name: newsletter.author || 'Ataullah Mesbah',
            url: `${baseUrl}/about`,
        },
        publisher: {
            '@type': 'Organization',
            name: 'Ataullah Mesbah',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/images/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/newsletter/${slug}`,
        },
        articleSection: newsletter.category,
        articleBody: newsletter.description,
    };

    // Breadcrumb schema
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Newsletters',
                item: `${baseUrl}/newsletter`,
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: newsletter.title,
                item: `${baseUrl}/newsletter/${slug}`,
            },
        ],
    };

    return (
        <div>
            <NewsletterDetail newsletter={newsletter} />
            <LetterSchemaWrapper schema={newsletterSchema} />
            <LetterSchemaWrapper schema={breadcrumbSchema} />
        </div>
    );
}

export const dynamicParams = true;