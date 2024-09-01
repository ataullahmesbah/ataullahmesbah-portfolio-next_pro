import LeftSideBanner from "./LeftSideBanner/LeftSideBanner";
import RightSideBanner from "./RightSide/RightSide";


const Banner = () => {
    return (
        <div className="bg-blue-50 py-10">
            <div className="container mx-auto w-full h-[80vh] flex flex-col-reverse justify-center items-center md:flex-row gap-10 md:gap-20">
                <LeftSideBanner />
                <RightSideBanner />
            </div>
        </div>
    );
};

export default Banner;
