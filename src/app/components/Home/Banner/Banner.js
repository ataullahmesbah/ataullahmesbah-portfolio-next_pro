'use client';

import LeftSideBanner from "./LeftSideBanner/LeftSideBanner";
import RightSideBanner from "./RightSide/RightSide";

const Banner = () => {
    return (
        <div className=" text-white flex items-center">
            <div className="max-w-7xl mx-auto px-4 py-20 md:px-6 lg:px-8 flex flex-col lg:flex-row gap-10 lg:gap-20">
                <LeftSideBanner />
                <RightSideBanner />
            </div>
        </div>
    );
};

export default Banner;
