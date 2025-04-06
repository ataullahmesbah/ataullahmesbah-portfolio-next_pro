// app/(with-layout)/mesbahoffwego/page.js
import { Metadata } from "next";
import MesbahOffWeGo from "@/app/components/Travel/Travel";

async function getTravelData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/travel`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch travel data');
    return res.json();
}

export async function generateMetadata() {
    const travels = await getTravelData();
    return {
        title: "Travel - Ataullah Mesbah",
        description: "Explore Ataullah Mesbah's global travel adventures, featuring breathtaking historical sites and stunning photo galleries.",
        keywords: ["travel", "Ataullah Mesbah", "historical sites", "photo gallery", "adventures"],
        openGraph: {
            title: "Travel - Ataullah Mesbah",
            description: "Journey through Ataullah Mesbah's travel experiences around the world",
            url: "https://ataullahmesbah.com/mesbahoffwego",
            images: [{
                url: travels.find(t => t.category === 'Journey')?.imageUrl || defaultImage,
                width: 1200,
                height: 630,
                alt: "Mesbah Off We Go Adventures",
            }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Travel - Ataullah Mesbah",
            description: "Explore world travels with Ataullah Mesbah",
            images: [travels.find(t => t.category === 'Journey')?.imageUrl || defaultImage],
        },
    };
}

export default async function MesbahOffWeGoPage() {
    const travels = await getTravelData();
    return <MesbahOffWeGo travels={travels} />;
}