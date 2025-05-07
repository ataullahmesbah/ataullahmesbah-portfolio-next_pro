// src/app/(with-layout)/shop/[slug]/page.js

import ProductDetailsClient from '@/app/Dashboard/Shop/ProductDetailsClient/ProductDetailsClient';
import { Suspense } from 'react';


export async function generateMetadata({ params }) {
  const { slug } = params;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    return {
      title: 'Product Not Found - Ataullah Mesbah',
      description: 'The requested product could not be found.',
    };
  }
  const product = await res.json();
  const description = product.description.substring(0, 160);

  return {
    title: `${product.title} - Ataullah Mesbah`,
    description,
    keywords: `${product.title}, ${product.category?.name || ''}, product, Ataullah Mesbah`,
    openGraph: {
      title: `${product.title} - Ataullah Mesbah`,
      description,
      url: `${process.env.NEXTAUTH_URL}/shop/${slug}`,
      type: 'website', // Changed from 'product' to 'website'
      images: [{ url: product.mainImage, width: 400, height: 400, alt: product.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - Ataullah Mesbah`,
      description,
      images: [product.mainImage],
    },
  };
}

async function getProduct(slug) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
}

export default async function ProductDetails({ params }) {
  const { slug } = params;
  let product;
  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error('Error fetching product:', error);
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
    <div className="min-h-screen bg-gray-900 text-white">
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductDetailsClient product={product} />
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