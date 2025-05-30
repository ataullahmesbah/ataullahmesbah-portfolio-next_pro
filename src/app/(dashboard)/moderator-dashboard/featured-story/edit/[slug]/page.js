import EditFeaturedStoryMod from "@/app/Dashboard/ModeratorDashboard/FeaturedStory/EditFeaturedStory/EditFeaturedStory";



const page = ({ params }) => {
    return (
        <div>
            <EditFeaturedStoryMod params={params} />
        </div>
    );
};

export default page;
