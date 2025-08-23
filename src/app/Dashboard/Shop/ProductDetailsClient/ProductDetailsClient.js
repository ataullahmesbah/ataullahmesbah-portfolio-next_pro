'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CartSlider from '../CartSlider/CartSlider';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ProductDetailsClient({ product, latestProducts }) {
    const [selectedImage, setSelectedImage] = useState(product.mainImage);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currency, setCurrency] = useState('BDT');
    const [quantity, setQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [conversionRates, setConversionRates] = useState({ USD: 123, EUR: 135, BDT: 1 });
    const router = useRouter();

    // Fetch conversion rates
    useEffect(() => {
        axios.get('/api/products/conversion-rates')
            .then(response => {
                setConversionRates(response.data);
            })
            .catch(err => {
                console.error('Error fetching conversion rates:', err);
            });
    }, []);

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

    const handleAddToCart = async () => {
        if (product.quantity <= 0 || product.productType === 'Affiliate') {
            toast.error('This product cannot be added to cart');
            return;
        }

        // Validate with backend before adding to cart
        try {
            const response = await axios.get(`/api/products/${product._id}`);
            const currentProduct = response.data;

            if (quantity > currentProduct.quantity) {
                toast.error(`Only ${currentProduct.quantity} units available`);
                setQuantity(Math.min(quantity, currentProduct.quantity));
                return;
            }

            if (quantity > 3) {
                toast.error('Cannot add more than 3 units of this product');
                setQuantity(Math.min(quantity, 3));
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find((item) => item._id === product._id);
            let newQuantity = quantity;

            if (existingItem) {
                newQuantity = existingItem.quantity + quantity;
                if (newQuantity > 3) {
                    toast.error('Cannot add more than 3 units of this product');
                    return;
                }
                if (newQuantity > currentProduct.quantity) {
                    toast.error('Selected quantity exceeds available stock');
                    return;
                }
                cart.splice(cart.indexOf(existingItem), 1);
                cart.push({ ...existingItem, quantity: newQuantity });
                toast.success('Cart updated successfully');
            } else {
                const priceObj = product.prices.find((p) => p.currency === 'BDT') || product.prices[0];
                const priceInBDT = priceObj.currency === 'BDT' ? priceObj.amount : priceObj.amount * (conversionRates[priceObj.currency] || 1);
                cart.push({
                    _id: product._id,
                    title: product.title,
                    quantity,
                    price: priceInBDT,
                    mainImage: product.mainImage,
                    currency: 'BDT',
                });
                toast.success('Added to cart successfully');
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
            setIsCartOpen(true);
        } catch (error) {
            console.error('Error validating product stock:', error);
            toast.error('Error checking product availability');
        }
    };

    const handleBuyNow = async () => {
        if (product.quantity <= 0 && product.productType !== 'Affiliate') {
            toast.error('This product is out of stock');
            return;
        }

        if (product.productType === 'Affiliate') {
            window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
            toast.success('Redirecting to affiliate site');
            return;
        }

        // Validate with backend before proceeding
        try {
            const response = await axios.get(`/api/products/${product._id}`);
            const currentProduct = response.data;

            if (quantity > 3) {
                toast.error('Maximum 3 units per order');
                return;
            }

            if (quantity > currentProduct.quantity) {
                toast.error(`Only ${currentProduct.quantity} units available`);
                setQuantity(Math.min(quantity, currentProduct.quantity));
                return;
            }

            const cart = JSON.parse(localStorage.getItem('cart') || '[]');

            // For Buy Now, we want to replace the cart with just this product
            // Remove any existing instance of this product first
            const filteredCart = cart.filter((item) => item._id !== product._id);

            // Add the product with the selected quantity
            const priceObj = product.prices.find((p) => p.currency === 'BDT') || product.prices[0];
            const priceInBDT = priceObj.currency === 'BDT' ? priceObj.amount : priceObj.amount * (conversionRates[priceObj.currency] || 1);

            const updatedCart = [
                ...filteredCart,
                {
                    _id: product._id,
                    title: product.title,
                    quantity: quantity, // Use the selected quantity, don't add to existing
                    price: priceInBDT,
                    mainImage: product.mainImage,
                    currency: 'BDT',
                }
            ];

            localStorage.setItem('cart', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));
            toast.success('Proceeding to checkout');
            router.push('/checkout');
        } catch (error) {
            console.error('Error validating product stock:', error);
            toast.error('Error checking product availability');
        }
    };

    // Cart End

    const getPriceInBDT = (price, curr) => {
        return price * (conversionRates[curr] || 1);
    };

    const getPriceDisplay = () => {
        const priceObj = product.prices.find((p) => p.currency === currency) || product.prices[0];
        const priceInBDT = priceObj.currency === 'BDT' ? priceObj.amount : priceObj.amount * (conversionRates[priceObj.currency] || 1);
        const total = priceInBDT * quantity;
        const symbol = currency === 'BDT' ? '৳' : currency === 'USD' ? '$' : '€';
        return `${symbol}${new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(currency === 'BDT' ? total : total / (conversionRates[currency] || 1))}`;
    };

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

            {/* Breadcrumb Navigation */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2">
                    <li className="inline-flex items-center">
                        <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-white">
                            Home
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <Link href="/shop" className="ml-1 text-sm font-medium text-gray-400 hover:text-white md:ml-2">
                                Shop
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="ml-1 text-sm font-medium text-white md:ml-2">{product.title}</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Main Product Section */}
            <div className="bg-gray-800 rounded-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
                    {/* Image Gallery */}

                    <div className="space-y-3">
                        <div
                            className="relative w-full max-w-md mx-auto rounded-md overflow-hidden bg-gray-800 shadow-sm cursor-zoom-in"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                width={448}
                                height={448}
                                className="object-contain bg-gray-800"
                                priority
                                sizes="(max-width: 640px) 100vw, 448px"
                            />
                            {product.quantity <= 0 && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <span className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold">
                                        Out of Stock
                                    </span>
                                </div>
                            )}
                        </div>

                        {product.additionalImages.length > 0 && (
                            <div className="w-full max-w-md mx-auto">
                                <div className="grid grid-cols-5 gap-2">
                                    {[product.mainImage, ...product.additionalImages].map((img, index) => (
                                        <div
                                            key={index}
                                            className={`relative aspect-square rounded-md overflow-hidden cursor-pointer transition-transform duration-200 ${selectedImage === img
                                                ? 'ring-2 ring-purple-500'
                                                : 'hover:ring-2 hover:ring-purple-300 hover:scale-105'
                                                } animate-fade-in`}
                                            onClick={() => setSelectedImage(img)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${product.title} thumbnail ${index + 1}`}
                                                width={80}
                                                height={80}
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">{product.title}</h1>
                            {product.category && (
                                <span className="inline-block mt-2 px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                                    {product.category.name}
                                </span>
                            )}
                        </div>

                        {/* Price Section */}
                        <div className="bg-purple-900/20 p-4 rounded-lg w-full">
                            <div className="flex flex-wrap items-center gap-4">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
                                >
                                    {product.prices.map((price) => (
                                        <option key={price.currency} value={price.currency}>
                                            {price.currency}
                                        </option>
                                    ))}
                                </select>
                                <span className="text-2xl font-bold text-white">
                                    {getPriceDisplay()}
                                </span>
                                {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                        {currency === 'BDT' ? '৳' : '$'}
                                        {new Intl.NumberFormat().format(product.originalPrice)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-300">Quantity:</label>
                            <select
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                disabled={product.quantity <= 0 || product.productType === 'Affiliate'}
                                className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                            >
                                {[...Array(Math.min(product.quantity || 3, 3))].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action Buttons */}
                        {product.quantity <= 0 && product.productType !== 'Affiliate' ? (
                            <div className="p-3 bg-red-900/20 text-red-300 rounded-md text-sm">
                                Currently Out of Stock
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {product.productType !== 'Affiliate' && (
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.quantity <= 0}
                                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-md font-medium text-white transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Add to Cart
                                    </button>
                                )}
                                <button
                                    onClick={handleBuyNow}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 rounded-md font-medium text-white transition-all flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Buy Now
                                </button>
                            </div>
                        )}

                        <div>
                            <p className="text-xs text-gray-200">
                                Product Code: {product.product_code || 'N/A'}
                            </p>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4 pt-4 border-t border-gray-700">
                            {product.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                                    <p className="text-gray-300 text-sm">{product.description}</p>
                                </div>
                            )}
                            {product.descriptions && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Additional Description</h3>
                                    <p className="text-gray-300 text-sm">{product.descriptions}</p>
                                </div>
                            )}

                            {product.bulletPoints.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Key Features</h3>
                                    <ul className="space-y-2 text-gray-300 text-sm">
                                        {product.bulletPoints.map((point, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="text-purple-400 mr-2">•</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* More Products Section */}
            {latestProducts.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-white mb-6">You May Also Like</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {latestProducts.slice(0, 5).map((item) => (
                            <Link
                                key={item._id}
                                href={`/shop/${item.slug || item._id}`}
                                className="group bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors flex flex-col h-full"
                            >
                                <div className="relative aspect-square flex-1">
                                    <Image
                                        src={item.mainImage}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                    />
                                    {item.quantity <= 0 && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-red-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                                                Out of Stock
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 mt-auto">
                                    <h3 className="text-sm font-medium text-white line-clamp-2">{item.title}</h3>
                                    <p className="text-purple-400 font-semibold mt-1 text-sm">
                                        ৳{getPriceInBDT(item.prices.find((p) => p.currency === 'BDT')?.amount || item.prices[0].amount, item.prices[0].currency).toLocaleString()}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Zoom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="relative max-w-4xl w-full">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="relative aspect-square w-full">
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Slider */}
            <CartSlider isOpen={isCartOpen} setIsOpen={setIsCartOpen} conversionRates={conversionRates} />
        </div>
    );
}