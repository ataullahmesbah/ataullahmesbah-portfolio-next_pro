'use client';
import React from 'react';
import Head from 'next/head';

const TermsAndConditions = () => {
    return (
        <>
            <Head>
                <title>Terms and Conditions | Ataullah Mesbah</title>
                <meta name="description" content="Official Terms and Conditions for using Ataullah Mesbah’s website and services. Learn your rights, responsibilities, and limitations." />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="Ataullah Mesbah" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="canonical" href="https://ataullahmesbah.com/terms-of-service" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebPage",
                            "name": "Terms and Conditions",
                            "url": "https://ataullahmesbah.com/terms-of-service",
                            "description": "Official Terms and Conditions for using Ataullah Mesbah’s website and services. Learn your rights, responsibilities, and limitations.",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Team Ataullah Mesbah"
                            }
                        }),
                    }}
                />
            </Head>
            <div className="bg-gradient-to-br from-gray-900 via-gray-700 to-gray-600">
                <div className="max-w-5xl mx-auto px-4 py-16 text-sm leading-relaxed text-white  rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold mb-6 text-center text-white">Terms and Conditions</h1>

                    <p className="mb-4">
                        Welcome to <strong>Ataullah Mesbah</strong>. By accessing or using this website, we assume that you fully accept and agree to all the Terms and Conditions mentioned here. The terms <strong>&quot;we&quot;</strong>, <strong>&quot;our&quot;</strong>, or <strong>&quot;us&quot;</strong> refer to the authority of <strong>Team Ataullah Mesbah</strong>.
                    </p>

                    <p className="mb-4">
                        If you do not understand any part of these Terms and Conditions, you may contact us via email or <a
                            href="https://facebook.com/ataullahmesbah10"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-600"
                        >
                            contact FB Team Ataullah Mesbah
                        </a>. The decisions and interpretations of Team Ataullah Mesbah regarding these Terms and Conditions are final, and we reserve the right to update or modify them at any time without prior notice.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2">1. Intellectual Property</h2>
                    <p className="mb-4">
                        All content including texts, images, videos, logos, and design elements available on this website are the intellectual property of Team Ataullah Mesbah unless otherwise stated. You may not copy, distribute, resell, or use any content without explicit written permission.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2">2. Restrictions & Prohibited Activities</h2>
                    <ul className="list-disc list-inside mb-4 space-y-2">
                        <li>Publishing, selling, or sharing any content (text, video, password-protected material) from this website for money or for free.</li>
                        <li>Sharing any email account, login credentials, or passwords with any third party.</li>
                        <li>Engaging in any data scraping, reverse engineering, or illegal use of website data.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-8 mb-2">3. Legal Action on Sensitive Data Misuse</h2>
                    <p className="mb-2">Violators may face:</p>
                    <ul className="list-disc list-inside mb-4 ml-4">
                        <li>Minimum of 5 years to a maximum of 14 years imprisonment.</li>
                        <li>A fine ranging from 5 lakh to 50 lakh BDT.</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-8 mb-2">4. Account Credentials & Termination</h2>
                    <p className="mb-4">
                        Your login credentials (username and password) are strictly personal. Sharing your credentials with others is strictly prohibited. If such sharing is found, Team Ataullah Mesbah reserves the right to terminate your account without prior notice.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2">5. Liability Disclaimer</h2>
                    <p className="mb-4">
                        We make no guarantees that the information on the website is accurate, complete, or up-to-date. We are not liable for any damages arising from the use of this website.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2">6. Third-Party Links</h2>
                    <p className="mb-4">
                        Our site may include links to third-party websites or services. We do not control and are not responsible for the content or practices of these third-party websites.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2">7. Changes to the Terms</h2>
                    <p className="mb-4">
                        Team Ataullah Mesbah reserves full authority to modify, change, or update these Terms and Conditions at any time, without notice. Users are responsible for reviewing the Terms regularly.
                    </p>

                    <h2 className="text-xl font-semibold mt-8 mb-2">8. Contact</h2>
                    <p className="mb-2">If you have any questions or concerns regarding these Terms and Conditions, please reach out via:</p>
                    <ul className="list-disc list-inside mb-4 ml-4">
                        <li>Email: info@ataullahmesbah.com</li>
                        <li>
                            <a
                                href="https://facebook.com/ataullahmesbah10"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline hover:text-blue-600"
                            >
                                Contact FB Team Ataullah Mesbah
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    );
};

export default TermsAndConditions;
