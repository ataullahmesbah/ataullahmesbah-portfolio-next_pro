
//app/letter/page.js

import NewsLetter from "@/app/components/News/LetterNews/LetterNews";

export const metadata = {
    title: 'Letter | Ataullah Mesbah',
    description: "Subscribe to Ataullah Mesbah's newsletter for the latest updates, insights, and exclusive content. Stay connected with our community.",
    keywords: 'newsletter, Ataullah Mesbah, updates, insights, subscription, exclusive content',
    authors: [{ name: 'Ataullah Mesbah' }],
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    openGraph: {
        title: 'Letter - Ataullah Mesbah',
        description: "Subscribe to Ataullah Mesbah's newsletter for the latest updates and exclusive content.",
        url: 'https://ataullahmesbah.com/letter',
        type: 'website',
        siteName: 'Ataullah Mesbah',
        images: [{ url: 'https://ataullahmesbah.com/images/og-letter.jpg' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Letter - Ataullah Mesbah',
        description: "Join Ataullah Mesbah's newsletter for updates and exclusive content.",
        images: ['https://ataullahmesbah.com/images/og-letter.jpg'],
    },
};

const page = () => {
    return <NewsLetter />;
};

export default page;


