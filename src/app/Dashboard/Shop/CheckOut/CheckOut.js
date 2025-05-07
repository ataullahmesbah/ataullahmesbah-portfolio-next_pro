'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', address: '' });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const storedCheckout = JSON.parse(localStorage.getItem('checkout') || '{}');
        if (storedCheckout.productId) {
            setCart([storedCheckout]);
        } else {
            setCart(storedCart);
        }
    }, []);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = () => {
        if (!form.name || !form.email || !form.address) {
            alert('Please fill in all fields.');
            return;
        }
        alert('Order placed successfully! (Demo)');
        localStorage.removeItem('cart');
        localStorage.removeItem('checkout');
        setCart([]);
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Checkout</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800 rounded-xl">
                        <p className="text-gray-400 mb-6">Your cart is empty</p>
                        <Link href="/shop" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Cart Items */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                            <div className="bg-gray-800 rounded-xl p-6">
                                {cart.map((item) => (
                                    <div key={item.productId || item._id} className="flex items-center mb-4 border-b border-gray-700 pb-4">
                                        <div className="relative w-16 h-16">
                                            <Image
                                                src={item.mainImage}
                                                alt={item.title}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h3 className="text-lg font-semibold">{item.title}</h3>
                                            <p className="text-gray-300">
                                                {item.quantity} × ৳{item.price.toLocaleString()} = ৳{(item.quantity * item.price).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between mt-4">
                                    <span className="text-lg font-semibold">Subtotal</span>
                                    <span className="text-lg font-bold">৳{subtotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
                            <div className="bg-gray-800 rounded-xl p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-gray-300">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={form.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-gray-300">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-gray-300">
                                            Address
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={form.address}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows="4"
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        onClick={handlePlaceOrder}
                                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Place Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}