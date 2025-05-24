import SchemaWrapper from "@/app/components/Schema/SchemaWrapper/SchemaWrapper";
import SearchEngineService from "@/app/Dashboard/Services/SearchEngineService/SearchEngineService";


export const metadata = {
  title: "SEO Services by Ataullah Mesbah | Expert Search Engine Optimization",
  description:
    "Boost your website's ranking with professional SEO services by Ataullah Mesbah, an experienced SEO expert and digital marketer. Book a consultation to optimize your online presence.",
  keywords: [
    "SEO services",
    "search engine optimization",
    "Ataullah Mesbah",
    "digital marketing",
    "SEO expert",
    "website ranking",
    "SEO consultation",
  ],
  alternates: {
    canonical: "https://www.ataullahmesbah.com/seo",
  },
  openGraph: {
    title: "SEO Services by Ataullah Mesbah | Expert Search Engine Optimization",
    description:
      "Elevate your online visibility with tailored SEO strategies from Ataullah Mesbah. Schedule a consultation today!",
    url: "https://www.ataullahmesbah.com/seo",
    siteName: "Ataullah Mesbah Portfolio",
    images: [
      {
        url: "https://www.ataullahmesbah.com/images/seo-services-og.jpg",
        width: 1200,
        height: 630,
        alt: "Ataullah Mesbah SEO Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Services by Ataullah Mesbah",
    description:
      "Professional SEO services to improve your website's ranking. Connect with Ataullah Mesbah for expert strategies!",
    images: ["https://www.ataullahmesbah.com/images/seo-services-og.jpg"],
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
      <SchemaWrapper />
      <SearchEngineService />
    </div>
  );
}