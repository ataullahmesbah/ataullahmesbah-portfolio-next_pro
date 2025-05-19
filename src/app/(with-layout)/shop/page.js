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
            <div className="relative bg-gradient-to-b from-gray-800/80 via-gray-800/40 to-gray-900 min-h-[40vh] flex flex-col items-center justify-center overflow-hidden border-b border-gray-700">

    {/* Subtle background pattern */}
    <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-[size:180px_180px] opacity-[0.04] z-0"></div>

    {/* Main content container */}
    <div className="relative z-10 w-full px-6 py-16 max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Floating shipping badge - positioned above content */}
        <div className="mb-8 sm:mb-12 transform hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-xl hover:shadow-purple-500/30 transition-all duration-300 text-sm sm:text-base border border-purple-400/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                FREE Shipping on Orders Over ৳2000
            </div>
        </div>

        {/* Main Heading with animated gradient */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-center text-white mb-6 tracking-tighter leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-white animate-gradient-x">
                Premium Collection
            </span>
        </h1>

        {/* Subheading */}
        <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto text-center leading-relaxed mb-8">
            Exclusively curated for <span className="font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Team Mesbah Elite Members</span>
        </p>

        {/* CTA Button */}
        
    </div>

    {/* Bottom gradient fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent z-0"></div>
</div>



            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <Suspense fallback={<LoadingSkeleton />}>
                    <ShopClient products={products} structuredData={getStructuredData(products)} />
                </Suspense>
            </div>

            {/* Bottom Border */}
            <div className="border-b border-gray-800"></div>
        </main>
    );
}

function LoadingSkeleton() {
    return (
        <div className="py-12">
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