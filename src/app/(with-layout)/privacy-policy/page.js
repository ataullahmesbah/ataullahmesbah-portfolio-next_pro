'use client';

import Head from 'next/head';

export default function PrivacyPolicyPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy Policy - Ataullah Mesbah",
    "description": "Learn how Ataullah Mesbah's website collects, uses, and protects your personal information. We value your privacy and ensure transparency with data practices.",
    "url": "https://ataullahmesbah.com/privacy-policy",
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
    "lastReviewed": "2025-04-16"
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Head>
        <title>Privacy Policy - Ataullah Mesbah</title>
        <meta
          name="description"
          content="Learn how Ataullah Mesbah's website collects, uses, and protects your personal information. We value your privacy and ensure transparency with data practices."
        />
        <meta
          name="keywords"
          content="privacy policy, Ataullah Mesbah, data protection, user rights, personal information, website privacy"
        />
        <meta name="author" content="Ataullah Mesbah" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ataullahmesbah.com/privacy-policy" />
        {/* Open Graph */}
        <meta property="og:title" content="Privacy Policy - Ataullah Mesbah" />
        <meta
          property="og:description"
          content="Understand how Ataullah Mesbah collects, uses, and protects your personal information."
        />
        <meta property="og:url" content="https://ataullahmesbah.com/privacy-policy" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ataullah Mesbah" />
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy - Ataullah Mesbah" />
        <meta
          name="twitter:description"
          content="Learn about Ataullah Mesbah's privacy practices and data protection policies."
        />
        {/* JSON-LD Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Head>

      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <header className="text-center mb-12" aria-labelledby="privacy-title">
            <h1 id="privacy-title" className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Privacy Policy
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4 rounded"></div>
            <p className="text-sm text-gray-400">Last Updated: April 16, 2025</p>
          </header>

          {/* Introduction */}
          <p className="text-lg text-gray-200 leading-relaxed">
            Welcome to <strong>Ataullah Mesbah</strong>. This Privacy Policy explains how we collect, use, and protect your personal information when you interact with our website or services. Your privacy is our priority, and we are committed to transparency in our data practices.
          </p>

          {/* Policy Sections */}
          <div className="space-y-10">
            {/* Data Collection */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">1. What We Collect</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li><span className="font-medium text-gray-200">Forms:</span> Name, email, phone number.</li>
                <li><span className="font-medium text-gray-200">Accounts:</span> Email, hashed password, profile image.</li>
                <li><span className="font-medium text-gray-200">Newsletter:</span> Email, optional name.</li>
                <li><span className="font-medium text-gray-200">Analytics:</span> Facebook Pixel (planned for future use).</li>
                <li><span className="font-medium text-gray-200">Services Used:</span> Firebase, NextAuth, Mailchimp, Brevo, Cloudinary, and others.</li>
              </ul>
            </article>

            {/* Usage of Data */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li>Respond to contact requests and inquiries.</li>
                <li>Support user login and profile management.</li>
                <li>Send opt-in newsletter updates.</li>
                <li>Enhance content and user experience.</li>
              </ul>
            </article>

            {/* Data Protection */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Data Protection</h2>
              <p className="text-gray-200 leading-relaxed">
                We implement robust security measures to safeguard your data. Passwords are securely hashed, and we never sell or share your information without your consent.
              </p>
            </article>

            {/* User Rights */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Your Rights</h2>
              <p className="text-gray-200 mb-4">
                You can contact us at{' '}
                <a
                  href="mailto:info@ataullahmesbah.com"
                  className="text-blue-400 hover:underline"
                  aria-label="Email customer support"
                >
                  info@ataullahmesbah.com
                </a>{' '}
                to:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li>Access or update your personal data.</li>
                <li>Request account deletion.</li>
                <li>Unsubscribe from communications.</li>
              </ul>
            </article>

            {/* Children’s Privacy */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Children’s Privacy</h2>
              <p className="text-gray-200 leading-relaxed">
                We do not knowingly collect data from users under 13. If such data is identified, we will promptly delete it.
              </p>
            </article>

            {/* Policy Updates */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Policy Updates</h2>
              <p className="text-gray-200 leading-relaxed">
                We may revise this Privacy Policy periodically. Updates will be posted here with a new revision date.
              </p>
            </article>
          </div>

          {/* Footer Note */}
          <footer className="pt-8 border-t border-gray-700 mt-12">
            <p className="text-sm italic text-gray-400 text-center">
              Note: For any privacy-related concerns, please reach out to us at{' '}
              <a
                href="mailto:info@ataullahmesbah.com"
                className="text-blue-400 hover:underline"
                aria-label="Email customer support"
              >
                info@ataullahmesbah.com
              </a>.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
}