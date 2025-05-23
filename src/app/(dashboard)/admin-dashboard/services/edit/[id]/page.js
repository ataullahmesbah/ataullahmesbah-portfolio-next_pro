// app/(dashboard)/admin-dashboard/services/edit/[id]/page.js

import EditSEOService from "@/app/Dashboard/Services/EditServices/EditServices";


const Page = ({ params }) => {
    return (
        <div>
            <EditSEOService params={params} />
        </div>
    );
};

export default Page;