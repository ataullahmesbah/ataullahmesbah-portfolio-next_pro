import NewsLetter from "@/app/components/News/NewsLetter/Newsletter";

export async function generateMetadata() {
    return {
        title: 'Newsletters | Ataullah Mesbah',
        description: 'Explore our curated newsletters on tech, travel, innovation, and digital trends.',
        keywords: 'newsletters, tech, travel, innovation, digital trends, Ataullah Mesbah',
        openGraph: {
            title: 'Newsletters | Ataullah Mesbah',
            description: 'Explore our curated newsletters on tech, travel, innovation, and digital trends.',
            images: ['/images/og-newsletter.jpg'],
            url: 'https://ataullahmesbah.com/newsletter',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Newsletters | Ataullah Mesbah',
            description: 'Explore our curated newsletters on tech, travel, innovation, and digital trends.',
            images: ['/images/og-newsletter.jpg'],
        },
    };
}

export default function NewsletterPage() {
    return (
        <div>
            <NewsLetter />
        </div>
    );
}