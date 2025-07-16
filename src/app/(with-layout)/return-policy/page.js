const schemaData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Return Policy - Ataullah Mesbah",
  "description": "Ataullah Mesbah's exchange and return policy. Learn about our refund process, eligibility criteria, and how to request returns.",
  "url": "https://ataullahmesbah.com/return-policy",
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

const RefundPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-6 py-16 md:px-12 lg:px-24">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* JSON-LD Schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
          />

          {/* Header */}
          <header className="text-center mb-12" aria-labelledby="policy-title">
            <h1 id="policy-title" className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Return Policy
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-4 rounded"></div>
            <p className="text-sm text-gray-400">Last Updated: July 17, 2025</p>
          </header>

          {/* Introduction */}
          <p className="text-lg text-gray-200 leading-relaxed">
            Thank you for choosing Ataullah Mesbah. Our goal is your complete satisfaction. If you’re not happy with your purchase, you may request an exchange or refund under the conditions outlined below.
          </p>

          {/* Policy Sections */}
          <div className="space-y-10">
            {/* Return Eligibility */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Return Eligibility</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li>Return requests must be made within 48 hours of receiving the product.</li>
                <li>Accepted only for incorrect, defective, or damaged items.</li>
                <li>Items must be unused, unworn, unwashed, and undamaged.</li>
                <li>Include original tags, packaging, and accessories.</li>
              </ul>
            </article>

            {/* Exchange Policy */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Exchange Policy</h2>
              <div className="space-y-3">
                <p className="text-gray-200 leading-relaxed">
                  Received the wrong product? We’ll exchange it at no extra cost. Ensure the item is in its original condition and meets the eligibility criteria above.
                </p>
                <p>To claim a missing or damaged product, you must record an unboxing video during the unboxing process as proof. Claims for missing products will not be accepted without an unboxing video.</p>
                <p>If you receive a defective or incorrect product, you must claim for an exchange within 2 days (48 hours) of receiving the product (working days only). In such cases, we will collect the product and deliver a replacement to you without any additional delivery charges.</p>
                <p>Please note that claims made after 2 days will not be accepted under any circumstances.</p>
              </div>
            </article>





            {/* Refund Policy */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Refund Policy</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li>Refunds are processed within 15 business days post-inspection.</li>
                <li>If the customer ordered the wrong product, delivery charges will be deducted from the refund.</li>
              </ul>
            </article>

            {/* Return Process */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Return Process</h2>
              <p className="text-gray-200 mb-4">To initiate a return or exchange, contact our support team with:</p>
              <ul className="list-disc list-inside space-y-3 text-gray-300">
                <li>Order ID</li>
                <li>Clear photo of the product</li>
                <li>Description of the issue</li>
                <li>Receipt or proof of purchase</li>
              </ul>
              <p className="text-gray-200 mt-4">Our delivery team will schedule a pickup upon approval.</p>
            </article>

            {/* Damaged or Incorrect Items */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Damaged or Incorrect Items</h2>
              <p className="text-gray-200 leading-relaxed">
                If your product arrives damaged or incorrect, contact us immediately. We’ll address it with a replacement, exchange, or refund based on the circumstances.
              </p>
            </article>

            {/* Contact Information */}
            <article className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Information</h2>
              <p className="text-gray-200 mb-4">For questions about our exchange and return policy, reach out to us:</p>
              <ul className="space-y-3 text-gray-300">
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
                  <span className="font-medium text-gray-200">Return Form:</span>{' '}
                  <a
                    href="/contact"
                    className="text-blue-400 hover:underline"
                    aria-label="Access return contact form"
                  >
                    Return Contact Form
                  </a>
                </li>
              </ul>
            </article>
          </div>

          {/* Footer Note */}
          <footer className="pt-8 border-t border-gray-700 mt-12">
            <p className="text-sm italic text-gray-400 text-center">
              Note: Returns without prior contact or beyond the 48-hour window may not be accepted.
            </p>
          </footer>
        </div>
      </section>
    </div>
  );
};

export const metadata = {
  title: 'Return Policy - Ataullah Mesbah',
  description: "Ataullah Mesbah's exchange and return policy. Learn about our refund process, eligibility criteria, and how to request returns.",
  keywords: 'refund policy, return policy, exchange policy, Ataullah Mesbah, customer support',
  authors: [{ name: 'Ataullah Mesbah' }],
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'Return Policy - Ataullah Mesbah',
    description: "Learn about Ataullah Mesbah's exchange and return policy, including refund processes and eligibility.",
    url: 'https://ataullahmesbah.com/return-policy',
    type: 'website',
    siteName: 'Ataullah Mesbah',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Return Policy - Ataullah Mesbah',
    description: "Ataullah Mesbah's exchange and return policy. Learn about our refund process and eligibility criteria.",
  },
};

export default RefundPolicy;