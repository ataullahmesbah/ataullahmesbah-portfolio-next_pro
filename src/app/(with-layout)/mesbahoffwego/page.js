// app/(with-layout)/mesbahoffwego/page.js
import { Metadata } from "next";
import MesbahOffWeGo from "@/app/components/Travel/Travel";
import TravelSchema from "@/app/components/Schema/TravelSchema/TravelSchema";
const defaultImage = "/images/default-travel.jpg";


async function getTravelData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/travel`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch travel data');
    return res.json();
}

export async function generateMetadata() {
    try {
        const travels = await getTravelData();

        const featuredImage = travels.find(t => t.category === 'Journey')?.imageUrl || defaultImage;

        return {
            title: "Mesbah Off We Go - Travel Adventures & Global Explorations",
            description: "Join Ataullah Mesbah (MesbahOffwego) on global travel adventures. Discover historical sites, cultural experiences, and stunning photo galleries from around the world.",
            keywords: ["Mesbah Off We Go", "Ataullah Mesbah travel", "global adventures", "historical sites", "travel photography"],
            openGraph: {
                title: "Mesbah Off We Go - Travel Adventures",
                description: "Travel with Ataullah Mesbah: Exploring world cultures, historical sites, and unforgettable adventures",
                url: "https://ataullahmesbah.com/mesbahoffwego",
                siteName: "Ataullah Mesbah",
                images: [{
                    url: featuredImage,
                    width: 1200,
                    height: 630,
                    alt: "Mesbah Off We Go Travel Adventures - Ataullah Mesbah",
                }],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: "Mesbah Off We Go - Travel Adventures",
                description: "Explore world travels with Ataullah Mesbah (MesbahOffwego)",
                images: [featuredImage],
            },
        };
    } catch (error) {
        // If API fails, use default image
        return {
            title: "Mesbah Off We Go - Travel Adventures",
            description: "Join Ataullah Mesbah on global travel adventures",
            openGraph: {
                images: [{
                    url: defaultImage,
                    width: 1200,
                    height: 630,
                    alt: "Mesbah Off We Go Travel",
                }],
            },
        };
    }
}

export default async function MesbahOffWeGoPage() {
    const travels = await getTravelData();

    const schemaData = {
        pageTitle: "Mesbah Off We Go - Travel Adventures",
        description: "Travel adventures and explorations by Ataullah Mesbah",
        travels: travels,
        author: "Ataullah Mesbah",
        siteUrl: "https://ataullahmesbah.com",
        pageUrl: "https://ataullahmesbah.com/mesbahoffwego",
    };

    return (
        <>
            <TravelSchema data={schemaData} />
            <MesbahOffWeGo travels={travels} />
        </>
    );
}