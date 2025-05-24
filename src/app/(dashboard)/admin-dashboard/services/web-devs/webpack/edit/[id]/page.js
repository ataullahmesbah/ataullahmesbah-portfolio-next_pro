import EditWebPackage from "@/app/Dashboard/Services/WebDevs/EditWebPackage/EditWebPackage";


const Page = ({ params }) => {
    return (
        <div>
            <EditWebPackage params={params} />
        </div>
    );
};

export default Page;