// app/(with-layout)/projects/page.js 

import ProjectsPage from "@/app/components/Projects/Projects";
import Head from "next/head";

const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Projects - Ataullah Mesbah",
  "description": "Discover the innovative projects by Ataullah Mesbah, showcasing expertise in AI, web development, and technology solutions.",
  "url": "https://ataullahmesbah.com/projects",
  "publisher": {
    "@type": "Organization",
    "name": "Ataullah Mesbah",
    "url": "https://ataullahmesbah.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@ataullahmesbah.com",
      "contactType": "Customer Support"
    }
  },
  "lastReviewed": "2025-05-18"
};

const page = () => {
  return (
    <div className="">
     <Head>
          {/* JSON-LD Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />
     </Head>

    
          {/* Projects Component */}
          <div>
            <ProjectsPage />
          </div>
        </div>
     
  );
};

export const metadata = {
  title: 'Projects - Ataullah Mesbah',
  description: "Discover the innovative projects by Ataullah Mesbah, showcasing expertise in AI, web development, and technology solutions.",
  keywords: 'projects, Ataullah Mesbah, AI, web development, technology, portfolio, innovation',
  authors: [{ name: 'Ataullah Mesbah' }],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Projects - Ataullah Mesbah',
    description: "Explore Ataullah Mesbah's portfolio of projects in AI, web development, and technology.",
    url: 'https://ataullahmesbah.com/projects',
    type: 'website',
    siteName: 'Ataullah Mesbah',
    images: [{ url: 'https://ataullahmesbah.com/images/og-projects.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects - Ataullah Mesbah',
    description: "View Ataullah Mesbah's innovative projects in AI and web development.",
    images: ['https://ataullahmesbah.com/images/og-projects.jpg'],
  },
};

export default page;