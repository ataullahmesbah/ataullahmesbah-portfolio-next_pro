import Loader from '@/app/components/Loader/Loader';
import React from 'react';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className='text-2xl font-bold text-gray-800 mb-8'>Hello World !!!!</h1>
      <Loader />
    </div>
  );
};

export default page;