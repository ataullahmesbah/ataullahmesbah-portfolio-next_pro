import Providers from "@/providers/Providers";
import Navbar from "../components/Navbar/Navbar";
import RootNavbar from "../components/RootNavbar/RootNavbar";
import Footer from "../components/Share/Footer/Footer";

export default function RootLayout({ children }) {
    return (
        <Providers>
            <div>
                <RootNavbar />
                <Navbar />
                {children}
                <Footer />
            </div>
        </Providers>
    );
}