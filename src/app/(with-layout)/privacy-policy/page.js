export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-10 text-sm text-gray-800 space-y-8">
            <h1 className="text-3xl font-bold text-center">Privacy Policy</h1>
            <p className="text-center text-gray-500">Last Updated: April 16, 2025</p>

            <section>
                <h2 className="text-xl font-semibold mb-2">Welcome to ataullahmesbah.com</h2>
                <p>
                    This website, operated by Ataullah Mesbah, offers services and content related to web development, SEO, personal brand storytelling, travel stories, blogs, feature projects, and more. We are committed to protecting your privacy and ensuring transparency about how your data is used, stored, and shared.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Contact Form Data: Name, email address, and phone number</li>
                    <li>Authentication Data: Email and encrypted password via NextAuth & Firebase</li>
                    <li>Profile Information: Optional profile image and updates</li>
                    <li>Newsletter Subscriptions: Name (optional) and email address</li>
                    <li>User Interaction Logs: Pages visited, content viewed, device/browser info</li>
                    <li>Service Usage Logs: Login activity and service access logs</li>
                    <li>Embedded Content: YouTube, Facebook posts/videos</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">2. How We Use This Data</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Provide services like account access and personalization</li>
                    <li>Respond to inquiries via contact forms</li>
                    <li>Send newsletters and marketing content</li>
                    <li>Analyze website performance and engagement</li>
                    <li>Display embedded media and enhance UX</li>
                    <li>Secure user authentication and session management</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">3. Third-Party Services We Use</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Google Analytics (analytics)</li>
                    <li>Facebook Pixel (marketing/retargeting)</li>
                    <li>Cloudinary (image hosting/CDN)</li>
                    <li>YouTube & Facebook (embedded content)</li>
                    <li>NextAuth & Firebase (authentication/login)</li>
                    <li>Brevo.com (newsletter/email)</li>
                    <li>Mailchimp Forms (contact form processing)</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">4. Cookies & Tracking</h2>
                <p>Cookies help us maintain secure sessions, monitor analytics, personalize experiences, and deliver relevant marketing. You may disable cookies in your browser settings.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">5. Data Security & Storage</h2>
                <p>User passwords are encrypted and handled securely with NextAuth and Firebase. We never store passwords in plain text, and we follow best practices to protect your data.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">6. User Rights</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Request access, edit, or delete your data</li>
                    <li>Unsubscribe from email/newsletter communications anytime</li>
                    <li>Contact us directly for any privacy concerns</li>
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">7. Children’s Privacy</h2>
                <p>This website is not intended for children under 13. We do not knowingly collect data from minors. If any such data is identified, we will delete it immediately.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
                <p>This policy may be updated as needed. Any changes will be noted by the "Last Updated" date and communicated via the website or email where appropriate.</p>
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
                <p>
                    For privacy-related questions or data requests, contact us at:
                    <br />
                    📧 Email: <a href="mailto:info@ataullahmesbah.com" className="text-blue-600 underline">info@ataullahmesbah.com</a>
                </p>
            </section>
        </div>
    );
}
