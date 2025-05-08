'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [form, setForm] = useState({
        email: '',
        mobile: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
    });
    const [saveInfo, setSaveInfo] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [shippingMethod, setShippingMethod] = useState('cod');
    const [termsAgreed, setTermsAgreed] = useState(false);
    const conversionRates = {
        USD: 120, // 1 USD = 120 BDT
        EUR: 130, // 1 EUR = 130 BDT
        BDT: 1,
    };

    useEffect(() => {
        // Load cart
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        const storedCheckout = JSON.parse(localStorage.getItem('checkout') || '{}');
        if (storedCheckout.productId) {
            setCart([storedCheckout]);
        } else {
            setCart(storedCart);
        }

        // Load saved customer info
        const savedInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
        if (savedInfo) {
            setForm(savedInfo);
            setSaveInfo(true);
        }
    }, []);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const applyCoupon = () => {
        // Demo coupon: SAVE10 = 10% off
        if (couponCode.toUpperCase() === 'SAVE10') {
            setDiscount(0.1); // 10% discount
            alert('Coupon applied: 10% off');
        } else {
            setDiscount(0);
            alert('Invalid coupon code');
        }
    };

    const handlePlaceOrder = () => {
        if (!form.email || !form.firstName || !form.lastName || !form.address || !form.city || !form.state || !form.zip) {
            alert('Please fill in all required fields.');
            return;
        }
        if (!termsAgreed) {
            alert('You must agree to the terms and conditions.');
            return;
        }
        if (saveInfo) {
            localStorage.setItem('customerInfo', JSON.stringify(form));
        }
        alert('Redirecting to SSLCommerz payment gateway... (Demo)');
        // Clear cart for demo
        localStorage.removeItem('cart');
        localStorage.removeItem('checkout');
        setCart([]);
    };

    const getBDTPrice = (item) => {
        if (item.currency === 'BDT') return item.price;
        return item.price * conversionRates[item.currency];
    };

    const subtotal = cart.reduce((sum, item) => sum + getBDTPrice(item) * item.quantity, 0);
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

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
                        {/* Left: Customer Information */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>
                            <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-gray-300">
                                        Email *
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
                                    <label htmlFor="mobile" className="block text-gray-300">
                                        Mobile
                                    </label>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        value={form.mobile}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-gray-300">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-gray-300">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-gray-300">
                                        Address *
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={form.address}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="city" className="block text-gray-300">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={form.city}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="state" className="block text-gray-300">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            value={form.state}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="zip" className="block text-gray-300">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            id="zip"
                                            name="zip"
                                            value={form.zip}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="saveInfo"
                                        checked={saveInfo}
                                        onChange={(e) => setSaveInfo(e.target.checked)}
                                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                                    />
                                    <label htmlFor="saveInfo" className="text-gray-300">
                                        Save this information for next time
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right: Order Summary */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                            <div className="bg-gray-800 rounded-xl p-6 space-y-4">
                                {/* Cart Items */}
                                {cart.map((item) => (
                                    <div key={item.productId || item._id} className="flex items-center border-b border-gray-700 pb-4">
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
                                                {item.quantity} × ৳{getBDTPrice(item).toLocaleString()} = ৳{(getBDTPrice(item) * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Coupon */}
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Apply
                                    </button>
                                </div>

                                {/* Shipping Method */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Shipping Method</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="cod"
                                                name="shipping"
                                                value="cod"
                                                checked={shippingMethod === 'cod'}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600"
                                            />
                                            <label htmlFor="cod" className="ml-2 text-gray-300">
                                                Cash on Delivery
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                id="payFirst"
                                                name="shipping"
                                                value="payFirst"
                                                checked={shippingMethod === 'payFirst'}
                                                onChange={(e) => setShippingMethod(e.target.value)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600"
                                            />
                                            <label htmlFor="payFirst" className="ml-2 text-gray-300">
                                                Pay First
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>৳{subtotal.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>Discount ({couponCode})</span>
                                            <span>-৳{discountAmount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>৳{total.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-300 mb-2">Payment Method</h3>
                                    <p className="text-gray-300">Pay Now via SSLCommerz (Integration Pending)</p>
                                </div>

                                {/* Terms and Conditions */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={termsAgreed}
                                        onChange={(e) => setTermsAgreed(e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded"
                                        required
                                    />
                                    <label htmlFor="terms" className="ml-2 text-gray-300">
                                        I have read and agree to the website’s{' '}
                                        <Link href="/terms" className="text-blue-400 hover:underline">
                                            terms and conditions
                                        </Link>{' '}
                                        *
                                    </label>
                                </div>

                                {/* Place Order */}
                                <button
                                    onClick={handlePlaceOrder}
                                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}