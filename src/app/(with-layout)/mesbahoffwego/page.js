// app/(with-layout)/mesbahoffwego/page.js
import MesbahOffWeGo from "@/app/components/Travel/Travel";
import { Metadata } from "next";

async function getTravelData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/travel`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch travel data');
    return res.json();
}

export async function generateMetadata() {
    const travels = await getTravelData();
    const description = "Explore Ataullah Mesbah's global travel adventures, featuring breathtaking historical sites and stunning photo galleries.";

    return {
        title: "Travel - Ataullah Mesbah",
        description,
        keywords: ["travel", "Ataullah Mesbah", "historical sites", "photo gallery", "adventures"],
        openGraph: {
            title: "Travel - Ataullah Mesbah",
            description,
            url: "https://ataullahmesbah.com/mesbahoffwego",
            images: [
                {
                    url: travels.find(t => t.category === 'Journey')?.imageUrl || '/images/travel/campgreen.jpg',
                    width: 1200,
                    height: 630,
                    alt: "Mesbah Off We Go Adventures",
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: "Travel - Ataullah Mesbah",
            description,
            images: [travels.find(t => t.category === 'Journey')?.imageUrl || '/images/travel/campgreen.jpg'],
        },
    };
}

export default async function MesbahOffWeGoPage() {
    try {
        const travels = await getTravelData();
        return <MesbahOffWeGo travels={travels} />;
    } catch (error) {
        return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }
}