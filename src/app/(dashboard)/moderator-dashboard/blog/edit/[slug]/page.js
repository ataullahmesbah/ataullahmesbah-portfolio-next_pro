
import UpdateBlogPostModerator from "@/app/Dashboard/ModeratorDashboard/Blogs/EditBlogs/EditBlogs";


const page = ({ params }) => {
    return (
        <div>
            <UpdateBlogPostModerator params={params} />
        </div>
    );
};

export default page;
