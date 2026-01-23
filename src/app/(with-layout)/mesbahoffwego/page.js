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
        const featuredLocation = travels.find(t => t.category === 'Journey')?.location || "Global";
        const travelCount = travels.length;

        return {
            title: "Mesbah Off We Go - Travel Adventures & Global Explorations by Ataullah Mesbah",
            description: `Join Ataullah Mesbah (MesbahOffwego) on ${travelCount} global travel adventures. Discover historical sites in ${featuredLocation}, cultural experiences, and stunning photo galleries from around the world. Travel tips, destination guides, and personal journey stories.`,
            keywords: [
                "Mesbah Off We Go",
                "Ataullah Mesbah travel",
                "global adventures",
                "historical sites travel",
                "travel photography",
                "cultural exploration",
                "adventure travel blog",
                `${featuredLocation} travel guide`,
                "travel content creator",
                "world explorer"
            ].slice(0, 10), // Google recommends max 10 keywords
            authors: [{ name: "Ataullah Mesbah" }],
            creator: "Ataullah Mesbah",
            publisher: "Mesbah Off We Go",
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            alternates: {
                canonical: "https://ataullahmesbah.com/mesbahoffwego",
                languages: {
                    'en-US': 'https://ataullahmesbah.com/mesbahoffwego',
                },
            },
            openGraph: {
                title: "Mesbah Off We Go - Travel Adventures by Ataullah Mesbah",
                description: `Explore ${travelCount} travel destinations with Ataullah Mesbah. Historical sites, cultural experiences, and adventure photography from ${featuredLocation} and beyond.`,
                url: "https://ataullahmesbah.com/mesbahoffwego",
                siteName: "Ataullah Mesbah - Travel",
                locale: "en_US",
                type: "website",
                images: [
                    {
                        url: featuredImage,
                        width: 1200,
                        height: 628, // Changed to 628 for consistency
                        alt: `Mesbah Off We Go Travel Adventures in ${featuredLocation} - Ataullah Mesbah`,
                    },
                    {
                        url: "https://ataullahmesbah.com/images/travel-og.jpg",
                        width: 1200,
                        height: 628,
                        alt: "Mesbah Off We Go - Travel Blog by Ataullah Mesbah",
                    }
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: "Mesbah Off We Go - Travel Adventures",
                description: `Travel with Ataullah Mesbah: ${travelCount} destinations explored worldwide`,
                creator: "@mesbahoffwego",
                site: "@mesbahoffwego",
                images: [featuredImage],
            },
            verification: {
                google: "your-google-verification-code", 
                yandex: "your-yandex-verification-code",
                yahoo: "your-yahoo-verification-code",
            },
            category: "Travel",
        };
    } catch (error) {
      
        return {
            title: "Mesbah Off We Go - Travel Adventures & Global Explorations",
            description: "Join Ataullah Mesbah on global travel adventures. Discover historical sites, cultural experiences, and stunning photo galleries.",
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                title: "Mesbah Off We Go - Travel Adventures",
                description: "Travel with Ataullah Mesbah: Exploring world cultures and historical sites",
                images: [{
                    url: defaultImage,
                    width: 1200,
                    height: 628,
                    alt: "Mesbah Off We Go Travel Adventures",
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