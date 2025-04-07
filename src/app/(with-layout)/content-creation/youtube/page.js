import YoutubeContent from "@/app/components/Content/Youtube/YoutubeContent";

async function getYoutubeVideos() {
    const url = `${process.env.NEXTAUTH_URL}/api/content?platform=YouTube`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch YouTube videos');
    return res.json();
}

export async function generateMetadata() {
    return {
        title: "YouTube Videos - Ataullah Mesbah",
        description: "All YouTube video creations by Ataullah Mesbah",
    };
}

export default async function YoutubeContentPage() {
    const videos = await getYoutubeVideos();
    return <YoutubeContent videos={videos} />;
}