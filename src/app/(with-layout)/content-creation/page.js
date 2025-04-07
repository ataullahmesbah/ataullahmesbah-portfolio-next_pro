import ClientContentCreation from "@/app/components/Content/ClientContentPage/ClientContentPage";
import { Metadata } from "next";


async function getContentData() {
    const url = `${process.env.NEXTAUTH_URL}/api/content`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch content data');
    const content = await res.json();
    return content.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function generateMetadata() {
    return {
        title: "Content Creation - Ataullah Mesbah",
        description: "Discover Ataullah Mesbah's creative journey through captivating videos.",
        alternates: { canonical: "https://ataullahmesbah.com/content-creation" },
        openGraph: {
            title: "Content Creation - Ataullah Mesbah",
            description: "Explore my video creations on YouTube and Facebook",
            url: "https://ataullahmesbah.com/content-creation",
            images: [{ url: "https://ataullahmesbah.com/og-image-content.jpg" }],
            type: "website",
        },
    };
}

export default async function ContentCreationPage() {
    let content = [];
    try {
        content = await getContentData();
    } catch (error) {
        console.error("Error fetching content:", error);
    }

    const youtubeVideos = content.filter(v => v.platform === 'YouTube').slice(0, 6);
    const facebookVideos = content.filter(v => v.platform === 'Facebook').slice(0, 6);

    return (
        <ClientContentCreation
            youtubeVideos={youtubeVideos}
            facebookVideos={facebookVideos}
            youtubeCount={content.filter(v => v.platform === 'YouTube').length}
            facebookCount={content.filter(v => v.platform === 'Facebook').length}
        />
    );
}