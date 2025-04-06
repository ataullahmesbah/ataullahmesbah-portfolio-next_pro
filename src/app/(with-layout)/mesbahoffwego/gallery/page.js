// app/(with-layout)/mesbahoffwego/gallery/page.js
import GalleryPage from "@/app/components/Travel/GalleryPage/GalleryPage";
import { Metadata } from "next";


async function getGalleryData() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/travel?category=Gallery`, {
        cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch gallery data');
    return res.json();
}

export async function generateMetadata() {
    return {
        title: "Photo Gallery - Mesbah Off We Go",
        description: "Explore the complete collection of travel photos from Ataullah Mesbah's journeys",
    };
}

export default async function Gallery() {
    const gallery = await getGalleryData();
    return <GalleryPage gallery={gallery} />;
}