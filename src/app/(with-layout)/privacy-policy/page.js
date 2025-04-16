'use client';

import Head from 'next/head';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white py-14 px-4">
            <Head>
                <title>Privacy Policy | Ataullah Mesbah</title>
                <meta
                    name="description"
                    content="Learn how Ataullah Mesbah's website collects, uses, and protects your personal information. We value your privacy and ensure transparency with data practices."
                />
                <meta name="robots" content="index, follow" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'WebPage',
                            name: 'Privacy Policy',
                            url: 'https://www.ataullahmesbah.com/privacy-policy',
                            description:
                                'Privacy policy describing how user data is collected, stored, and protected on Ataullah Mesbah’s website.',
                            publisher: {
                                '@type': 'Person',
                                name: 'Ataullah Mesbah',
                                url: 'https://www.ataullahmesbah.com',
                            },
                        }),
                    }}
                />
            </Head>

            <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-2xl shadow-md p-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                        <p className="text-gray-400 text-sm">
                            Learn how we handle and protect your personal data at ataullahmesbah.com
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 md:mt-0">Last updated: April 16, 2025</p>
                </div>

                {/* Sections */}
                <div className="space-y-10 text-gray-300 text-[15px] leading-relaxed">
                    {/* Introduction */}
                    <section>
                        <p>
                            Welcome to ataullahmesbah.com. This Privacy Policy outlines how we collect,
                            use, and safeguard your information when you interact with our website or services.
                        </p>
                    </section>

                    {/* Data Collection */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. What We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Forms:</strong> Name, email, phone number.</li>
                            <li><strong>Accounts:</strong> Email, hashed password, profile image.</li>
                            <li><strong>Newsletter:</strong> Email, optional name.</li>
                            <li><strong>Analytics:</strong> Facebook Pixel (in future).</li>
                            <li><strong>Services Used:</strong> Firebase, NextAuth, Mailchimp, Brevo, Cloudinary, etc.</li>
                        </ul>
                    </section>

                    {/* Usage of Data */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Info</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Respond to contact requests.</li>
                            <li>Support user login and profile features.</li>
                            <li>Send newsletter updates (opt-in only).</li>
                            <li>Improve content and user experience.</li>
                        </ul>
                    </section>

                    {/* Protection */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Data Protection</h2>
                        <p>
                            We use strong security practices to protect your data. Passwords are securely hashed.
                            Data is never sold or exposed without user consent.
                        </p>
                    </section>

                    {/* User Rights */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Your Rights</h2>
                        <p>Contact us at <a href="mailto:info@ataullahmesbah.com" className="text-sky-400 underline">info@ataullahmesbah.com</a> to:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-2">
                            <li>Access or update your data</li>
                            <li>Delete your account</li>
                            <li>Unsubscribe from communications</li>
                        </ul>
                    </section>

                    {/* Kids Section */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Children’s Privacy</h2>
                        <p>
                            We don’t knowingly collect data from users under 13. If we become aware of such
                            data, we will take steps to delete it.
                        </p>
                    </section>

                    {/* Policy Changes */}
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">6. Updates</h2>
                        <p>
                            We may update this Privacy Policy occasionally. All updates will be posted on
                            this page with a new revision date.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
