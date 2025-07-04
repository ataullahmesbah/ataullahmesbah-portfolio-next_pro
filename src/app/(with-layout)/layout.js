import Providers from "@/providers/Providers";
import Navbar from "../components/Navbar/Navbar";
import RootNavbar from "../components/RootNavbar/RootNavbar";
import Footer from "../components/Share/Footer/Footer";
import TrackAffiliateVisits from "../Dashboard/AffiliatePage/TrackAffiliateVisits/TrackAffiliateVisits";
import ChatIcon from "../components/Chat/ChatIcon/ChatIcon";

export default function RootLayout({ children }) {
    return (
        <Providers>
            <TrackAffiliateVisits>
                <div>
                    <RootNavbar />
                    <Navbar />
                    {children}
                    <ChatIcon />
                    <Footer />
                </div>
            </TrackAffiliateVisits>
        </Providers>
    );
}