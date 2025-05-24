import EditWebDevelopmentService from "@/app/Dashboard/Services/WebDevs/EditWebDevelopmentService/EditWebDevelopmentService";


const Page = ({ params }) => {
    return (
        <div>
            <EditWebDevelopmentService params={params} />
        </div>
    );
};

export default Page;