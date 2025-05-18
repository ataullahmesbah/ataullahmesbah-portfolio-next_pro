'use client';
import React from 'react';
import Head from 'next/head';

const TermsAndConditions = () => {
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Terms and Conditions - Ataullah Mesbah",
        "description": "Official Terms and Conditions for using Ataullah Mesbah’s website and services. Learn your rights, responsibilities, and limitations.",
        "url": "https://ataullahmesbah.com/terms-of-service",
        "publisher": {
            "@type": "Organization",
            "name": "Ataullah Mesbah",
            "url": "https://ataullahmesbah.com",
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@ataullahmesbah.com",
                "contactType": "Customer Support"
            }
        },
        "lastReviewed": "2025-05-18"
    };

    return (
        <>
            <Head>
                <title>Terms and Conditions - Ataullah Mesbah</title>
                <meta
                    name="description"
                    content="Official Terms and Conditions for using Ataullah Mesbah’s website and services. Learn your rights, responsibilities, and limitations."
                />
                <meta
                    name="keywords"
                    content="terms and conditions, Ataullah Mesbah, website usage, user responsibilities, intellectual property, refund policy"
                />
                <meta name="author" content="Ataullah Mesbah" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://ataullahmesbah.com/terms-of-service" />
                {/* Open Graph */}
                <meta property="og:title" content="Terms and Conditions - Ataullah Mesbah" />
                <meta
                    property="og:description"
                    content="Official Terms and Conditions for using Ataullah Mesbah’s website and services."
                />
                <meta property="og:url" content="https://ataullahmesbah.com/terms-of-service" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Ataullah Mesbah" />
                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Terms and Conditions - Ataullah Mesbah" />
                <meta
                    name="twitter:description"
                    content="Learn the Terms and Conditions for using Ataullah Mesbah’s website and services."
                />
                {/* JSON-LD Schema */}
                <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
            </Head>

            <div className="bg-gray-50 min-h-screen font-sans">
                <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-6 py-16 md:px-12 lg:px-24">
                    <div className="max-w-5xl mx-auto space-y-12">
                        {/* Header */}
                        <header className="text-center mb-12" aria-labelledby="terms-title">
                            <h1 id="terms-title" className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                                Terms and Conditions
                            </h1>
                            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4 rounded"></div>
                            <p className="text-sm text-gray-400">Last Updated: May 18, 2025</p>
                        </header>

                        {/* Introduction */}
                        <p className="text-lg text-gray-200 leading-relaxed">
                            Welcome to <strong>Ataullah Mesbah</strong>. By accessing or using our website, you agree to comply with these Terms and Conditions. The terms <strong>"we"</strong>, <strong>"our"</strong>, or <strong>"us"</strong> refer to <strong>Ataullah Mesbah</strong>. If you have questions, contact us via{' '}
                            <a
                                href="mailto:info@ataullahmesbah.com"
                                className="text-blue-400 hover:underline"
                                aria-label="Email customer support"
                            >
                                info@ataullahmesbah.com
                            </a>{' '}
                            or{' '}
                            <a
                                href="https://facebook.com/ataullahmesbah10"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                                aria-label="Contact via Facebook"
                            >
                                Facebook
                            </a>.
                        </p>

                        {/* Terms Sections */}
                        <div className="space-y-10">
                            {/* Intellectual Property */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">1. Intellectual Property</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    All content, including text, images, videos, logos, and design elements, is the intellectual property of Ataullah Mesbah unless otherwise stated. Unauthorized copying, distribution, or use is prohibited without written permission.
                                </p>
                            </article>

                            {/* Restrictions & Prohibited Activities */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">2. Restrictions & Prohibited Activities</h2>
                                <ul className="list-disc list-inside space-y-3 text-gray-300">
                                    <li>Publishing, selling, or sharing website content (text, video, or protected material) for profit or free.</li>
                                    <li>Sharing email accounts, login credentials, or passwords with third parties.</li>
                                    <li>Engaging in data scraping, reverse engineering, or illegal data use.</li>
                                </ul>
                            </article>

                            {/* Legal Action */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">3. Legal Action on Sensitive Data Misuse</h2>
                                <p className="text-gray-200 mb-4">Violators may face:</p>
                                <ul className="list-disc list-inside space-y-3 text-gray-300">
                                    <li>Imprisonment from 5 to 14 years.</li>
                                    <li>Fines from 5 lakh to 50 lakh BDT.</li>
                                </ul>
                            </article>

                            {/* Account Credentials */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">4. Account Credentials & Termination</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    Login credentials are personal and non-transferable. Sharing them is prohibited, and violations may result in account termination without notice.
                                </p>
                            </article>

                            {/* Liability Disclaimer */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">5. Liability Disclaimer</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    We do not guarantee the accuracy, completeness, or timeliness of website information. Ataullah Mesbah is not liable for damages arising from website use.
                                </p>
                            </article>

                            {/* Third-Party Links */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">6. Third-Party Links</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    Our website may link to third-party sites. We are not responsible for their content or practices.
                                </p>
                            </article>

                            {/* Changes to Terms */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">7. Changes to the Terms</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    We may update these Terms and Conditions at any time without notice. Users are responsible for reviewing them regularly.
                                </p>
                            </article>

                            {/* Order and Delivery Policy */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">8. Order and Delivery Policy</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    Orders are processed within 24–48 hours after confirmation and delivered within 3–7 working days via third-party couriers. Incorrect or unverifiable orders may be rejected.
                                </p>
                            </article>

                            {/* Personal Information */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">9. Personal Information for Orders</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    We collect email addresses and phone numbers for order processing, used solely for confirmation, updates, and delivery coordination. For details on how we handle and protect your data, please review our
                                    <a
                                        href="/privacy-policy"
                                        className="text-blue-400 underline hover:text-blue-600 ml-1"
                                    >
                                        Privacy Policy
                                    </a>.
                                </p>
                            </article>

                            {/* Payment Methods */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">10. Payment Methods</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    We accept Cash on Delivery (COD) and Online Payments. Orders are processed only after payment confirmation.
                                </p>
                            </article>

                            {/* Refund & Return Policy */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">11. Refund & Return Policy</h2>
                                <p className="text-gray-200 leading-relaxed">
                                    For order issues, refer to our{' '}
                                    <a
                                        href="/return-policy"
                                        className="text-blue-400 hover:underline"
                                        aria-label="View Refund Policy"
                                    >
                                        Refund and Return Policy
                                    </a>.
                                </p>
                            </article>

                            {/* Contact */}
                            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
                                <h2 className="text-2xl font-semibold text-white mb-4">12. Contact</h2>
                                <p className="text-gray-200 mb-4">For questions about these Terms, contact us:</p>
                                <ul className="list-disc list-inside space-y-3 text-gray-300">
                                    <li>
                                        <span className="font-medium text-gray-200">Email:</span>{' '}
                                        <a
                                            href="mailto:info@ataullahmesbah.com"
                                            className="text-blue-400 hover:underline"
                                            aria-label="Email customer support"
                                        >
                                            info@ataullahmesbah.com
                                        </a>
                                    </li>
                                    <li>
                                        <span className="font-medium text-gray-200">Facebook:</span>{' '}
                                        <a
                                            href="https://facebook.com/ataullahmesbah10"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                            aria-label="Contact via Facebook"
                                        >
                                            Team Ataullah Mesbah
                                        </a>
                                    </li>
                                </ul>
                            </article>
                        </div>

                        {/* Footer Note */}
                        <footer className="pt-8 border-t border-gray-700 mt-12">
                            <p className="text-sm italic text-gray-400 text-center">
                                Note: We reserve the right to interpret and enforce these Terms and Conditions as final.
                            </p>
                        </footer>
                    </div>
                </section>
            </div>
        </>
    );
};

export default TermsAndConditions;