'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailsClient({ product }) {
    const [selectedImage, setSelectedImage] = useState(product.mainImage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currency, setCurrency] = useState('BDT');
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.mainImage,
        description: product.description,
        offers: {
            '@type': 'Offer',
            priceCurrency: 'BDT',
            price: product.prices.find((p) => p.currency === 'BDT')?.amount || 0,
            availability: product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
    };

    const handleAddToCart = () => {
        // Simplified cart logic (store in localStorage for demo)
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find((item) => item._id === product._id);
        if (existingItem) {
            if (existingItem.quantity + quantity <= 3) {
                existingItem.quantity += quantity;
            } else {
                alert('Cannot add more than 3 units of this product.');
                return;
            }
        } else {
            cart.push({ _id: product._id, title: product.title, quantity, price: product.prices.find((p) => p.currency === 'BDT')?.amount });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart!');
    };

    const handleBuyNow = () => {
        if (product.productType === 'Affiliate') {
            window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
        } else {
            // Store order details in localStorage for checkout (simplified)
            localStorage.setItem('checkout', JSON.stringify({ productId: product._id, quantity, price: product.prices.find((p) => p.currency === 'BDT')?.amount }));
            router.push('/checkout'); // Assumes checkout page exists
        }
    };

    const getPriceDisplay = () => {
        const price = product.prices.find((p) => p.currency === currency);
        if (!price) return 'N/A';
        const symbol = currency === 'BDT' ? '৳' : currency === 'USD' ? '$' : '€';
        return `${symbol}${price.amount.toFixed(2)}`;
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Image Gallery */}
                    <div>
                        <div
                            className="relative w-full h-96 cursor-pointer"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="rounded-lg object-cover"
                                priority
                            />
                        </div>
                        {product.additionalImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-2">
                                {[product.mainImage, ...product.additionalImages].map((img, index) => (
                                    <div
                                        key={index}
                                        className={`relative h-20 cursor-pointer rounded-lg overflow-hidden ${selectedImage === img ? 'ring-2 ring-blue-500' : ''}`}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} image ${index + 1}`}
                                            fill
                                            sizes="20vw"
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Information */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold text-white">{product.title}</h1>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-300">Description</h2>
                            <p className="text-gray-200">{product.description}</p>
                        </div>

                        {product.descriptions.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-300">Additional Descriptions</h2>
                                <ul className="list-disc pl-5 space-y-2 text-gray-200">
                                    {product.descriptions.map((desc, index) => (
                                        <li key={index}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {product.bulletPoints.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-300">Features</h2>
                                <ul className="list-disc pl-5 space-y-2 text-gray-200">
                                    {product.bulletPoints.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div>
                            <h2 className="text-lg font-semibold text-gray-300">Price</h2>
                            <div className="flex items-center space-x-4">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    aria-label="Select currency"
                                >
                                    {product.prices.map((price) => (
                                        <option key={price.currency} value={price.currency}>
                                            {price.currency}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xl font-semibold text-white">{getPriceDisplay()}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-300">Quantity</h2>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Select quantity"
                            >
                                {[1, 2, 3].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex space-x-4">
                            {product.productType === 'Own' && (
                                <button
                                    onClick={handleAddToCart}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Add to Cart
                                </button>
                            )}
                            <button
                                onClick={handleBuyNow}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl w-full">
                        <Image
                            src={selectedImage}
                            alt={product.title}
                            width={800}
                            height={800}
                            className="object-contain"
                        />
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Close image modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}