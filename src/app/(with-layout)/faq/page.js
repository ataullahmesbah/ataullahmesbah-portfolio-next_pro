// app/faq/page.js
import FAQSection from "@/app/components/Share/FAQSection/FAQSection";

export const metadata = {
  title: "FAQ - Web Development & SEO Services | Ataullah Mesbah",
  description: "Get answers about web development, SEO services, portfolio websites, and e-commerce solutions by Ataullah Mesbah. Helping freelancers and businesses grow online.",
  keywords: ["Ataullah Mesbah", "web developer Bangladesh", "SEO expert", "portfolio website developer", "ecommerce website developer", "Next.js developer"],
  openGraph: {
    title: "FAQ - Web Development & SEO Services | Ataullah Mesbah",
    description: "Frequently asked questions about web development, SEO, and digital services.",
    url: "https://www.ataullahmesbah.com/faq",
    siteName: "Ataullah Mesbah",
    type: "website",
  },
};

// Complete FAQ data for JSON-LD
const allFAQs = [
  {
    question: "Who is Ataullah Mesbah and what does he do?",
    answer: "Ataullah Mesbah is a professional web developer, SEO specialist, and content creator who helps freelancers, businesses, and personal brands build a strong online presence globally."
  },
  {
    question: "What services does Ataullah Mesbah provide?",
    answer: "He offers web development, SEO services, portfolio website creation, and custom e-commerce solutions tailored for modern businesses."
  },
  {
    question: "Is Ataullah Mesbah one of the best web developers in Bangladesh?",
    answer: "Ataullah Mesbah is recognized for building modern, high-performance websites and helping clients grow online with proven SEO and development strategies."
  },
  {
    question: "Can Ataullah Mesbah be considered a top web developer worldwide?",
    answer: "He works with international clients and builds scalable, modern web solutions, making him a strong choice for businesses looking for global-level development quality."
  },
  {
    question: "Why should I hire Ataullah Mesbah for web development or SEO?",
    answer: "He combines modern design, fast performance, and proven SEO strategies to build websites that not only look professional but also generate real business results."
  },
  {
    question: "Does Ataullah Mesbah build portfolio websites for freelancers?",
    answer: "Yes, he specializes in building high-converting portfolio websites that help freelancers attract more clients and build credibility online."
  },
  {
    question: "What technologies does Ataullah Mesbah use?",
    answer: "He uses Next.js, React, Node.js, MongoDB, TypeScript, and Tailwind CSS to build fast, secure, and scalable websites."
  },
  {
    question: "Can Ataullah Mesbah develop custom e-commerce websites?",
    answer: "Yes, he builds fully functional e-commerce websites with product management, payment integration, and SEO optimization."
  },
  {
    question: "Does Ataullah Mesbah offer SEO services?",
    answer: "Yes, he provides SEO services including keyword research, on-page SEO, technical optimization, and content strategies to improve Google rankings."
  },
  {
    question: "How can a website built by Ataullah Mesbah help my business?",
    answer: "A professional website increases trust, improves conversions, and helps attract high-quality clients online."
  },
  {
    question: "Does Ataullah Mesbah work with international clients?",
    answer: "Yes, he works remotely with clients from Europe, North America, and worldwide."
  },
  {
    question: "Do you offer complete website development services?",
    answer: "He offers full-stack web development using technologies like Next.js, React, Node.js, MongoDB, and Tailwind CSS — ensuring fast, secure, and responsive websites tailored to business needs."
  },
  {
    question: "Can you build custom e-commerce websites with payment gateway integration?",
    answer: "Yes, he creates fully functional e-commerce platforms with admin panels, product management, and payment gateways like SSLCOMMERZ, Stripe, and PayPal."
  },
  {
    question: "Do you also provide SEO services with your website packages?",
    answer: "Yes, his website packages include SEO services such as on-page optimization, keyword research, and technical improvements to help websites rank higher on Google."
  },
  {
    question: "How long does SEO take to show results?",
    answer: "SEO typically takes 3–6 months for significant growth, although initial improvements can be seen within 4–8 weeks."
  },
  {
    question: "Where can I see Ataullah Mesbah's web development projects?",
    answer: "You can explore his projects at https://www.ataullahmesbah.com/projects"
  },
  {
    question: "Does Ataullah Mesbah write blogs or share knowledge?",
    answer: "Yes, he regularly writes about web development, SEO, and digital growth. Visit his blog at https://www.ataullahmesbah.com/blog"
  },
  {
    question: "Can I follow Ataullah Mesbah's travel journey?",
    answer: "Yes, he shares his worldwide travel experiences at https://www.ataullahmesbah.com/mesbahoffwego"
  },
  {
    question: "Does Ataullah Mesbah have a newsletter?",
    answer: "Yes, you can subscribe to his newsletter to get updates on web development, SEO tips, and new content at https://www.ataullahmesbah.com/newsletter"
  },
  {
    question: "Why do freelancers need a personal portfolio website?",
    answer: "A portfolio website helps freelancers showcase their work professionally, build trust, and attract higher-paying clients."
  },
  {
    question: "How long does it take to build a website?",
    answer: "Depending on the project scope, most websites are completed within 1–3 weeks with proper planning and execution."
  },
  {
    question: "What makes Ataullah Mesbah different from other developers?",
    answer: "He focuses on performance, modern design, and SEO to build websites that not only look great but also generate real results."
  },
  {
    question: "Can Ataullah Mesbah help improve my Google ranking?",
    answer: "Yes, through effective SEO strategies, technical fixes, and optimized content, he helps websites rank higher on search engines."
  },
  {
    question: "Is Ataullah Mesbah available for freelance work?",
    answer: "Yes, he is available for freelance projects and long-term remote collaborations."
  },
  {
    question: "Do you provide services to clients outside Bangladesh?",
    answer: "Yes, he provides services to clients globally, including Europe, North America, and other international markets."
  },
  {
    question: "How can I contact Ataullah Mesbah for a project?",
    answer: "You can reach out through the contact page at https://www.ataullahmesbah.com/contact or connect via LinkedIn for quick communication."
  },
  {
    question: "What is the web development process followed by Ataullah Mesbah?",
    answer: "He follows a structured process including planning, UI/UX design, development, testing, and deployment, along with post-launch support."
  },
  {
    question: "Do you offer support after website delivery?",
    answer: "Yes, he provides post-launch support including bug fixes, updates, and minor improvements if needed."
  },
  {
    question: "Do you offer digital marketing or affiliate-related services?",
    answer: "Yes, he works on affiliate strategies, digital business growth, and e-commerce marketing to help brands scale online."
  },
  {
    question: "Can I purchase products or services directly from the website?",
    answer: "Yes, you can explore available offerings on the shop page at https://www.ataullahmesbah.com/shop and complete your purchase using available payment methods."
  }
];

export default function FAQPage() {
  // 1️⃣ FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // 2️⃣ BreadcrumbList Schema (এটি যোগ করুন)
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.ataullahmesbah.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": "https://www.ataullahmesbah.com/faq"
      }
    ]
  };

  return (
    <main>
      <FAQSection />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* BreadcrumbList Schema - এটাই নতুন যোগ করা */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}