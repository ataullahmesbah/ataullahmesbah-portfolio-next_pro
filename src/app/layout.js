import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import Script from "next/script";
import SessionChecker from "@/providers/SessionChecker/SessionChecker";
import ToastProvider from "./components/Share/ToastProvider/ToastProvider";
import AdsModal from "./components/Ads/AdsModal/AdsModal";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://www.ataullahmesbah.com"),

  applicationName: "Ataullah Mesbah",

  title: {
    default: "Full-Stack Developer & SEO Specialist | Ataullah Mesbah",
    template: "%s | Ataullah Mesbah",
  },

  description:
    "Ataullah Mesbah is a Full-Stack Developer and SEO Specialist specializing in Next.js, React, Node.js, and AI-powered search optimization (GEO). Building scalable, high-performance, SEO-friendly digital solutions that drive measurable business growth.",

  keywords: [
    "Ataullah Mesbah",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "SEO Specialist",
    "Technical SEO Expert",
    "AI Search Optimization",
    "Generative Engine Optimization",
    "Web Developer Bangladesh",
    "Digital Strategist",
  ],

  authors: [
    {
      name: "Ataullah Mesbah",
      url: "https://www.ataullahmesbah.com",
    },
  ],

  creator: "Ataullah Mesbah",
  publisher: "Ataullah Mesbah",

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

  alternates: {
    canonical: "https://www.ataullahmesbah.com",
  },

  openGraph: {
    siteName: "Ataullah Mesbah",
    type: "website",
    url: "https://www.ataullahmesbah.com",
    title: "Ataullah Mesbah | Full-Stack Developer & SEO Strategist",
    description:
      "Next.js & React Developer | Technical SEO Specialist | AI Search Optimization Expert delivering measurable growth.",
    siteName: "Ataullah Mesbah",
    images: [
      {
        url: "/og-image.jpg", // make sure this exists in public folder
        width: 1200,
        height: 630,
        alt: "Ataullah Mesbah - Full Stack Developer & SEO Specialist",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ataullah Mesbah | Full-Stack Developer & SEO Expert",
    description:
      "Full-Stack Developer specializing in Next.js, React, and AI-driven SEO strategies.",
    images: ["/og-image.jpg"],
  },

  category: "technology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" itemScope itemType="https://schema.org/WebPage">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/log.svg" type="image/svg+xml" />

        {/* 1. Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ataullah Mesbah",
              url: "https://www.ataullahmesbah.com",
              jobTitle: "Full Stack Developer & SEO Specialist",
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Southeast University",
              },
              knowsAbout: [
                "Next.js",
                "React",
                "Node.js",
                "Web Developer",
                "Electrical and Electronics Engineering",
              ],
              sameAs: [
                "https://www.linkedin.com/in/ataullah-mesbah",
                "https://x.com/ataullah_mesbah",
                "https://www.youtube.com/@ataullah.mesbah"
              ]
            }),
          }}
        />

        {/* 2. Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Ataullah Mesbah",
              alternateName: "Ataullah Mesbah",
              url: "https://www.ataullahmesbah.com",
            }),
          }}
        />

        {/* 3. Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Ataullah Mesbah",
              url: "https://www.ataullahmesbah.com",
              logo: "https://www.ataullahmesbah.com/log.svg",
            }),
          }}
        />


        {/* Google Ads Script */}

        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4013047783468752"
          crossorigin="anonymous"></Script>

      </head>

      <body
        // inter.className remove করো
        className="antialiased"
        // system font fallback দাও (Inter এর মতো দেখাবে)
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        }}
        suppressHydrationWarning={true}
      >
        <Providers>
          <SessionChecker />
          <AdsModal />
          {children}
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
