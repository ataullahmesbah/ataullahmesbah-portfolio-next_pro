import Sponser from "@/app/components/Sponser/Sponser";
import AboutIntro from "@/app/components/Share/AboutBanner/AboutBanner";
import SEU from '/public/images/SEU.jpg';
import Testimonials from "@/app/components/Share/Testimonials/Testimonials";
import Link from "next/link";
import { FaArrowAltCircleRight } from "react-icons/fa";
import Image from "next/image";
import AboutBanner from "@/app/components/Share/AboutBanner/AboutBanner";

export const metadata = {
    title: "About Ataullah Mesbah | SEO Expert & Web Developer",
    description: "Learn about Ataullah Mesbah - SEO specialist and web developer with 6+ years experience. Expert in React, Next.js and digital marketing strategies.",
    openGraph: {
        title: "About Ataullah Mesbah | SEO Expert & Web Developer",
        description: "Professional profile of Ataullah Mesbah - SEO specialist and web developer",
        url: "https://yourdomain.com/about",
        type: "profile",
    },
};

const page = () => {
    return (
        <main className="bg-gray-900 text-gray-100 min-h-screen border-b border-b-gray-800">
            {/* Structured Data for SEO */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": "Ataullah Mesbah",
                    "jobTitle": "SEO Expert & Web Developer",
                    "description": "6+ years experience in SEO and web development with React/Next.js",
                    "url": "https://yourdomain.com/about",
                    "sameAs": [
                        "https://linkedin.com/in/ataullah-mesbah",
                        "https://twitter.com/ataullah_mesbah"
                    ]
                })}
            </script>

            {/* Text-Only Hero Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-800 to-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Ataullah Mesbah
                    </h1>
                    <h2 className="text-xl md:text-2xl text-sky-400 mb-6">
                        SEO Expert | Web Developer | Digital Strategist
                    </h2>
                    <p className="text-lg md:text-xl max-w-3xl mx-auto">
                        Helping businesses grow their online presence through technical SEO
                        and high-performance web development since 2020.
                    </p>
                </div>
            </section>

            <AboutBanner />

            {/* Sponsor Section */}
            <Sponser />

            {/* About Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
                {/* Profile Section */}
                <section className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="border-l-4 border-sky-400 pl-4 mb-6">
                            <h2 className="text-3xl font-bold">Who is Ataullah Mesbah?</h2>
                        </div>

                        <div className="space-y-4 text-gray-300">
                            <p>
                                With over <strong>6 years of experience</strong>, I'm an SEO expert and full-stack developer who has delivered <strong>100+ successful projects</strong> across e-commerce, SaaS, and content platforms.
                            </p>
                            <p>
                                My approach combines <strong>data-driven SEO strategies</strong> with <strong>cutting-edge web development</strong> to create digital experiences that rank well and convert visitors.
                            </p>
                            <p>
                                When not optimizing websites or coding, you'll find me exploring historic sites or analyzing football strategies - both passions that inform my professional work with unique perspectives.
                            </p>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border-2 border-gray-700">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah professional portrait"
                                fill
                                className="object-cover"
                                placeholder="blur"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </section>

                {/* SEO Expertise Section */}
                <section className="grid md:grid-cols-2 gap-12 items-center border-t border-gray-800 pt-12">
                    <div className="flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border-2 border-gray-700">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah working on SEO analysis"
                                fill
                                className="object-cover"
                                placeholder="blur"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="border-l-4 border-sky-400 pl-4 mb-6">
                            <h2 className="text-3xl font-bold">SEO Expertise</h2>
                        </div>

                        <div className="space-y-4 text-gray-300">
                            <p>
                                Since 2020, I've specialized in <strong>technical SEO audits</strong>, <strong>content strategy</strong>, and <strong>organic growth hacking</strong>. Certified in Ahrefs, SEMrush, and Google Analytics.
                            </p>
                            <p>
                                My methodology focuses on <strong>sustainable ranking improvements</strong> through comprehensive keyword research, competitor analysis, and on-page optimization.
                            </p>
                            <p>
                                Recent projects have achieved <strong>300%+ organic traffic growth</strong> within 6 months through white-hat techniques and AI-enhanced content strategies.
                            </p>
                        </div>

                        <Link
                            href="/seo"
                            className="inline-flex items-center mt-6 text-sky-400 hover:text-sky-300 transition-colors"
                            aria-label="Learn more about SEO services"
                        >
                            <span>Explore SEO Services</span>
                            <FaArrowAltCircleRight className="ml-2" />
                        </Link>
                    </div>
                </section>

                {/* Web Development Section */}
                <section className="grid md:grid-cols-2 gap-12 items-center border-t border-gray-800 pt-12">
                    <div>
                        <div className="border-l-4 border-sky-400 pl-4 mb-6">
                            <h2 className="text-3xl font-bold">Web Development</h2>
                        </div>

                        <div className="space-y-4 text-gray-300">
                            <p>
                                Specializing in <strong>React</strong>, <strong>Next.js</strong>, and the <strong>MERN stack</strong>, I build fast, scalable web applications with SEO built-in from the ground up.
                            </p>
                            <p>
                                My development process emphasizes <strong>performance optimization</strong>, <strong>accessible UI/UX</strong>, and <strong>future-proof architecture</strong>.
                            </p>
                            <p>
                                Recent projects include e-commerce platforms with <strong>30% faster load times</strong> than industry averages and custom CMS solutions for content-heavy sites.
                            </p>
                        </div>

                        <Link
                            href="/web-development"
                            className="inline-flex items-center mt-6 text-sky-400 hover:text-sky-300 transition-colors"
                            aria-label="Learn more about web development services"
                        >
                            <span>View Development Portfolio</span>
                            <FaArrowAltCircleRight className="ml-2" />
                        </Link>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-lg overflow-hidden border-2 border-gray-700">
                            <Image
                                src={SEU}
                                alt="Ataullah Mesbah coding on laptop"
                                fill
                                className="object-cover"
                                placeholder="blur"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </section>
            </div>

            {/* Testimonials Section */}
            <Testimonials />
        </main>
    );
};

export default page;