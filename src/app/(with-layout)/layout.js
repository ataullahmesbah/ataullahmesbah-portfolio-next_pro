
import Navbar from "../components/Navbar/Navbar";
import RootNavbar from "../components/RootNavbar/RootNavbar";
import Footer from "../components/Share/Footer/Footer";
import ChatIcon from "../components/Chat/ChatIcon/ChatIcon";

export default function RootLayout({ children }) {
    return (
       
                <div>
                    <RootNavbar />
                    <Navbar />
                    {children}
                    <ChatIcon />
                    <Footer />
                </div>
           
    
    );
}