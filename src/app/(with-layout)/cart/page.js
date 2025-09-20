'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversionRates, setConversionRates] = useState({ USD: 123, EUR: 135, BDT: 1 });
    const router = useRouter();

    useEffect(() => {
        const updateCart = () => {
            const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCart(storedCart);
        };
        updateCart();
        window.addEventListener('cartUpdated', updateCart);
        return () => window.removeEventListener('cartUpdated', updateCart);
    }, []);

    useEffect(() => {
        axios
            .get('/api/products/conversion-rates')
            .then((response) => {
                setConversionRates(response.data);
            })
            .catch((err) => {
                console.error('Error fetching conversion rates:', err);
                toast.error('Failed to load currency conversion rates');
            });
    }, []);

    const validateQuantityWithBackend = async (productId, newQuantity, size) => {
        try {
            const response = await axios.post('/api/products/cart/validate', {
                productId,
                quantity: newQuantity,
                size,
            });
            return response.data;
        } catch (error) {
            console.error('Error validating quantity:', error);
            toast.error(error.response?.data?.message || 'Error checking product availability');
            return { valid: false, message: 'Error checking product availability' };
        }
    };

    const handleQuantityChange = async (productId, newQuantity, size) => {
        if (newQuantity < 1) return;

        setIsLoading(true);
        try {
            const validation = await validateQuantityWithBackend(productId, newQuantity, size);
            if (!validation.valid) {
                toast.error(validation.message);
                setIsLoading(false);
                return;
            }

            const updatedCart = cart.map((item) =>
                item._id === productId && (!item.size || item.size === size) ? { ...item, quantity: newQuantity } : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCart(updatedCart);
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error('Error updating quantity:', error);
            toast.error('Failed to update quantity');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = (productId, size) => {
        const updatedCart = cart.filter((item) => !(item._id === productId && (!item.size || item.size === size)));
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const getSubtotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getTotalQuantity = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handleProceedToCheckout = async () => {
        setIsLoading(true);
        try {
            const validationPromises = cart.map(async (item) => {
                const validation = await validateQuantityWithBackend(item._id, item.quantity, item.size);
                return { ...validation, productId: item._id, size: item.size };
            });

            const results = await Promise.all(validationPromises);
            const invalidItems = results.filter((result) => !result.valid);

            if (invalidItems.length > 0) {
                invalidItems.forEach((item) => {
                    toast.error(item.message);
                });

                const updatedCart = await Promise.all(
                    cart.map(async (item) => {
                        const response = await axios.get(`/api/products/${item._id}`);
                        const product = response.data;
                        if (item.size) {
                            const sizeData = product.sizes.find((s) => s.name === item.size);
                            if (!sizeData || item.quantity > sizeData.quantity) {
                                return { ...item, quantity: Math.min(item.quantity, sizeData?.quantity || 0) };
                            }
                        } else if (item.quantity > product.quantity) {
                            return { ...item, quantity: Math.min(item.quantity, product.quantity) };
                        }
                        return item;
                    })
                );

                localStorage.setItem('cart', JSON.stringify(updatedCart));
                setCart(updatedCart);
                window.dispatchEvent(new Event('cartUpdated'));
                setIsLoading(false);
                return;
            }

            router.push('/checkout');
        } catch (error) {
            console.error('Error validating cart:', error);
            toast.error('Failed to validate cart items');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white border-b border-gray-800 pb-8">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
                {cart.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">Your cart is empty</p>
                        <Link href="/shop" className="inline-block py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-yellow-400 mb-4 bg-gray-800 p-2">
                            Adding products to the cart does not mean they are reserved. Buy now to not miss the chance to purchase!
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                <h2 className="text-xl font-semibold mb-4">Shopping Cart ({getTotalQuantity()} items)</h2>
                                {cart.map((item, index) => (
                                    <div key={`${item._id}-${item.size || index}`} className="flex items-start gap-4 bg-gray-800 p-3">
                                        <div className="relative w-24 h-24 flex-shrink-0">
                                            <Image
                                                src={item.mainImage}
                                                alt={item.mainImageAlt || item.title}
                                                width={96}
                                                height={96}
                                                className="object-cover rounded"
                                                sizes="96px"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-lg font-medium">{item.title}</h3>
                                            {item.size && <p className="text-sm text-gray-400">Size: {item.size}</p>}
                                            <p className="text-sm text-purple-300">৳{(item.price * item.quantity).toLocaleString()}</p>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.size)}
                                                    disabled={item.quantity <= 1 || isLoading}
                                                    className="px-2 py-1 bg-gray-700 text-white rounded text-sm disabled:opacity-50"
                                                >
                                                    −
                                                </button>
                                                <span className="text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.size)}
                                                    disabled={isLoading}
                                                    className="px-2 py-1 bg-gray-700 text-white rounded text-sm disabled:opacity-50"
                                                >
                                                    {isLoading ? '...' : '+'}
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item._id, item.size)}
                                            className="text-red-400 hover:text-red-600"
                                            disabled={isLoading}
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="bg-gray-800 p-4 sticky top-6">
                                    <h2 className="text-xl font-semibold mb-4">Order Now</h2>
                                    <div className="space-y-2 text-gray-400">
                                        <p>Delivery Time: 3 - 4 business days</p>
                                        <p>Free Return within 15 days</p>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>৳{getSubtotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-medium pt-2 border-t border-gray-700">
                                            <span>Total</span>
                                            <span>৳{getSubtotal().toLocaleString()}</span>
                                        </div>
                                        <button
                                            onClick={handleProceedToCheckout}
                                            disabled={cart.length === 0 || isLoading}
                                            className="mt-4 w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? 'Validating...' : 'Proceed to Checkout'}
                                        </button>
                                        <Link
                                            href="/shop"
                                            className="block w-full py-2 mt-2 bg-gray-700 text-white text-center rounded hover:bg-gray-600 text-sm"
                                        >
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}