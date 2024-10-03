import LeftSideBanner from "./LeftSideBanner/LeftSideBanner";
import RightSideBanner from "./RightSide/RightSide";


const Banner = () => {
    return (
        <div className="text-white ">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center lg:justify-between px-2 gap-10 py-10">
                <LeftSideBanner />

          
                <RightSideBanner />
            </div>
        </div>
    );
};

export default Banner;
