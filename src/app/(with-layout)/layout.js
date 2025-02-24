

import Navbar from "../components/Navbar/Navbar";
import RootNavbar from "../components/RootNavbar/RootNavbar";
import Footer from "../components/Share/Footer/Footer";


const RootLayout = ({ children }) => {
    return (
        <div>

            <RootNavbar />

                <Navbar />
                {children}
           

            <Footer />

        </div>
    );
};

export default RootLayout;