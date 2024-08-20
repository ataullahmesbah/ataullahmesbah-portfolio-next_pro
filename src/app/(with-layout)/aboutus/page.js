import Image from "next/image";
import Head from "next/head";

const Page = () => {
    return (
        <>
            <Head>
                <title>About | Ataullah Mesbah</title>
                <meta name="description" content="Connect with Ataullah Mesbah, an SEO expert and experienced traveler. Book a call to learn more about SEO and digital marketing strategies." />
            </Head>

            <div className="bg-sky-900 bg-gradient-to-br from-sky-700 via-sky-800 to-sky-950 items-center">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-5 p-6 text-white">
                    
                    {/* Left Side */}
                    <div className="text-center lg:text-left space-y-4">
                        <h1 className="text-3xl lg:text-5xl font-bold">
                            Hi
                        </h1>
                        <h4 className="  lg:text-3xl uppercase">
                            This is Ataullah Mesbah
                        </h4>
                        <p className="text-lg lg:text-2xl">SEO Expert & Root Level Traveler</p>
                        <button className="bg-white text-sky-800 px-4 py-2 rounded-lg hover:bg-sky-100 transition">
                            BOOK A CALL
                        </button>
                    </div>

                    {/* Right Side */}
                    <div className='lg:w-1/2 flex justify-center lg:justify-end'>
                        <div>
                            <Image
                                src='https://i.ibb.co/gR2V4cn/image.jpg'
                                alt="Ataullah Mesbah"
                                width={500}
                                height={500}
                                objectFit="cover"
                                className="rounded-full w-80 h-80 lg:w-96 lg:h-96"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;
