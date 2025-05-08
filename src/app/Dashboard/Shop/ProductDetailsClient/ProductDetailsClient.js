'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartSlider from '../CartSlider/CartSlider';


export default function ProductDetailsClient({ product, latestProducts }) {
    const [selectedImage, setSelectedImage] = useState(product.mainImage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currency, setCurrency] = useState('BDT');
    const [quantity, setQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const router = useRouter();

    // Conversion rates (demo)
    const conversionRates = {
        USD: 120, // 1 USD = 120 BDT
        EUR: 130, // 1 EUR = 130 BDT
        BDT: 1,
    };

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
        if (product.quantity <= 0) return;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find((item) => item._id === product._id);
        let newQuantity = quantity;

        if (existingItem) {
            newQuantity = existingItem.quantity + quantity;
            if (newQuantity > 3) {
                alert('Cannot add more than 3 units of this product.');
                return;
            }
            if (newQuantity > product.quantity) {
                alert('Selected quantity exceeds available stock.');
                return;
            }
            existingItem.quantity = newQuantity;
        } else {
            if (quantity > 3) {
                alert('Cannot add more than 3 units of this product.');
                return;
            }
            if (quantity > product.quantity) {
                alert('Selected quantity exceeds available stock.');
                return;
            }
            cart.push({
                _id: product._id,
                title: product.title,
                quantity,
                price: product.prices.find((p) => p.currency === 'BDT')?.amount, // Store BDT price
                mainImage: product.mainImage,
                currency, // Store selected currency for display
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        setIsCartOpen(true);
    };

    const handleBuyNow = () => {
        if (product.quantity <= 0 && product.productType !== 'Affiliate') return;
        if (product.productType === 'Affiliate') {
            window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
        } else {
            if (quantity > 3) {
                alert('Cannot buy more than 3 units of this product.');
                return;
            }
            if (quantity > product.quantity) {
                alert('Selected quantity exceeds available stock.');
                return;
            }
            localStorage.setItem(
                'checkout',
                JSON.stringify({
                    productId: product._id,
                    title: product.title,
                    quantity,
                    price: product.prices.find((p) => p.currency === 'BDT')?.amount, // Store BDT price
                    mainImage: product.mainImage,
                    currency, // Store selected currency
                })
            );
            router.push('/checkout');
        }
    };

    const getPriceDisplay = () => {
        const price = product.prices.find((p) => p.currency === currency);
        if (!price) return 'N/A';
        const symbol = currency === 'BDT' ? '৳' : currency === 'USD' ? '$' : '€';
        const total = (price.amount * quantity).toFixed(2);
        return `${symbol}${total}`;
    };

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Image Gallery */}
                    <div>
                        <div
                            className="relative w-full h-96 cursor-pointer rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover rounded-lg"
                                priority
                            />
                        </div>
                        {product.additionalImages.length > 0 && (
                            <div className="mt-4 grid grid-cols-4 gap-3">
                                {[product.mainImage, ...product.additionalImages].map((img, index) => (
                                    <div
                                        key={index}
                                        className={`relative h-24 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === img ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
                                            }`}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} image ${index + 1}`}
                                            fill
                                            sizes="20vw"
                                            className="object-cover rounded-lg"
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
                                disabled={product.quantity <= 0}
                                className="bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                aria-label="Select quantity"
                            >
                                {[...Array(Math.min(product.quantity || 3, 3))].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {product.quantity <= 0 ? (
                            <div className="text-red-400 text-lg font-semibold bg-red-900/20 p-4 rounded-lg">
                                Product Out of Stock
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                {product.productType === 'Own' && (
                                    <button
                                        onClick={handleAddToCart}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        disabled={product.quantity <= 0}
                                    >
                                        Add to Cart
                                    </button>
                                )}
                                <button
                                    onClick={handleBuyNow}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                                    disabled={product.quantity <= 0 && product.productType !== 'Affiliate'}
                                >
                                    Buy Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* More Items Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-white mb-6">More Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {latestProducts.map((item) => (
                        <Link
                            key={item._id}
                            href={`/shop/${item.slug || item._id}`}
                            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
                        >
                            <div className="relative aspect-square">
                                <Image
                                    src={item.mainImage}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="20vw"
                                    loading="lazy"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-white line-clamp-2">{item.title}</h3>
                                <p className="text-blue-400 font-bold mt-2">
                                    ৳{item.prices.find((p) => p.currency === 'BDT')?.amount?.toLocaleString() || 'N/A'}
                                </p>
                            </div>
                        </Link>
                    ))}
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
                            className="object-contain rounded-lg"
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

            {/* Cart Slider */}
            <CartSlider isOpen={isCartOpen} setIsOpen={setIsCartOpen} conversionRates={conversionRates} />
        </div>
    );
}