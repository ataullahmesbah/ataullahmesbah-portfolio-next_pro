import LeftSideBanner from "./LeftSideBanner/LeftSideBanner";
import RightSideBanner from "./RightSide/RightSide";

const Banner = () => {
    return (
        <div className="bg-blue-50">
            <div className="container mx-auto w-full h-[80vh] flex flex-col justify-center md:flex-row gap-10 md:gap-20 items-center">
            <LeftSideBanner />
            <RightSideBanner />
        </div>
        </div>
    );
};

export default Banner;