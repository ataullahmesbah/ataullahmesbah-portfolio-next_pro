// app/(with-layout)/mesbahoffwego/[slug]/page.js

import TravelDetail from "@/app/components/Travel/TravelDetails/TravelDetails";
import { Metadata } from "next";


async function getTravelBySlug(slug) {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/travel`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch travel data');
    const travels = await res.json();
    return travels.find(t => t.slug === slug) || null;
}

export async function generateMetadata({ params }) {
    const travel = await getTravelBySlug(params.slug);
    if (!travel) return { title: 'Travel Not Found - Ataullah Mesbah' };

    const description = travel.description.slice(0, 160);
    return {
        title: `${travel.title} - Ataullah Mesbah`,
        description,
        keywords: [travel.title, "Ataullah Mesbah", travel.category.toLowerCase(), "travel", "adventure"],
        alternates: {
            canonical: `https://yourdomain.com/mesbahoffwego/${travel.slug}`, // Replace with your domain
        },
        openGraph: {
            title: `${travel.title} - Ataullah Mesbah`,
            description,
            url: `https://yourdomain.com/mesbahoffwego/${travel.slug}`,
            images: [
                {
                    url: travel.imageUrl,
                    width: 800,
                    height: 400,
                    alt: travel.title,
                },
            ],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: `${travel.title} - Ataullah Mesbah`,
            description,
            images: [travel.imageUrl],
        },
    };
}

export default async function TravelDetailPage({ params }) {
    const travel = await getTravelBySlug(params.slug);
    if (!travel) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <p className="text-white text-xl">Travel not found</p>
            </div>
        );
    }

    return <TravelDetail travel={travel} slug={params.slug} />;
}