import UpdateBlogPostPage from "@/app/Dashboard/Blogs/EditBlogs/EditBlogs";


const page = ({ params }) => {
    return (
        <div>
            <UpdateBlogPostPage params={params} />
        </div>
    );
};

export default page;
