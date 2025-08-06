'use client';

import MesbahCustomLoader from "@/app/components/MesbahCustomLoader/MesbahCustomLoader";
import Link from "next/link";




const Page = () => {
  return (
    <main
      className="min-h-screen relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
      }}
    >
      <MesbahCustomLoader />

      {/* Your page content will automatically appear after loader finishes */}

      {/* Banner-like Section */}
      <section className="w-full max-w-[90vw] sm:max-w-[28rem] md:max-w-[32rem] lg:max-w-[36rem] text-center py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Test Page Banner
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6">
          This is a simple banner section to test the MesbahCustomLoader.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-200 transition"
        >
          Back to Home
        </Link>
      </section>

      {/* Text Section */}
      <section className="w-full max-w-[90vw] sm:max-w-[28rem] md:max-w-[32rem] lg:max-w-[36rem] text-center py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
          Testing Content
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-400">
          This section contains sample text to verify the loader’s behavior. The loader should display for ~3.5 seconds, showing the full animation (letters, progress bar, semi-circle, and upward slide) before this page appears.
        </p>
      </section>


    </main>
  );
};

export default Page;