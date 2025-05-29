// src/app/letter/[slug]/page.js

import NewsLetterDetails from "@/app/components/Share/Letter/NewsLetterDetails/NewsLetterDetails";


async function fetchNewsletter(slug) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/api/newsletter/letter?slug=${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch newsletter: ${res.statusText}`);
        }
        const data = await res.json();
        if (!data || !data.title) {
            return null;
        }
        return data;
    } catch (error) {
        return null;
    }
}

export async function generateMetadata({ params }) {
    const newsletter = await fetchNewsletter(params.slug);

    if (!newsletter) {
        return {
            title: 'Newsletter Not Found | Ataullah Mesbah',
            description: 'The requested newsletter could not be found.',
            robots: 'noindex, nofollow',
        };
    }

    return {
        title: `${newsletter.title} | Ataullah Mesbah Newsletter`,
        description: newsletter.metaDescription || newsletter.description.slice(0, 160),
        keywords: [
            newsletter.category,
            newsletter.title,
            'Ataullah Mesbah',
            'newsletter',
            ...newsletter.content.flatMap(section => section.bulletPoints || []),
        ].filter(Boolean),
        alternates: {
            canonical: `https://www.ataullahmesbah.com/letter/${params.slug}`,
        },
        openGraph: {
            title: newsletter.title,
            description: newsletter.metaDescription || newsletter.description.slice(0, 160),
            url: `https://www.ataullahmesbah.com/letter}/${params.slug}`,
            siteName: 'Ataullah Mesbah Portfolio',
            images: [
                {
                    url: newsletter.mainImage,
                    width: 1200,
                    height: 630,
                    alt: newsletter.imageAlt || `Image for ${newsletter.title}`,
                },
            ],
            locale: 'en_US',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: newsletter.title,
            description: newsletter.metaDescription || newsletter.description.slice(0, 160),
            images: [newsletter.mainImage],
        },
        robots: newsletter.status === 'draft' ? 'noindex, nofollow' : 'index, follow',
    };
}

export default async function Page({ params }) {
    const newsletter = await fetchNewsletter(params.slug);

    const schema = newsletter
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: newsletter.title,
            description: newsletter.metaDescription || newsletter.description.slice(0, 160),
            image: newsletter.mainImage,
            author: {
                '@type': 'Person',
                name: newsletter.author,
            },
            publisher: {
                '@type': 'Organization',
                name: 'Ataullah Mesbah Portfolio',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.ataullahmesbah.com/images/logo.png',
                },
            },
            datePublished: newsletter.publishDate,
            dateModified: newsletter.updatedAt || newsletter.publishDate,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://www.ataullahmesbah.com/letter/${params.slug}`,
            },
        }
        : null;

    return (
        <>
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            )}
            <NewsLetterDetails params={params} />
        </>
    );
}