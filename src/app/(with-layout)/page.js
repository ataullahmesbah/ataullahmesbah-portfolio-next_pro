import Head from "next/head";
import Banner from "../components/Home/Banner/Banner";
import WhoIsMesbah from "../components/Home/WhoIsMesbah/WhoIsMesbah";
import AboutUs from "../components/Home/AboutUs/AboutUs";
import Testimonials from "../components/Share/Testimonials/Testimonials";
import PortfolioTabs from "../components/Share/PortfolioTabs/PortfolioTabs";
import ContactAssistance from "../components/Share/ConatctAssistance/ContactAssistance";
import Sponser from "../components/Sponser/Sponser";
import MarketingSection from "../components/Share/MarketingSection/MarketingSection";




const page = () => {
    return (


        <>
            <Head>
                <title>SEO Expert | Ataullah Mesbah</title>
                <meta name="description" content="Learn about Ataullah Mesbah, an SEO expert and world traveler, who has worked with 100+ companies and clients, and is a proud member of a leading ad agency in Canada." />
                <meta name="keywords" content="Ataullah Mesbah, SEO Expert, World Explorer, Pouvoir en ligne, Web Development, Affiliate Marketing" />
            </Head>

            <main className="">
                <Banner />
                <Sponser />
                <AboutUs />
                <PortfolioTabs />
                <WhoIsMesbah />
                <MarketingSection />
                <Testimonials />
                <ContactAssistance />


            </main>
        </>

    );
};

export default page;