import WebSchemaWrapper from "@/app/components/Schema/WebSchemaWrapper/WebSchemaWrapper";
import WebDevsServices from "@/app/Dashboard/Services/WebDevs/WebDevsServices/WebDevsServices";


export const metadata = {
    title: "Web Development Services by Ataullah Mesbah | Custom Websites & Ecommerce",
    description:
        "Transform your online presence with expert web development services by Ataullah Mesbah. Specializing in custom websites, ecommerce platforms, WordPress solutions, and performance optimization.",
    keywords: [
        "web development services",
        "custom website development",
        "ecommerce development",
        "WordPress customization",
        "web performance optimization",
        "Ataullah Mesbah",
        "MERN stack development",
    ],
    alternates: {
        canonical: "https://www.ataullahmesbah.com/web-development",
    },
    openGraph: {
        title: "Web Development Services by Ataullah Mesbah",
        description:
            "Build high-performance websites with Ataullah Mesbah's web development services. From custom solutions to ecommerce, get started today!",
        url: "https://www.ataullahmesbah.com/web-development",
        siteName: "Ataullah Mesbah Portfolio",
        images: [
            {
                url: "https://www.ataullahmesbah.com/images/web-development-og.jpg",
                width: 1200,
                height: 630,
                alt: "Ataullah Mesbah Web Development Services",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Web Development Services by Ataullah Mesbah",
        description:
            "Expert web development for custom websites and ecommerce. Contact Ataullah Mesbah for tailored solutions!",
        images: ["https://www.ataullahmesbah.com/images/web-development-og.jpg"],
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

export const revalidate = 3600; // Revalidate every hour for ISR

export default function Page() {
    return (
        <div>
            <WebSchemaWrapper page="web-development" />
            <WebDevsServices />
        </div>
    );
}