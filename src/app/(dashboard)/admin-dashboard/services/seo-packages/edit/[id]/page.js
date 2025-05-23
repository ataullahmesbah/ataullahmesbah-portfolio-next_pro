// app/(dashboard)/admin-dashboard/services/seo-packages/edit/[id]/page.js

import EditSEOPackage from "@/app/Dashboard/Services/EditSEOPack/EditSEOPack";



const Page = ({ params }) => {
    return (
        <div>
            <EditSEOPackage params={params} />
        </div>
    );
};

export default Page;