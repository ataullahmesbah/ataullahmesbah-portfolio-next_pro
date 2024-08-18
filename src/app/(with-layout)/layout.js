import Navbar from "../components/Navbar/Navbar";
import RootNavbar from "../components/RootNavbar/RootNavbar";


const RootLayout = ({ children }) => {
    return (
        <div>

            <RootNavbar />
            <Navbar />
            {children}

        </div>
    );
};

export default RootLayout;