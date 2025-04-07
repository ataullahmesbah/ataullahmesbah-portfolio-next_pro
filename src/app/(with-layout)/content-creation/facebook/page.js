import FacebookContent from "@/app/components/Content/Facebook/FacebookContent";

async function getFacebookVideos() {
    const url = `${process.env.NEXTAUTH_URL}/api/content?platform=Facebook`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch Facebook videos');
    return res.json();
}

export async function generateMetadata() {
    return {
        title: "Facebook Videos - Ataullah Mesbah",
        description: "All Facebook video creations by Ataullah Mesbah",
    };
}

export default async function FacebookContentPage() {
    const videos = await getFacebookVideos();
    return <FacebookContent videos={videos} />;
}