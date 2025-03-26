'use client';
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
import LicenseCertification from "../components/Share/LicenseCertification/LicenseCertification";
import SideIcons from '../components/SideIcons/SideIcons';
import NewsletterPage from '../components/Share/NewsletterPage/NewsletterPage';

const HomePage = () => {
    const { data: session, status } = useSession();

    console.log('Session:', session?.user?.name); // Debugging with optional chaining

    return (
        <>
            <Head>
                <title>Ataullah Mesbah</title>
                <meta name="description" content="Learn about Ataullah Mesbah, an SEO expert and world traveler, who has worked with 100+ companies and clients, and is a proud member of a leading ad agency in Canada." />
                <meta name="keywords" content="Ataullah Mesbah, SEO Expert, World Explorer, Pouvoir en ligne, Web Development, Affiliate Marketing" />
            </Head>

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
                <MarketingSection />
                <Testimonials />
                <NewSection />
                <LicenseCertification />
                <NewsletterPage />
                <ContactAssistance />
                <SideIcons />
            </main>
        </>
    );
};

export default HomePage;