'use client';

import Banner from "../Home/Banner/Banner";
import WhoIsMesbah from "../Home/WhoIsMesbah/WhoIsMesbah";
import AboutUs from "../Home/AboutUs/AboutUs";
import PortfolioTabs from "../Share/PortfolioTabs/PortfolioTabs";
import ProjectsTab from "../Share/ProjectsTab/ProjectsTab";
import ShopHighlightSection from "../Home/ShopHighlightSection/ShopHighlightSection";
import MarketingSection from "../Share/MarketingSection/MarketingSection";
import Testimonials from "../Share/Testimonials/Testimonials";
import CertificationsAwards from "../CertificationsAwards/CertificationsAwards";
import NewsletterPage from "../Share/NewsletterPage/NewsletterPage";
import ContactAssistance from "../Share/ConatctAssistance/ContactAssistance";
import FAQSection from "../Share/FAQSection/FAQSection";
import SideIcons from "../SideIcons/SideIcons";
import Sponser from '../Sponser/Sponser';
import MesbahCustomLoader from "../MesbahCustomLoader/MesbahCustomLoader";
import { useEffect, useState } from "react";
import SuccessSection from "../Home/SuccessSection/SuccessSection";

export default function HomePageContent() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait until all images & resources are loaded
        const handleLoad = () => setLoading(false);

        if (document.readyState === "complete") {
            // If already loaded
            setLoading(false);
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    if (loading) {
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
            <SuccessSection />
            {/* <CertificationsAwards /> */}
            <NewsletterPage />
            <ContactAssistance />
            <FAQSection />

            <SideIcons />
        </main>
    );
}


