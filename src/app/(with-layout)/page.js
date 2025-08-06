import HomePageContent from "../components/HomePageContent/HomePageContent";




// ✅ SEO & Meta Configuration
export const metadata = {
    title: 'Ataullah Mesbah - From Code to Content, SEO to Sales & Travel',
    description: 'Discover the journey of Ataullah Mesbah — from development and content creation to SEO, sales, and global travel. Learn more about his work, story, and projects.',
    keywords: 'Ataullah Mesbah, SEO Expert, Developer, Content Creator, Traveler, Sales Strategist, Affiliate Marketing, Pouvoir en ligne, Web Consultant',
    authors: [{ name: 'Ataullah Mesbah', url: 'https://ataullahmesbah.com' }],
    openGraph: {
        title: 'Ataullah Mesbah - From Code to Content, SEO to Sales & Travel',
        description: 'Explore the diverse expertise of Ataullah Mesbah, spanning development, SEO, content, sales, and worldwide travel.',
        url: 'https://ataullahmesbah.com',
        type: 'website',
        siteName: 'Ataullah Mesbah',
        images: [
            {
                url: 'https://ataullahmesbah.com/images/og-home.jpg',
                width: 1200,
                height: 630,
                alt: 'Ataullah Mesbah',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ataullah Mesbah - From Code to Content, SEO to Sales & Travel',
        description: 'Follow Ataullah Mesbah’s journey through code, content, SEO, sales, and global travel.',
        images: ['https://ataullahmesbah.com/images/og-home.jpg'],
    },
    robots: 'index, follow',
};

const HomePage = () => /* const { data: session, status } = useSession();*/ /* console.log('Session:', session?.user?.name); */(



    <main>
        <HomePageContent />
    </main>

);

export default HomePage;    