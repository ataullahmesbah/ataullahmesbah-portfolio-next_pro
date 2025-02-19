
import { AuthProvider } from "@/providers/AuthProvider";
import Navbar from "../components/Navbar/Navbar";
import RootNavbar from "../components/RootNavbar/RootNavbar";
import Footer from "../components/Share/Footer/Footer";


const RootLayout = ({ children }) => {
    return (
        <div>

            <RootNavbar />



            <AuthProvider>

                <Navbar />
                {children}
            </AuthProvider>


            <Footer />

        </div>
    );
};

export default RootLayout;