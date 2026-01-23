// app/(with-layout)/contact/page.js

import ContactPage from "@/app/components/Share/ContactPage/ContactPage";
import Head from "next/head";

const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contact - Ataullah Mesbah",
    "description": "Get in touch with Ataullah Mesbah for inquiries, support, or collaboration opportunities. Reach out via email or social media.",
    "url": "https://ataullahmesbah.com/contact",
    "publisher": {
        "@type": "Organization",
        "name": "Ataullah Mesbah",
        "url": "https://ataullahmesbah.com",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "contact@ataullahmesbah.com",
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

            {/* Contact Component */}
            <div>
                <ContactPage />
            </div>

        </div>
    );
};

export const metadata = {
    title: 'Contact - Ataullah Mesbah',
    description: "Get in touch with Ataullah Mesbah for inquiries, support, or collaboration opportunities. Reach out via email or social media.",
    keywords: 'contact, Ataullah Mesbah, inquiries, support, collaboration, email, social media',
    authors: [{ name: 'Ataullah Mesbah' }],
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    openGraph: {
        title: 'Contact - Ataullah Mesbah',
        description: "Reach out to Ataullah Mesbah for inquiries or collaboration opportunities.",
        url: 'https://ataullahmesbah.com/contact',
        type: 'website',
        siteName: 'Ataullah Mesbah',
        images: [{ url: 'https://ataullahmesbah.com/images/og-contact.jpg' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact - Ataullah Mesbah',
        description: "Contact Ataullah Mesbah for support or collaboration via email or social media.",
        images: ['https://ataullahmesbah.com/images/og-contact.jpg'],
    },
};

export default page;