'use client';

import Image from 'next/image';

const RightSideBanner = () => {
    return (
        <div className="md:w-1/2 flex justify-center md:justify-end">
            <div className="border-2 p-3 rounded-md border-gray-800">
                <Image
                    src='https://i.ibb.co/gR2V4cn/image.jpg'
                    alt="Banner Image"
                    width={500}
                    height={500}
                    objectFit="cover"
                    className="rounded-full w-72 h-72 md:w-96 md:h-96"
                />
            </div>
        </div>
    );
};

export default RightSideBanner;
