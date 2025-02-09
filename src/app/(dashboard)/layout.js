import Link from "next/link";


const DashboardLayout = ({ children }) => {
    return (
        <div className="grid grid-cols-12">

            {/* Side Nav */}

            <div className="col-span-3">

                <Link href='/'>Home</Link>

                <h3>This is Side Navbar</h3>
            </div>

            {/* Dashboard Content */}

            <div className="col-span-9">

                <h3>This is Dashboard Content</h3>

                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;