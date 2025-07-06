
import { useSession } from 'next-auth/react';
import Head from "next/head";
import Banner from "../components/Home/Banner/Banner";
import WhoIsMesbah from "../components/Home/WhoIsMesbah/WhoIsMesbah";
import AboutUs from "../components/Home/AboutUs/AboutUs";
import Testimonials from "../components/Share/Testimonials/Testimonials";
import PortfolioTabs from "../components/Share/PortfolioTabs/PortfolioTabs";
import ContactAssistance from "../components/Share/ConatctAssistance/ContactAssistance";
import Sponser from "../components/Sponser/Sponser";
import MarketingSection from "../components/Share/MarketingSection/MarketingSection";
import NewSection from "../components/Home/NewSection/NewSection";
import ProjectsTab from "../components/Share/ProjectsTab/ProjectsTab";
import SideIcons from '../components/SideIcons/SideIcons';
import NewsletterPage from '../components/Share/NewsletterPage/NewsletterPage';
import CertificationsAwards from '../components/CertificationsAwards/CertificationsAwards';
import ShopHighlightSection from '../components/Home/ShopHighlightSection/ShopHighlightSection';



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

const HomePage = () => /* const { data: session, status } = useSession();*/ /* console.log('Session:', session?.user?.name); */ (



    <main
        className="min-h-screen"
        style={{
            background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
        }}
    >
        <Banner />
        <Sponser />
        <AboutUs />
        <PortfolioTabs />
        <WhoIsMesbah />
        <ProjectsTab />
        <ShopHighlightSection />
        <MarketingSection />
        <Testimonials />
        <NewSection />
        <CertificationsAwards />
        <NewsletterPage />
        <ContactAssistance />
        <SideIcons />
    </main>

);

export default HomePage;    