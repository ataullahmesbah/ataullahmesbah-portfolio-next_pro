// app/about/page.js
import { Suspense } from 'react';
import Testimonials from "@/app/components/Share/Testimonials/Testimonials";
import Loading from '@/app/components/Share/SampleLoader/SamplerLoader';
import AboutSchemaWrapper from '@/app/components/Schema/AboutSchemaWrapper/AboutSchemaWrapper';
import AboutContent from '@/app/components/Share/AboutContent/AboutContent';
import Sponser from '@/app/components/Sponser/Sponser';

export const metadata = {
    title: "About Ataullah Mesbah | Full Stack Developer & SEO Specialist Bangladesh",
    description: "Meet Ataullah Mesbah - Professional Full Stack Developer, SEO Specialist, and Digital Strategist with 6+ years experience in web development and digital marketing.",
    keywords: [
        "Full Stack Developer Bangladesh",
        "SEO Specialist Bangladesh",
        "Web Developer Bangladesh",
        "Digital Strategist",
        "Next.js Developer",
        "GEO SGE Expert",
        "Technical SEO Bangladesh",
        "Ecommerce Developer"
    ],
    alternates: {
        canonical: "https://ataullahmesbah.com/about",
    },
    openGraph: {
        title: "About Ataullah Mesbah | Full Stack Developer & Digital Strategist",
        description: "Professional profile of Ataullah Mesbah with 6+ years of digital experience in web development and SEO",
        url: "https://ataullahmesbah.com/about",
        siteName: "Ataullah Mesbah Portfolio",
        images: [
            {
                url: "https://ataullahmesbah.com/images/about-og.jpg",
                width: 1200,
                height: 630,
                alt: "Ataullah Mesbah - Full Stack Developer & SEO Specialist",
            },
        ],
        locale: "en_US",
        type: "profile",
    },
    twitter: {
        card: "summary_large_image",
        title: "About Ataullah Mesbah | Full Stack Developer & SEO Specialist",
        description: "Professional web developer and SEO specialist with 6+ years experience",
        images: ["https://ataullahmesbah.com/images/about-og.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

const AboutPage = () => {
    return (
        <main className="bg-gray-900 text-gray-100 min-h-screen overflow-x-hidden">
            {/* Schema Markup */}
            <AboutSchemaWrapper />

            {/* Main Content */}
            <AboutContent />

            {/* Sponsor Section */}
            <Sponser />

            {/* Testimonials Section with Loading */}
            <Suspense fallback={<Loading />}>
                <Testimonials />
            </Suspense>
        </main>
    );
};

export default AboutPage;