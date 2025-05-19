'use client';
import Image from 'next/image';
import SEU from '/public/images/SEU.jpg';

const WhoIsMesbah = () => {
    return (
        <section className="py-16 bg-gray-900 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
                    {/* Content Section - Left Side */}
                    <div className="lg:w-1/2 space-y-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-sky-500"></div>
                                <span className="text-sm font-medium text-sky-400 tracking-wider uppercase">FROM Sirajpur TO THE WORLD</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white">
                                The Journey of Ataullah Mesbah
                            </h1>
                        </div>

                        <div className="space-y-5 text-gray-300 leading-relaxed">
                            <p>
                                Beginning in the rural village of <span className="text-purple-400 font-medium">Sirajpur, Bangladesh</span>,
                                Ataullah’s curiosity for technology sparked an extraordinary journey from local
                                classrooms to global digital landscapes.
                            </p>
                            <p>
                                His academic foundation at <span className="text-sky-400">Southeast University</span> propelled him into becoming
                                a <span className="text-purple-400 font-medium">Full Stack Developer</span> and <span className="text-purple-400 font-medium">SEO Specialist</span>,
                                crafting solutions for international clients while maintaining his roots in Bangladeshi culture.
                            </p>
                            <p>
                                This unique blend of rural beginnings and global tech experience informs his innovative
                                approach to digital problem-solving.
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                            {[
                                { value: "Sirajpur", label: "Roots", color: "text-purple-400" },
                                { value: "100+", label: "Projects", color: "text-sky-400" },
                                { value: "15+", label: "Countries", color: "text-purple-400" },
                                { value: "6+", label: "Years Exp", color: "text-sky-400" }
                            ].map((stat, index) => (
                                <div key={index} className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-center">
                                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Section - Right Side */}
                    <div className="lg:w-1/2 mt-10 lg:mt-0">
                        <div className="relative rounded-lg overflow-hidden aspect-square max-w-md mx-auto">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah at Southeast University"
                                fill
                                placeholder="blur"
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4">
                                <span className="inline-block px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full text-sm text-white border border-gray-700">
                                    From Classroom to Global Tech
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhoIsMesbah;