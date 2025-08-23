'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CartSlider({ isOpen, setIsOpen, conversionRates }) {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const updateCart = () => {
            const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCart(storedCart);
        };
        updateCart();
        window.addEventListener('cartUpdated', updateCart);
        return () => window.removeEventListener('cartUpdated', updateCart);
    }, []);

    const validateQuantityWithBackend = async (productId, newQuantity) => {
        try {
            const response = await axios.get(`/api/products/${productId}`);
            const product = response.data;
            
            if (newQuantity > product.quantity) {
                toast.error(`Only ${product.quantity} units available`);
                return false;
            }
            
            if (newQuantity > 3) {
                toast.error('Maximum 3 units per product');
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error validating quantity:', error);
            toast.error('Error checking product availability');
            return false;
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setIsLoading(true);
        try {
            const isValid = await validateQuantityWithBackend(productId, newQuantity);
            if (!isValid) {
                // Refresh cart to show correct values
                const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
                setCart(storedCart);
                setIsLoading(false);
                return;
            }
            
            const updatedCart = cart.map((item) =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
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

    const handleRemoveItem = (productId) => {
        const updatedCart = cart.filter((item) => item._id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const getSubtotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            // Validate all items in cart before proceeding to checkout
            const validationPromises = cart.map(async (item) => {
                const response = await axios.get(`/api/products/${item._id}`);
                const product = response.data;
                
                if (item.quantity > product.quantity) {
                    return {
                        valid: false,
                        productId: item._id,
                        message: `Only ${product.quantity} units available for ${item.title}`
                    };
                }
                
                return { valid: true, productId: item._id };
            });
            
            const results = await Promise.all(validationPromises);
            const invalidItems = results.filter(result => !result.valid);
            
            if (invalidItems.length > 0) {
                invalidItems.forEach(item => {
                    toast.error(item.message);
                });
                
                // Update cart with correct quantities
                const updatedCart = await Promise.all(cart.map(async (item) => {
                    const response = await axios.get(`/api/products/${item._id}`);
                    const product = response.data;
                    
                    if (item.quantity > product.quantity) {
                        return { ...item, quantity: product.quantity };
                    }
                    return item;
                }));
                
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                setCart(updatedCart);
                window.dispatchEvent(new Event('cartUpdated'));
                return;
            }
            
            // All items are valid, proceed to checkout
            setIsOpen(false);
            window.location.href = '/checkout';
        } catch (error) {
            console.error('Error validating cart:', error);
            toast.error('Failed to validate cart items');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-80 md:w-96 bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-white">Your Cart</h2>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-gray-300 hover:text-white"
                    disabled={isLoading}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-10rem)]">
                {cart.length === 0 ? (
                    <p className="text-gray-400 text-center text-sm">Your cart is empty</p>
                ) : (
                    cart.map((item) => (
                        <div key={item._id} className="flex items-start gap-3 border-b border-gray-800 pb-4">
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                    src={item.mainImage}
                                    alt={item.title}
                                    width={64}
                                    height={64}
                                    className="object-cover rounded-md"
                                    sizes="64px"
                                />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h3 className="text-sm font-medium text-white line-clamp-2">{item.title}</h3>
                                <p className="text-xs text-gray-300">
                                    ৳{(item.price * item.quantity).toLocaleString()}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1 || isLoading}
                                        className="px-2 py-1 bg-gray-700 text-white rounded-md text-xs disabled:opacity-50"
                                    >
                                        -
                                    </button>
                                    <span className="text-sm text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                        disabled={isLoading}
                                        className="px-2 py-1 bg-gray-700 text-white rounded-md text-xs disabled:opacity-50"
                                    >
                                        {isLoading ? '...' : '+'}
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="text-red-400 hover:text-red-600"
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="p-4 border-t border-gray-700">
                <div className="flex justify-between text-sm font-semibold text-white mb-3">
                    <span>Subtotal</span>
                    <span>৳{getSubtotal().toLocaleString()}</span>
                </div>
                <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || isLoading}
                    className="block w-full py-2 bg-purple-600 text-white text-center rounded-md font-medium text-sm hover:bg-purple-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Validating...' : 'Go to Checkout'}
                </button>
            </div>
        </div>
    );
}