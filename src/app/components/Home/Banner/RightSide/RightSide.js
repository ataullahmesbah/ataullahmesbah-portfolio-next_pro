'use client';

import Image from 'next/image';

const RightSideBanner = () => {

    return (

        <div className="border-2 p-3 rounded-md border-gray-600">
            <Image
                src='https://i.ibb.co/gR2V4cn/image.jpg'
                alt="Banner Image"
                width={500}
                height={500}
                objectFit="cover"
                className="rounded-full w-96 h-96"
            />
        </div>

    );
};

export default RightSideBanner;
