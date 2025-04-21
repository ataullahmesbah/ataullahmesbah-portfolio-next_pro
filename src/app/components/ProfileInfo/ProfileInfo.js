"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCode, FiLayers, FiBarChart2, FiVideo, FiPenTool, FiGlobe } from 'react-icons/fi';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { FaLinkedin, FaTwitter, FaGithub, FaDribbble, FaBehance } from 'react-icons/fa';
import UiLoader from '../Loader/UiLoader/UiLoader';
import Image from 'next/image';
import Link from 'next/link';

const RoleIcons = {
    developer: <FiCode className="text-blue-500" />,
    designer: <FiPenTool className="text-pink-500" />,
    marketing: <FiBarChart2 className="text-green-500" />,
    'seo specialist': <FiGlobe className="text-purple-500" />,
    'video editor': <FiVideo className="text-red-500" />,
    default: <FiLayers className="text-gray-500" />
};

const ExpertBadges = {
    developer: 'Verified Expert in Engineering',
    designer: 'Verified Expert in Design',
    marketing: 'Verified Expert in Marketing',
    'seo specialist': 'Verified SEO Expert',
    'video editor': 'Verified Video Expert',
    default: 'Verified Professional'
};

export default function ProfileInfo() {
    const { data: session, status } = useSession();
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('experience');
    const router = useRouter();

    // Fetch profile data
    const fetchProfile = async () => {
        if (status === 'authenticated' && session?.user?.id) {
            try {
                console.log('Fetching profile for user:', session.user.id);
                const response = await fetch(`/api/profile/${session.user.id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Profile data:', data);

                if (data) {
                    setProfile(data.profile || {});
                    setUser(data.user || {});
                } else {
                    console.error('No data received');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Handle error state if needed
            }
        }
    };

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }

        if (status === 'authenticated') {
            fetchProfile();
        }
    }, [status, session]);

    // Determine primary role and icons
    const getPrimaryRole = () => {
        if (!profile?.title) return 'default';
        const title = profile.title.toLowerCase();
        if (title.includes('developer')) return 'developer';
        if (title.includes('design')) return 'designer';
        if (title.includes('market')) return 'marketing';
        if (title.includes('seo')) return 'seo specialist';
        if (title.includes('video')) return 'video editor';
        return 'default';
    };

    const primaryRole = getPrimaryRole();
    const roleIcon = RoleIcons[primaryRole] || RoleIcons.default;
    const expertBadge = ExpertBadges[primaryRole] || ExpertBadges.default;

    // For multiple roles
    const getAdditionalRoles = () => {
        if (!profile?.title) return [];
        const roles = [];
        const title = profile.title.toLowerCase();
        if (title.includes('developer') && primaryRole !== 'developer') roles.push('developer');
        if (title.includes('design') && primaryRole !== 'designer') roles.push('designer');
        if (title.includes('market') && primaryRole !== 'marketing') roles.push('marketing');
        if (title.includes('seo') && primaryRole !== 'seo specialist') roles.push('seo specialist');
        if (title.includes('video') && primaryRole !== 'video editor') roles.push('video editor');
        return roles;
    };

    const additionalRoles = getAdditionalRoles();

    if (status === 'loading') return <UiLoader />;
    if (!user || status === 'unauthenticated') return <UiLoader />;

    // If profile is empty but user exists
    if (user && !profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-gray-700 mb-4">No profile data found</p>
                    <Link
                        href="/profile/update"
                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                        Create Your Profile
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Enhanced Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-gray-900 to-gray-800 text-white pb-24 pt-12"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Image with Badge */}
                        <div className="flex flex-col md:flex-row gap-8 items-start">
  {/* Profile Image with Motion */}
  <motion.div 
    className="relative group"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Image
      src={profile?.image || '/default-profile.png'}
      alt="Profile"
      width={160}
      height={160}
      className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
    />
    {profile?.verification === 'accepted' && (
      <motion.div
        className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <RiVerifiedBadgeFill size={24} className="text-white" />
      </motion.div>
    )}
  </motion.div>
</div>


                        {/* Profile Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-4xl font-bold">{profile?.displayName || 'Your Name'}</h1>
                            </div>

                            {/* Dynamic Title with Icon */}
                            <div className="flex items-center gap-3 mb-2">
                                {roleIcon}
                                <h2 className="text-2xl text-gray-300">{profile?.title || 'Professional Title'}</h2>
                            </div>

                            {/* Verified Expert Badge */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="inline-flex items-center gap-2 bg-gray-700 bg-opacity-50 px-4 py-1 rounded-full mb-3"
                            >
                                <RiVerifiedBadgeFill className="text-green-500" />
                                <span className="text-sm font-medium text-green-400">
                                    {expertBadge}
                                    {additionalRoles.length > 0 && ` + ${additionalRoles.length} more`}
                                </span>
                            </motion.div>

                            {/* Location and Member Since */}
                            <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{profile?.location || 'Location'}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>
                                        Member since {new Date(user.memberSince).toLocaleDateString('en-US', {
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* Social Links with Animation */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-4"
                            >
                                {profile?.socialLinks?.linkedin && (
                                    <SocialIcon href={profile.socialLinks.linkedin} icon={<FaLinkedin size={20} />} />
                                )}
                                {profile?.socialLinks?.twitter && (
                                    <SocialIcon href={profile.socialLinks.twitter} icon={<FaTwitter size={20} />} />
                                )}
                                {profile?.socialLinks?.github && (
                                    <SocialIcon href={profile.socialLinks.github} icon={<FaGithub size={20} />} />
                                )}
                                {profile?.socialLinks?.dribbble && (
                                    <SocialIcon href={profile.socialLinks.dribbble} icon={<FaDribbble size={20} />} />
                                )}
                                {profile?.socialLinks?.behance && (
                                    <SocialIcon href={profile.socialLinks.behance} icon={<FaBehance size={20} />} />
                                )}
                            </motion.div>
                        </div>

                        {/* Edit Profile Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href="/profile/update"
                                className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Profile
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-xl overflow-hidden"
                >
                    {/* Navigation Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <TabButton
                                active={activeTab === 'experience'}
                                onClick={() => setActiveTab('experience')}
                                icon={
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                                label="Experience"
                            />
                            <TabButton
                                active={activeTab === 'portfolio'}
                                onClick={() => setActiveTab('portfolio')}
                                icon={
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                }
                                label="Portfolio"
                            />
                            <TabButton
                                active={activeTab === 'skills'}
                                onClick={() => setActiveTab('skills')}
                                icon={
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                }
                                label="Skills"
                            />
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'experience' && (
                                <motion.div
                                    key="experience"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* About Section */}
                                    {profile?.bio && (
                                        <Section title="About Me">
                                            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                                        </Section>
                                    )}

                                    {/* Work Experience - Enhanced Design */}
                                    {profile?.workExperience?.length > 0 && (
                                        <Section title="Work Experience">
                                            <div className="space-y-8">
                                                {profile.workExperience.map((job, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        className="flex gap-6 group"
                                                    >
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-4 h-4 bg-purple-500 rounded-full mt-1 group-hover:scale-125 transition-transform"></div>
                                                            {index !== profile.workExperience.length - 1 && (
                                                                <div className="w-0.5 h-full bg-gray-200 group-hover:bg-purple-300 transition-colors"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 pb-8">
                                                            <h3 className="text-xl font-semibold text-gray-800">{job.companyName}</h3>
                                                            <p className="text-gray-600">{job.designation}</p>
                                                            <p className="text-gray-500 text-sm mt-1">
                                                                {new Date(job.startDate).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                })} - {job.endDate ? new Date(job.endDate).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                }) : 'Present'} • {calculateDuration(job.startDate, job.endDate)}
                                                            </p>
                                                            {job.roles?.length > 0 && (
                                                                <ul className="mt-4 space-y-3">
                                                                    {job.roles.map((role, i) => (
                                                                        <motion.li
                                                                            key={i}
                                                                            whileHover={{ x: 5 }}
                                                                            className="flex items-start"
                                                                        >
                                                                            <span className="text-purple-500 mr-2 mt-1">•</span>
                                                                            <span className="text-gray-600">{role}</span>
                                                                        </motion.li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </Section>
                                    )}

                                    {/* Education */}
                                    {profile?.education?.length > 0 && (
                                        <Section title="Education">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                {profile.education.map((edu, index) => (
                                                    <motion.div
                                                        key={index}
                                                        whileHover={{ y: -5 }}
                                                        className="bg-gray-50 p-5 rounded-lg border border-gray-200"
                                                    >
                                                        <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                                                        <p className="text-gray-600">{edu.instituteName}</p>
                                                        <p className="text-gray-500 text-sm mt-2">
                                                            {new Date(edu.startDate).toLocaleDateString('en-US', {
                                                                year: 'numeric'
                                                            })} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', {
                                                                year: 'numeric'
                                                            }) : 'Present'} • {edu.location}
                                                        </p>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </Section>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'portfolio' && (
                                <motion.div
                                    key="portfolio"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {profile?.portfolio?.length > 0 ? (
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {profile.portfolio.map((project, index) => (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                                                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-purple-200 transition-all"
                                                >
                                                    <div className="bg-gray-100 h-48 flex items-center justify-center">
                                                        <FiLayers className="text-gray-400 text-4xl" />
                                                    </div>
                                                    <div className="p-5">
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                                                        {project.sectors?.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {project.sectors.map((sector, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                                                    >
                                                                        {sector}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            icon={<FiLayers className="text-gray-400 text-4xl" />}
                                            title="No Portfolio Items"
                                            description="Add your projects to showcase your work"
                                        />
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'skills' && (
                                <motion.div
                                    key="skills"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Expertise */}
                                    {profile?.expertise?.length > 0 && (
                                        <Section title="Primary Expertise">
                                            <div className="flex flex-wrap gap-3">
                                                {profile.expertise.map((skill, index) => (
                                                    <motion.div
                                                        key={index}
                                                        whileHover={{ scale: 1.05 }}
                                                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium flex items-center gap-2"
                                                    >
                                                        {RoleIcons[skill.toLowerCase()] || RoleIcons.default}
                                                        {skill}
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </Section>
                                    )}

                                    {/* Skills - Single Column List */}
                                    {profile?.skills?.length > 0 && (
                                        <Section title="Technical Skills">
                                            <div className="space-y-6">
                                                {profile.skills.map((skill, index) => (
                                                    <div key={index}>
                                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">{skill.title}</h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {skill.skills.map((sk, i) => (
                                                                <motion.span
                                                                    key={i}
                                                                    whileHover={{ scale: 1.05 }}
                                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                                >
                                                                    {sk}
                                                                </motion.span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Section>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Helper Components
const SocialIcon = ({ href, icon }) => (
    <motion.a
        whileHover={{ y: -3 }}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-300 hover:text-white transition-colors"
    >
        {icon}
    </motion.a>
);

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex items-center py-4 px-6 text-sm font-medium ${active ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
    >
        {icon}
        {label}
    </button>
);

const Section = ({ title, children }) => (
    <div className="mb-12 last:mb-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        {children}
    </div>
);

const EmptyState = ({ icon, title, description }) => (
    <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-gray-500">{description}</p>
    </div>
);

// Helper function to calculate duration
function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
        return `${years} yr ${remainingMonths} mo`;
    } else if (years > 0) {
        return `${years} yr`;
    } else {
        return `${remainingMonths} mo`;
    }
}

// Keep your existing LoadingSpinner and LoadingState components