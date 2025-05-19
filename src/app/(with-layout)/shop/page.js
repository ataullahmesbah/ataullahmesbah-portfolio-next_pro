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
    return products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export default async function Shop() {
    let products = [];
    try {
        products = await getProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        return (
            <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Shop</h1>
                    <p className="text-red-400 text-lg">Failed to load products. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-900">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-purple-900/50 to-gray-800/50 min-h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[length:100px_100px] opacity-10"></div>
                <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Premium Collection
                    </h1>
                    <p className="text-lg text-gray-300 mb-8">
                        Discover exclusive products with special savings for <span className="font-semibold text-purple-300">Mesbah's Group</span>
                    </p>
                    <div className="w-full max-w-md mx-auto bg-gray-800/70 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                        <p className="text-purple-300 text-sm font-medium">
                            🚀 Free shipping on orders over ৳2000
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-12 -mt-16 relative z-20">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-12 border border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-bold text-white">
                            Our Latest Products
                        </h2>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-400">Showing {products.length} items</span>
                        </div>
                    </div>
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
            <div className="bg-gray-800/50 rounded-xl p-6 mb-12 animate-pulse h-24"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700">
                        <div className="aspect-square bg-gray-700 animate-pulse"></div>
                        <div className="p-4 space-y-3">
                            <div className="h-5 bg-gray-700 rounded-full w-3/4 animate-pulse"></div>
                            <div className="h-4 bg-gray-700 rounded-full w-1/2 animate-pulse"></div>
                            <div className="h-6 bg-gray-700 rounded-full w-1/3 mt-2 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}