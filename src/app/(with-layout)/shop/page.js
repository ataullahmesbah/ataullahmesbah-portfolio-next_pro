
import ShopClient from '@/app/Dashboard/Shop/ShopClient/ShopClient';
import { Suspense } from 'react';


export async function generateMetadata() {
    const products = await getProducts();
    const productCount = products.length;
    const description = `Browse our collection of ${productCount} high-quality products at Ataullah Mesbah's shop. Find the best deals with fast delivery and top-notch customer service.`;

    return {
        title: 'Premium Shop - Ataullah Mesbah',
        description,
        openGraph: {
            title: 'Premium Shop - Ataullah Mesbah',
            description,
            url: `${process.env.NEXTAUTH_URL}/shop`,
            type: 'website',
            images: products[0]?.mainImage ? [{ url: products[0].mainImage, width: 400, height: 200, alt: products[0].title }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Premium Shop - Ataullah Mesbah',
            description,
            images: products[0]?.mainImage ? [products[0].mainImage] : [],
        },
    };
}

function getStructuredData(products) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Premium Shop',
        description: 'Browse our collection of high-quality products at Ataullah Mesbah.',
        url: `${process.env.NEXTAUTH_URL}/shop`,
        itemListElement: products.map((product, index) => ({
            '@type': 'Product',
            position: index + 1,
            name: product.title,
            image: product.mainImage,
            url: `${process.env.NEXTAUTH_URL}/shop/${product.slug}`,
            offers: {
                '@type': 'Offer',
                priceCurrency: 'BDT',
                price: product.prices.find((p) => p.currency === 'BDT')?.amount || 0,
                availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            },
        })),
    };
}

async function getProducts() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, {
        next: { tags: ['products'], revalidate: 60 },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    const products = await res.json();
    // Sort by newest first, no quantity filter
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export default async function Shop() {
    let products = [];
    try {
        products = await getProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Shop</h1>
                    <p className="text-red-400 text-lg">Failed to load products. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">

            <div className="container mx-auto px-4 sm:px-6 py-12">
                <div className="bg-gray-800 min-h-[30vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 rounded-xl shadow-lg mb-6 mx-4">
                    <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3">🌟 Elite Savings for You</h4>
                    <p className="text-base sm:text-lg text-gray-300 max-w-xl">
                        Enjoy exclusive offers and special savings — only for the community of <strong>Mesbah’s Group</strong>.
                    </p>
                </div>

                <Suspense fallback={<LoadingSkeleton />}>
                    <ShopClient products={products} structuredData={getStructuredData(products)} />
                </Suspense>
            </div>
        </main>
    );
}

function LoadingSkeleton() {
    return (
        <div className="py-12">
            <div className="flex justify-between items-center mb-12">
                <div className="h-10 w-64 bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-10 w-48 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="aspect-square bg-gray-700 animate-pulse"></div>
                        <div className="p-5">
                            <div className="h-6 bg-gray-700 rounded-full w-3/4 mb-3 animate-pulse"></div>
                            <div className="h-5 bg-gray-700 rounded-full w-1/2 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}