// src/app/(with-layout)/shop/[slug]/page.js

import { Suspense } from 'react';
import ProductDetailsClient from '@/app/Dashboard/Shop/ProductDetailsClient/ProductDetailsClient';

export async function generateMetadata({ params }) {
  const { slug } = params;
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/slug/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return {
        title: 'Product Not Found - Ataullah Mesbah',
        description: 'The requested product could not be found.',
        robots: 'noindex, nofollow',
      };
    }
    const product = await res.json();

    return {
      title: product.metaTitle || `${product.title} - Ataullah Mesbah`,
      description: product.metaDescription || product.shortDescription || product.description.substring(0, 160),
      keywords: product.keywords.length > 0 ? product.keywords.join(', ') : `${product.title}, ${product.category?.name || ''}, Ataullah Mesbah`,
      alternates: {
        canonical: `${process.env.NEXTAUTH_URL}/shop/${slug}`,
      },
      openGraph: {
        title: product.metaTitle || `${product.title} - Ataullah Mesbah`,
        description: product.metaDescription || product.shortDescription || product.description.substring(0, 160),
        url: `${process.env.NEXTAUTH_URL}/shop/${slug}`,
        type: 'website',
        images: [
          {
            url: product.mainImage,
            width: 800,
            height: 800,
            alt: product.mainImageAlt || product.title,
          },
          ...product.additionalImages.map((img) => ({
            url: img.url,
            width: 800,
            height: 800,
            alt: img.alt || `${product.title} additional image`,
          })),
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.metaTitle || `${product.title} - Ataullah Mesbah`,
        description: product.metaDescription || product.shortDescription || product.description.substring(0, 160),
        images: [product.mainImage, ...product.additionalImages.map((img) => img.url)],
      },
    };
  } catch (error) {
    // console.error('Error generating metadata:', error);
    return {
      title: 'Error - Ataullah Mesbah',
      description: 'An error occurred while fetching product details.',
      robots: 'noindex, nofollow',
    };
  }
}

async function getProduct(slug) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/slug/${slug}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
}

async function getLatestProducts() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?sort=createdAt&order=desc&limit=5`, {
    next: { tags: ['products'], revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export default async function ProductDetails({ params }) {
  const { slug } = params;
  let product, latestProducts;
  try {
    [product, latestProducts] = await Promise.all([getProduct(slug), getLatestProducts()]);
  } catch (error) {
    // console.error('Error fetching data:', error);
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Product Not Found</h1>
          <p className="text-red-400 text-lg">Failed to load product details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white border-b border-b-gray-800 pb-8">
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductDetailsClient product={product} latestProducts={latestProducts} />
      </Suspense>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="h-10 bg-gray-700 rounded w-3/4 mb-8 animate-pulse"></div>
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="w-full h-96 bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-24 bg-gray-700 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-6 bg-gray-700 rounded w-full animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}