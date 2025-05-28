import Providers from "@/providers/Providers";
import Navbar from "../components/Navbar/Navbar";
import RootNavbar from "../components/RootNavbar/RootNavbar";
import Footer from "../components/Share/Footer/Footer";
import TrackAffiliateVisits from "../Dashboard/AffiliatePage/TrackAffiliateVisits/TrackAffiliateVisits";

export default function RootLayout({ children }) {
    return (
        <Providers>
            <TrackAffiliateVisits>
                <div>
                    <RootNavbar />
                    <Navbar />
                    {children}
                    <Footer />
                </div>
            </TrackAffiliateVisits>
        </Providers>
    );
}