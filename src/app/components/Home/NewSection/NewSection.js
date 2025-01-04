import { FaGlobeAmericas, FaUsers, FaCheckCircle, FaUserFriends } from 'react-icons/fa';
import DynamicButton from '../../Share/Button/DynamicButton/DynamicButton';

const NewSection = () => {
    return (
        <div className="bg-gray-800 text-white py-10">
            <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 space-y-12 gap-8 lg:space-y-0 p-4">



                {/* Left Side: Statistics with Icons and Hover Effects */}
                <div className="text-left space-y-6 lg:w-1/2 px-4">
                    <h2 className="text-4xl font-bold">Our Achievements</h2>
                    <p className="text-lg text-gray-400 italic">
                    Empowering businesses to reach new heights with unparalleled dedication,
                        innovative solutions, and a proven track record of success.
                    </p>
                    <div className="grid grid-cols-2 gap-8 mt-8">
                        {/* First Column */}
                        <div className="bg-gray-900 flex flex-col items-center p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out space-y-4">
                            <FaGlobeAmericas className="text-4xl text-gray-500" />
                            <h3 className="text-4xl font-bold">23+</h3>
                            <p className="text-lg text-gray-400">Countries</p>
                        </div>
                        <div className="bg-gray-900 flex flex-col items-center p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out space-y-4">
                            <FaUsers className="text-4xl text-gray-500" />
                            <h3 className="text-4xl font-bold">41+</h3>
                            <p className="text-lg text-gray-400">Clients</p>
                        </div>

                        {/* Second Column */}
                        <div className="bg-gray-900 flex flex-col items-center p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out space-y-4">
                            <FaCheckCircle className="text-4xl text-gray-500" />
                            <h3 className="text-4xl font-bold">65+</h3>
                            <p className="text-lg text-gray-400">Projects Completed</p>
                        </div>
                        <div className="bg-gray-900 flex flex-col items-center p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out space-y-4">
                            <FaUserFriends className="text-4xl text-gray-500" />
                            <h3 className="text-4xl font-bold">9+</h3>
                            <p className="text-lg text-gray-400">Team Members</p>
                        </div>
                    </div>
                </div>






                {/* Right Side: Project Descriptions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:w-1/2">

                    {/* Card 1: SEO Expert Projects */}
                    <div className="relative bg-gray-800 rounded-lg overflow-hidden p-6 border border-purple-700 hover:border-indigo-600 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-black opacity-75"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">SEO Expert Projects Optimize</h3>
                            <p className="text-gray-300 mb-6">
                                Offering top-tier SEO consultancy and services that help businesses rank higher and generate organic traffic through targeted strategies.
                            </p>
                            <div className='pb-0 '>
                                
                                <DynamicButton text="View More" alignment="left" />
                            </div>

                        </div>
                    </div>

                    {/* Card 2: Web Development Projects */}
                    <div className="relative bg-gray-800 rounded-lg overflow-hidden p-6 border border-purple-700 hover:border-indigo-600 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-black opacity-75"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Web Development Projects</h3>
                            <p className="text-gray-300 mb-6">
                                Delivering modern and scalable web development solutions, specializing in custom websites and full-stack development for diverse industries.
                            </p>
                            <DynamicButton text="View More" alignment="left" />
                        </div>
                    </div>

                    {/* Card 3: Content Creation Projects */}
                    <div className="relative bg-gray-800 rounded-lg overflow-hidden p-6 border border-purple-700 hover:border-indigo-600 transition-all duration-300 lg:col-span-2">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-black opacity-75"></div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">Content Creation Projects</h3>
                            <p className="text-gray-300 mb-6">
                                Crafting engaging and compelling content that aligns with brand strategy, driving user engagement, and promoting business growth.
                            </p>
                            <DynamicButton text="View More" alignment="left" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewSection;
