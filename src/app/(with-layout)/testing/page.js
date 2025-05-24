

import WebSchemaWrapper from "@/app/components/Schema/WebSchemaWrapper/WebSchemaWrapper";
import WebService from "@/app/Dashboard/Services/WebDevs/WebService/WebService";

export const metadata = {
  title: "Web Development Services by Ataullah Mesbah | Custom Websites",
  description:
    "Discover professional web development services by Ataullah Mesbah. From custom websites to ecommerce platforms, we deliver scalable, high-performance solutions.",
  keywords: [
    "web development services",
    "custom website development",
    "Ataullah Mesbah",
    "ecommerce development",
    "WordPress customization",
    "web performance optimization",
  ],
  alternates: {
    canonical: "https://www.ataullahmesbah.com/web-development",
  },
  openGraph: {
    title: "Web Development Services by Ataullah Mesbah",
    description:
      "Build your dream website with expert web development services. Contact Ataullah Mesbah for custom solutions!",
    url: "https://www.ataullahmesbah.com/web-development",
    siteName: "Ataullah Mesbah Portfolio",
    images: [
      {
        url: "https://www.ataullahmesbah.com/images/web-development-og.jpg",
        width: 1200,
        height: 630,
        alt: "Ataullah Mesbah Web Development",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Development Services by Ataullah Mesbah",
    description:
      "Custom web development services to elevate your online presence. Connect with Ataullah Mesbah!",
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

export const revalidate = 3600;

export default function Page() {
  return (
    <div>
      <WebSchemaWrapper page="web-development" />
      <WebService />
    </div>
  );
}