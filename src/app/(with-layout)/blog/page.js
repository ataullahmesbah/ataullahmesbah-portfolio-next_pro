// app/(with-layout)/blog/page.js
import BlogContent from '@/app/components/Blog/BlogContent/BlogContent';
import BlogSkeleton from '@/app/components/Blog/BlogSkeleton/BlogSkeleton';
import { Suspense } from 'react';

export async function generateMetadata({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const isFirstPage = page === 1;

  // Dynamic titles and descriptions
  const title = isFirstPage
    ? 'Blog | Ataullah Mesbah - AI, Tech & Web Deves'
    : `Blog - Page ${page} | Ataullah Mesbah - Technology Insights`;

  const description = isFirstPage
    ? 'Explore expert insights on AI, quantum computing, web development, and emerging technologies. Latest tutorials, guides, and tech trends by Ataullah Mesbah.'
    : `Page ${page} of technology blog featuring AI, quantum computing, and web development insights. Discover cutting-edge tutorials and guides.`;

  const keywords = isFirstPage
    ? 'blog, Ataullah Mesbah, AI artificial intelligence, quantum computing, web development, next.js, react, technology blog, programming tutorials, tech insights'
    : `blog page ${page}, technology articles, AI tutorials, web development guides, quantum computing insights`;

  const canonicalUrl = isFirstPage
    ? 'https://ataullahmesbah.com/blog'
    : `https://ataullahmesbah.com/blog?page=${page}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'Ataullah Mesbah' }],
    creator: 'Ataullah Mesbah',
    publisher: 'Ataullah Mesbah',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': canonicalUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Ataullah Mesbah',
      locale: 'en_US',
      images: [
        {
          url: 'https://ataullahmesbah.com/images/og-blog.jpg',
          width: 1200,
          height: 630,
          alt: 'Ataullah Mesbah Blog - Technology Insights & Tutorials',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ataullahmesbah',
      creator: '@ataullahmesbah',
      title,
      description,
      images: ['https://ataullahmesbah.com/images/og-blog.jpg'],
    },
    verification: {
      // Add your verification codes here
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
      yahoo: 'your-yahoo-verification-code',
    },
  };
}

// Generate static params for better SEO (SSG)
export async function generateStaticParams() {
  // Pre-generate first few pages for better SEO
  return [
    { page: '1' },
    { page: '2' },
    { page: '3' },
  ].map(({ page }) => ({
    page: page.toString(),
  }));
}

// Add viewport and theme color
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6D28D9', // Purple theme color
};

export default function BlogPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;

  // Breadcrumb schema for better SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://ataullahmesbah.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': `https://ataullahmesbah.com/blog${page > 1 ? `?page=${page}` : ''}`
      }
    ]
  };

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Page Structure */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <Suspense fallback={<BlogSkeleton />}>
          <BlogContent searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}