import FAQSection from "@/app/components/Share/FAQSection/FAQSection";

export const metadata = {
  title: "Frequently Asked Questions | Ataullah Mesbah",
  description:
    "Find answers to common questions about web development, SEO, e-commerce, and digital services by Ataullah Mesbah.",
  openGraph: {
    title: "Frequently Asked Questions | Ataullah Mesbah",
    description:
      "Explore answers to common questions about web development, SEO, e-commerce, and digital services.",
    url: "https://ataullahmesbah.com/faq",
    siteName: "Ataullah Mesbah",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions | Ataullah Mesbah",
    description:
      "Answers to common questions about web development, SEO, e-commerce, and digital services.",
  },
};

export default function FAQPage() {
  return (
    <main className="">
      <FAQSection />
    </main>
  );
}