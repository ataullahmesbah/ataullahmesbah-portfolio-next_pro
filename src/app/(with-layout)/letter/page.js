import { FaClinicMedical, FaMailchimp } from "react-icons/fa";
import letter1 from '/public/images/letter/letter1.png';
import Image from "next/image";
import DynamicButton from "@/app/components/Share/Button/DynamicButton/DynamicButton";

{/* This is my newsletter platform */ }

const NewsLetter = () => {
    return (
        <div className="min-h-screen border-b border-b-gray-700"
            style={{
                background: 'linear-gradient(to right, #111827, #111827 20%, #0f172a 70%, #111111 100%)',
            }}>

            {/* Banner Section */}
            <div className='py-16 border-b border-b-gray-700'>
                <div className="max-w-7xl mx-auto rounded-lg p-6 lg:p-12 space-y-6 poppins-regular">
                    {/* Breadcrumb Links */}
                    <div className=" mb-4  justify-center text-center space-y-4 text-white">
                        {/* Add Next.js Links for Home and Contact */}
                        <h2 className="text-3xl lg:text-5xl font-bold ">
                            History
                        </h2>
                        <h2 className="text-3xl lg:text-5xl font-bold ">
                            Delivered By Post
                        </h2>

                        <div className="flex gap-3  justify-center items-center">
                            <FaMailchimp />
                            <p>1500+ Happy Readers</p>
                        </div>

                        {/* Get Started button */}
                        <div className="py-5 ">
                            <div className="grid gap-8 justify-center items-start ">
                                <div className="relative group">

                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>


                                    <button className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 justify-center text-center">

                                        <a href='/' className="pl-6 text-indigo-400 group-hover:text-gray-100 transition font-semibold duration-200 text-xl">Join For Just $5</a>
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>


                </div>
            </div>


            {/* section - 2 */}

            <div className="max-w-5xl text-xl mx-auto flex flex-row justify-between items-center poppins-regular space-x-10 py-16">

                {/* left side info */}
                <div className="space-y-6 ">
                    <h6 className="text-gray-300  text-2xl  text-center amsfonts">The Magic of</h6>
                    <p className=" text-5xl font-extrabold text-gray-400 text-center">History & Letters</p>
                    <p className="font-thin text-xl text-gray-300">We bring back the charm of a physical letter, delivered to you via post every month.</p>
                    <p className="font-thin text-xl text-gray-300">Each letter contains Irish history, designed and written for children. </p>




                </div>

                {/* right side images */}
                <div className="flex gap-4">
                    <Image
                        src={letter1}
                        width={280}
                        height={400}
                        className=""
                    />
                    <Image
                        src={letter1}
                        width={280}
                        height={400}
                        className=""
                    />


                </div>
            </div>


            {/* section - 3 */}
            <div className="max-w-3xl mx-auto text-center justify-center py-12 space-y-10">
                <p className="text-left text-gray-200 font-thin text-xl">
                    Each month, open your mailbox to find an envelope filled with a vibrantly illustrated letter, addressed to your kid – with a history of a piece of Ireland.

                </p>
                <p className="text-left text-gray-200 font-thin text-xl">
                    Each month, open your mailbox to find an envelope filled with a vibrantly illustrated letter, addressed to your kid – with a history of a piece of Ireland.

                    Learn about Irish heritage, culture, different places & more….. all from the comfort of your home, using a letter.
                </p>

                <DynamicButton text="Join For Just $5" alignment="center" className="text-xl font-semibold" />


            </div>






        </div>
    );
};

export default NewsLetter;