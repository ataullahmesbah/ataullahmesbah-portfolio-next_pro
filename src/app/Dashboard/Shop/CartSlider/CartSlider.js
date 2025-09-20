'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSlider({ isOpen, setIsOpen, conversionRates }) {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleViewCart = async () => {
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

            setIsOpen(false);
            router.push('/cart');
        } catch (error) {
            console.error('Error validating cart:', error);
            toast.error('Failed to validate cart items');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-screen w-full sm:w-80 md:w-96 bg-gradient-to-b from-gray-900 to-gray-800 shadow-2xl z-50 overflow-hidden"
                >
                    <div className="flex justify-between items-center p-4 border-b border-gray-700">
                        <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-300 hover:text-white transition-colors"
                            disabled={isLoading}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
                        {cart.length === 0 ? (
                            <p className="text-gray-400 text-center text-sm font-medium">Your cart is empty</p>
                        ) : (
                            cart.map((item, index) => (
                                <motion.div
                                    key={`${item._id}-${item.size || index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-start gap-3 border-b border-gray-700 pb-4"
                                >
                                    <div className="relative w-16 h-16 flex-shrink-0">
                                        <Image
                                            src={item.mainImage}
                                            alt={item.title}
                                            width={64}
                                            height={64}
                                            className="object-cover rounded-md shadow-sm"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-sm font-medium text-white line-clamp-2">{item.title}</h3>
                                        {item.size && <p className="text-xs text-gray-300">Size: {item.size}</p>}
                                        <p className="text-xs text-purple-300 font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.size)}
                                                disabled={item.quantity <= 1 || isLoading}
                                                className="px-2 py-1 bg-gray-700 text-white rounded-full text-xs hover:bg-purple-600 transition disabled:opacity-50"
                                            >
                                                −
                                            </button>
                                            <span className="text-sm text-white font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.size)}
                                                disabled={isLoading}
                                                className="px-2 py-1 bg-gray-700 text-white rounded-full text-xs hover:bg-purple-600 transition disabled:opacity-50"
                                            >
                                                {isLoading ? '...' : '+'}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item._id, item.size)}
                                        className="text-red-400 hover:text-red-600 transition"
                                        disabled={isLoading}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-700 bg-gray-900/80 backdrop-blur-sm fixed bottom-0 w-full sm:w-80 md:w-96">
                        <div className="flex justify-between text-sm font-semibold text-white mb-3">
                            <span>Subtotal</span>
                            <span>৳{getSubtotal().toLocaleString()}</span>
                        </div>
                        <button
                            onClick={handleViewCart}
                            disabled={cart.length === 0 || isLoading}
                            className="block w-full py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-center rounded-lg font-medium text-sm hover:from-purple-700 hover:to-purple-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Validating...' : 'View Cart'}
                        </button>

                        <Link
                            href="/shop"
                            className="block w-full py-2 mt-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white text-center rounded-lg font-medium text-sm hover:from-gray-600 hover:to-gray-500 transition shadow-md"
                            onClick={() => setIsOpen(false)}
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}