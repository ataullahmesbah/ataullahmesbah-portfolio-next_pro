// app/about/page.jsx
import { Suspense } from 'react';
import Sponser from "@/app/components/Sponser/Sponser";
import Testimonials from "@/app/components/Share/Testimonials/Testimonials";
import Link from "next/link";
import { FaArrowAltCircleRight, FaGlobe, FaPenFancy, FaCode } from "react-icons/fa";
import Image from "next/image";
import SEU from '/public/images/SEU.jpg';
import AnimatedHero from "@/app/components/Animation/AnimatedHero/AnimatedHero";
import AnimatedCard from "@/app/components/Animation/AnimatedCard/AnimatedCard";
import Loading from '@/app/components/Share/SampleLoader/SamplerLoader';


export const metadata = {
    title: "About Ataullah Mesbah | Full Stack Developer & Digital Strategist",
    description: "Professional profile of Ataullah Mesbah - Full Stack Developer, SEO Specialist, and Digital Strategist with 6+ years of experience.",
    keywords: [
        "Full Stack Developer",
        "SEO Specialist",
        "Digital Strategist",
        "Next.js Developer",
        "Web Development",
        "SEO Expert Bangladesh"
    ],
    openGraph: {
        title: "About Ataullah Mesbah | Full Stack Developer & Digital Strategist",
        description: "Professional profile of Ataullah Mesbah with 6+ years of digital experience",
        url: "https://yourdomain.com/about",
        type: "profile",
        images: [
            {
                url: SEU.src,
                width: 800,
                height: 600,
                alt: "Ataullah Mesbah Professional Portrait",
            },
        ],
    },
};

const AboutPage = () => {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Ataullah Mesbah',
        jobTitle: 'Full Stack Developer & Digital Strategist',
        description: '6+ years experience in web development and digital marketing',
        url: 'https://yourdomain.com/about',
        sameAs: [
            'https://linkedin.com/in/ataullah-mesbah',
            'https://github.com/yourusername',
            'https://twitter.com/yourhandle'
        ],
        alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Southeast University',
            description: 'Bachelor of Science in Electrical and Electronic Engineering'
        },
        hasOccupation: {
            '@type': 'Occupation',
            name: 'Web Developer',
            description: 'Specializing in React, Next.js, and SEO optimization'
        }
    };

    return (
        <main className="bg-gray-900 text-gray-100 min-h-screen overflow-x-hidden border-b border-b-gray-800">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Use the animated hero component */}
            <AnimatedHero />

            {/* Sponsor Section */}
            <Sponser />

            {/* Multi-Dimensional Profile Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Profile Card - Enhanced Design */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 lg:p-10 border border-gray-700/50 shadow-lg hover:shadow-sky-500/10 transition-shadow duration-300">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            <div className="flex-shrink-0 mx-auto md:mx-0">
                                <div className="w-36 h-36 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-sky-400/20 relative">
                                    <Image
                                        src={SEU}
                                        alt="Ataullah Mesbah professional portrait"
                                        fill
                                        className="object-cover"
                                        placeholder="blur"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        priority
                                    />
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mb-1">Ataullah Mesbah</h1>
                                <p className="text-sky-400 text-sm md:text-base mb-4">Full Stack Developer & Digital Strategist</p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-5">
                                    <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs md:text-sm border border-gray-600">Full-Stack Developer</span>
                                    <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs md:text-sm border border-gray-600">SEO Specialist</span>
                                    <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs md:text-sm border border-gray-600">Travel Storyteller</span>
                                </div>

                                <div className="space-y-3 text-gray-300 text-sm md:text-base">
                                    <p>
                                        With 6+ years transforming digital landscapes, I combine systematic engineering thinking with cutting-edge web technologies to deliver measurable business results.
                                    </p>
                                    <p className="text-gray-400 italic">
                                        My electrical engineering foundation from Southeast University enhances my problem-solving approach in tech.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid - Modern Design */}
                    <div className="grid grid-cols-2 gap-4">
                        <AnimatedCard delay={0.1}>
                            <div className="text-3xl md:text-4xl font-bold text-sky-400">100+</div>
                            <div className="text-gray-300 text-xs md:text-sm">Global Projects</div>
                        </AnimatedCard>
                        <AnimatedCard delay={0.2}>
                            <div className="text-3xl md:text-4xl font-bold text-purple-400">15+</div>
                            <div className="text-gray-300 text-xs md:text-sm">Countries Served</div>
                        </AnimatedCard>
                        <AnimatedCard delay={0.3}>
                            <div className="text-3xl md:text-4xl font-bold text-amber-400">300%</div>
                            <div className="text-gray-300 text-xs md:text-sm">Avg. ROI</div>
                        </AnimatedCard>
                        <AnimatedCard delay={0.4}>
                            <div className="text-3xl md:text-4xl font-bold text-green-400">6+</div>
                            <div className="text-gray-300 text-xs md:text-sm">Years Experience</div>
                        </AnimatedCard>
                    </div>
                </div>
            </section>

            {/* Journey Sections */}
            <div id="journey" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
                {/* SEO Journey */}
                <section className="relative">
                    <div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-sky-400 to-purple-600 rounded-full hidden md:block"></div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <div className="p-4 bg-sky-900/30 rounded-xl inline-flex items-center justify-center mb-4">
                                <FaGlobe className="text-sky-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">SEO Mastery</h2>
                            <p className="text-gray-400">Since 2020</p>
                        </div>
                        <AnimatedCard delay={0.1}>
                            <h3 className="text-xl font-semibold mb-4 text-sky-300">Driving Organic Growth</h3>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    My SEO journey began with reverse-engineering ranking algorithms, evolving into a comprehensive approach combining technical optimization, content strategy, and data analytics.
                                </p>
                                <p>
                                    I’ve developed proprietary frameworks that deliver <span className="text-sky-300">300-500% organic traffic increases</span> within 6-12 months for clients across e-commerce, SaaS, and publishing.
                                </p>
                                <p>
                                    Featured in industry publications for innovative approaches to AI-assisted content optimization and voice search adaptation.
                                </p>
                            </div>
                        </AnimatedCard>
                    </div>
                </section>

                {/* Development Journey */}
                <section className="relative">
                    <div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-purple-400 to-amber-500 rounded-full hidden md:block"></div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <div className="p-4 bg-purple-900/30 rounded-xl inline-flex items-center justify-center mb-4">
                                <FaCode className="text-purple-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Web Development</h2>
                            <p className="text-gray-400">React & Next.js Specialist</p>
                        </div>
                        <AnimatedCard delay={0.2}>
                            <h3 className="text-xl font-semibold mb-4 text-purple-300">Building Digital Foundations</h3>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    Transitioned from WordPress to mastering the JavaScript ecosystem, now specializing in <span className="text-purple-300">performance-optimized React applications</span> with SEO baked into their architecture.
                                </p>
                                <p>
                                    My development philosophy emphasizes <span className="text-purple-300">clean code, accessibility, and maintainability</span>. Recent projects include e-commerce platforms with 95+ Lighthouse scores and headless CMS implementations.
                                </p>
                                <p>
                                    Contributor to open-source projects and creator of reusable component libraries that accelerate development workflows.
                                </p>
                            </div>
                        </AnimatedCard>
                    </div>
                </section>

                {/* Creative Journey */}
                <section className="relative">
                    <div className="absolute -left-8 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-green-500 rounded-full hidden md:block"></div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <div className="p-4 bg-amber-900/30 rounded-xl inline-flex items-center justify-center mb-4">
                                <FaPenFancy className="text-amber-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Content & Travel</h2>
                            <p className="text-gray-400">Storytelling Through Lenses</p>
                        </div>
                        <AnimatedCard delay={0.3}>
                            <h3 className="text-xl font-semibold mb-4 text-amber-300">Beyond Digital: My Creative Pursuits</h3>
                            <div className="space-y-4 text-gray-300">
                                <p>
                                    As an avid traveler, I’ve explored <span className="text-amber-300">15+ countries</span>, documenting architectural marvels and cultural narratives through photography and writing.
                                </p>
                                <p>
                                    My travel content reaches <span className="text-amber-300">50,000+ monthly readers</span>, blending destination guides with insights on digital nomadism and remote work strategies.
                                </p>
                                <p>
                                    This passion for storytelling directly informs my professional work - whether crafting compelling brand narratives or designing immersive web experiences.
                                </p>
                            </div>
                        </AnimatedCard>
                    </div>
                </section>
            </div>

            {/* Testimonials Section with Loading */}
            <Suspense fallback={<Loading />}>
                <Testimonials />
            </Suspense>

            {/* Final CTA */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to Elevate Your Digital Presence?</h2>
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                    Whether you need SEO expertise, a custom web solution, or content strategy - let’s create something remarkable.
                </p>
                <Link
                    href="/contact"
                    className="inline-block px-10 py-4 bg-gradient-to-r from-sky-500 to-purple-600 rounded-lg font-medium text-lg hover:shadow-lg transition-all hover:scale-105"
                    aria-label="Contact Ataullah Mesbah"
                >
                    Get in Touch
                </Link>
            </section>
        </main>
    );
};

export default AboutPage;

