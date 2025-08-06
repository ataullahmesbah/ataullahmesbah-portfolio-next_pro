'use client';


import { useState, useEffect } from 'react';
import MesbahCustomLoader from "../MesbahCustomLoader/MesbahCustomLoader";
import Banner from "../Home/Banner/Banner";
import WhoIsMesbah from "../Home/WhoIsMesbah/WhoIsMesbah";
import AboutUs from "../Home/AboutUs/AboutUs";
import PortfolioTabs from "../Share/PortfolioTabs/PortfolioTabs";
import ProjectsTab from "../Share/ProjectsTab/ProjectsTab";
import ShopHighlightSection from "../Home/ShopHighlightSection/ShopHighlightSection";
import MarketingSection from "../Share/MarketingSection/MarketingSection";
import Testimonials from "../Share/Testimonials/Testimonials";
import NewSection from "../Home/NewSection/NewSection";
import CertificationsAwards from "../CertificationsAwards/CertificationsAwards";
import NewsletterPage from "../Share/NewsletterPage/NewsletterPage";
import ContactAssistance from "../Share/ConatctAssistance/ContactAssistance";
import FAQSection from "../Share/FAQSection/FAQSection";
import SideIcons from "../SideIcons/SideIcons";
import Sponser from '../Sponser/Sponser';



export default function HomePageContent() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <MesbahCustomLoader />;
    }

    return (

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
            <FAQSection />

            <SideIcons />
        </main>
    );
}


