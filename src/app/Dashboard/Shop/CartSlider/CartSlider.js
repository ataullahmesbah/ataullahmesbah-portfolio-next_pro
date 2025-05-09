'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartSlider({ isOpen, setIsOpen, conversionRates }) {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, [isOpen]);

    const removeFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item._id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        // Dispatch custom event to update navbar cart count
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const getBDTPrice = (item) => {
        if (item.currency === 'BDT') return item.price;
        return item.price * conversionRates[item.currency];
    };

    const subtotal = cart.reduce((sum, item) => sum + getBDTPrice(item) * item.quantity, 0);

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-gray-800 text-white shadow-xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-300 hover:text-white focus:outline-none"
                        aria-label="Close cart"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-center">Your cart is empty</p>
                    ) : (
                        cart.map((item) => (
                            <div key={item._id} className="flex items-center border-b border-gray-700 pb-4">
                                <div className="relative w-16 h-16">
                                    <Image
                                        src={item.mainImage}
                                        alt={item.title}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-semibold line-clamp-2">{item.title}</h3>
                                    <p className="text-gray-300">
                                        {item.quantity} × ৳{getBDTPrice(item).toLocaleString()} = ৳{(getBDTPrice(item) * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-400 hover:text-red-300 focus:outline-none"
                                    aria-label={`Remove ${item.title} from cart`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-gray-700">
                        <div className="flex justify-between mb-4">
                            <span className="text-lg font-semibold">Subtotal</span>
                            <span className="text-lg font-bold">৳{subtotal.toLocaleString()}</span>
                        </div>
                        <Link
                            href="/checkout"
                            className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => setIsOpen(false)}
                        >
                            Go to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}