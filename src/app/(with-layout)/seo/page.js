import SchemaWrapper from "@/app/components/Schema/SchemaWrapper/SchemaWrapper";
import SearchEngineService from "@/app/Dashboard/Services/SearchEngineService/SearchEngineService";

export const metadata = {
  title: "SEO Services | Ataullah Mesbah - Global SEO Specialist",
  description: "Professional SEO services for global businesses. Technical SEO, E-commerce SEO, AI Search Optimization (SGE). Boost rankings & revenue. Free SEO audit available.",
  keywords: [
    "SEO services",
    "search engine optimization",
    "international SEO",
    "global SEO expert",
    "technical SEO",
    "ecommerce SEO",
    "AI search optimization",
    "SGE optimization",
    "SEO consultant",
    "digital marketing expert"
  ],
  alternates: {
    canonical: "https://www.ataullahmesbah.com/seo",
  },
  openGraph: {
    title: "Global SEO Services Expert | Ataullah Mesbah - Rank Worldwide",
    description: "Professional SEO services for international businesses. Technical SEO, AI-search optimization, and revenue-focused strategies.",
    url: "https://www.ataullahmesbah.com/seo",
    siteName: "Ataullah Mesbah - SEO Expert",
    images: [
      {
        url: "https://www.ataullahmesbah.com/images/seo-services-og.jpg",
        width: 1200,
        height: 630,
        alt: "Ataullah Mesbah - Global SEO Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Global SEO Services Expert | Ataullah Mesbah",
    description: "Professional SEO for international businesses. Technical, E-commerce & AI-search optimization.",
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

export const revalidate = 3600;

export default function Page() {
  return (
    <div>
      <SchemaWrapper />
      <SearchEngineService />
    </div>
  );
}