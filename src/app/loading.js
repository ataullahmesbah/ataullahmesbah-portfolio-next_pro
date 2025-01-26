'use client';

import { LineWave } from 'react-loader-spinner';

const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <LineWave
                visible={true}
                height="100"
                width="100"
                color="#4fa94d"
                ariaLabel="line-wave-loading"
                firstLineColor="green"
                middleLineColor="sky"
                lastLineColor="red"
            />
        </div>
    );
};

export default Loading;
