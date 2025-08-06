'use client';

import MesbahCustomLoader from "@/app/components/MesbahCustomLoader/MesbahCustomLoader";




const Page = () => {
  return (
    <div className="min-h-screen bg-green-700">
      <MesbahCustomLoader/>

      {/* Your page content will automatically appear after loader finishes */}
      <div className="text-white text-center p-8">
        <h1 className="text-4xl font-bold">Welcome to ATAULLAH MESBAH</h1>
        <p className="mt-4">Page content loaded successfully!</p>
      </div>
    </div>
  );
};

export default Page;