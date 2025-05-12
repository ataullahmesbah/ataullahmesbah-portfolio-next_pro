'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

export default function Checkout() {
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [customerInfo, setCustomerInfo] = useState({
        name: 'Alex',
        email: 'alex@gmail.com',
        phone: '+880123456789',
        address: 'Elephant Road',
        city: 'Dhaka',
        postcode: '1000',
        country: 'Bangladesh',
        district: '',
        thana: '',
    });
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [shippingCharge, setShippingCharge] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [districtsThanas, setDistrictsThanas] = useState({});
    const router = useRouter();
    const [shippingCharges, setShippingCharges] = useState({ 'Dhaka-Chattogram': 0, 'Others': 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch cart
                const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
                setCart(storedCart);

                // Fetch districts and thanas
                const districtsResponse = await axios.get('/api/products/districts-thanas');
                setDistrictsThanas(districtsResponse.data);

                // Fetch shipping charges
                const shippingResponse = await axios.get('/api/products/shipping-charges');
                const chargeMap = { 'Dhaka-Chattogram': 0, 'Others': 0 };
                shippingResponse.data.forEach(c => {
                    if (c.type === 'Dhaka-Chattogram' || c.type === 'Others') {
                        chargeMap[c.type] = c.charge || 0;
                    }
                });
                console.log('Shipping Charges:', chargeMap);
                setShippingCharges(chargeMap);

                // Set initial shipping charge based on default district
                if (customerInfo.district) {
                    const charge = customerInfo.district === 'Dhaka' || customerInfo.district === 'Chattogram' || customerInfo.district === 'Chittagong'
                        ? chargeMap['Dhaka-Chattogram']
                        : chargeMap['Others'];
                    setShippingCharge(Number.isFinite(charge) ? charge : 0);
                }
            } catch (error) {
                console.error('Error fetching checkout data:', error);
                setError('Failed to load checkout data. Please refresh the page.');
            }
        };
        fetchData();
    }, []);

    const getBDTPrice = (item) => {
        if (!item || !item.price || !item.currency) return 0;
        if (item.currency === 'BDT') return item.price;
        return item.price * (item.currency === 'USD' ? 120 : 130);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'district') {
            setCustomerInfo((prev) => ({ ...prev, thana: '', district: value }));
            const charge = value === 'Dhaka' || value === 'Chattogram' || value === 'Chittagong'
                ? shippingCharges['Dhaka-Chattogram']
                : shippingCharges['Others'];
            setShippingCharge(Number.isFinite(charge) ? charge : 0);
        } else {
            setCustomerInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1 || !productId) return;
        const updatedCart = cart.map(item =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const handleCouponApply = async () => {
        setCouponError('');
        setDiscount(0);
        try {
            const productIds = cart.map(item => item._id).filter(id => id);
            if (!productIds.length) {
                setCouponError('No valid products in cart.');
                return;
            }
            const response = await axios.post('/api/products/coupons/validate', { code: couponCode, productIds });
            if (response.data.valid) {
                const cartItem = cart.find(item => item._id === response.data.productId?.toString());
                if (!cartItem) {
                    setCouponError('Coupon not applicable to cart items.');
                    return;
                }
                const itemTotal = getBDTPrice(cartItem) * cartItem.quantity;
                const discountAmount = (itemTotal * response.data.discountPercentage) / 100;
                setDiscount(discountAmount);
            } else {
                setCouponError(response.data.message || 'Invalid coupon code.');
            }
        } catch (err) {
            setCouponError('Error applying coupon. Please try again.');
            console.error('Coupon Error:', err);
        }
    };

    const generateOrderId = () => {
        return 'ORDER_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const subtotal = cart.reduce((sum, item) => sum + getBDTPrice(item) * (item.quantity || 1), 0);
    const payableAmount = subtotal - discount + (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' ? (Number.isFinite(shippingCharge) ? shippingCharge : 0) : 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        if (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (!customerInfo.district || !customerInfo.thana)) {
            setError('Please select district and thana for COD.');
            setLoading(false);
            return;
        }

        if (!cart.length) {
            setError('Your cart is empty.');
            setLoading(false);
            return;
        }

        const orderData = {
            orderId: generateOrderId(),
            products: cart.map((item) => ({
                productId: item._id,
                title: item.title || 'Unknown Product',
                quantity: item.quantity || 1,
                price: getBDTPrice(item),
            })),
            customerInfo,
            paymentMethod,
            status: paymentMethod === 'cod' ? 'pending' : 'pending_payment',
            total: Number.isFinite(payableAmount) ? payableAmount : 0,
            discount,
            shippingCharge: paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' ? (Number.isFinite(shippingCharge) ? shippingCharge : 0) : 0,
        };

        try {
            console.log('Submitting Order:', orderData);
            const orderResponse = await axios.post('/api/products/orders', orderData);
            if (orderResponse.data.message === 'Order created') {
                if (paymentMethod === 'cod') {
                    localStorage.removeItem('cart');
                    window.dispatchEvent(new Event('cartUpdated'));
                    router.push(`/checkout/cod-success?orderId=${orderData.orderId}`);
                } else {
                    const sslcommerzData = {
                        store_id: process.env.NEXT_PUBLIC_SSLCZ_STORE_ID,
                        store_passwd: process.env.SSLCZ_STORE_PASSWORD,
                        total_amount: Number.isFinite(payableAmount) ? payableAmount : 0,
                        currency: 'BDT',
                        tran_id: orderData.orderId,
                        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
                        fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/fail`,
                        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
                        ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/ipn`,
                        cus_name: customerInfo.name,
                        cus_email: customerInfo.email,
                        cus_add1: customerInfo.address,
                        cus_city: customerInfo.city || 'Unknown',
                        cus_postcode: customerInfo.postcode || '0000',
                        cus_country: customerInfo.country,
                        cus_phone: customerInfo.phone,
                        shipping_method: 'NO',
                        product_name: 'Online Purchase',
                        product_category: 'General',
                        product_profile: 'general',
                    };

                    const formData = new URLSearchParams();
                    Object.keys(sslcommerzData).forEach((key) => {
                        formData.append(key, sslcommerzData[key]);
                    });

                    const response = await axios.post(
                        process.env.NEXT_PUBLIC_SSLCZ_IS_SANDBOX === 'true'
                            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
                            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php',
                        formData,
                        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
                    );

                    if (response.data.status === 'SUCCESS' && response.data.GatewayPageURL) {
                        window.location.href = response.data.GatewayPageURL;
                    } else {
                        throw new Error(response.data.error || 'Payment initiation failed');
                    }
                }
            } else {
                throw new Error('Order creation failed');
            }
        } catch (err) {
            console.error('Checkout Error:', err);
            setError(err.response?.data?.error || err.message || 'Payment processing failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-2">Secure Checkout</h1>
                    <p className="text-gray-400">Complete your purchase in just a few steps</p>
                </div>

                {error && (
                    <div className="bg-red-600/90 text-white p-4 rounded-lg mb-8 text-center animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-gray-700">
                            Your Order
                        </h2>

                        {cart.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex items-start gap-4 pb-4 border-b border-gray-700">
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <Image
                                                src={item.mainImage || '/placeholder.png'}
                                                alt={item.title || 'Product'}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-white">{item.title || 'Unknown Product'}</h3>
                                            <p className="text-gray-400 mt-1">
                                                ৳{(getBDTPrice(item) || 0).toLocaleString()} each
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                                                    className="px-2 py-1 bg-gray-600 text-white rounded-l hover:bg-gray-700"
                                                    disabled={(item.quantity || 1) <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 bg-gray-700 text-white">{item.quantity || 1}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                                                    className="px-2 py-1 bg-gray-600 text-white rounded-r hover:bg-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="ml-auto text-lg font-medium text-white">
                                            ৳{((getBDTPrice(item) || 0) * (item.quantity || 1)).toLocaleString()}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-gray-700">
                                    <div className="flex items-center gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter coupon code"
                                            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        />
                                        <button
                                            onClick={handleCouponApply}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-red-500 mb-4">{couponError}</p>
                                    )}
                                    {discount > 0 && (
                                        <p className="text-green-500 mb-4">Coupon applied! ৳{discount.toLocaleString()} discount</p>
                                    )}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-lg text-gray-400">
                                            <span>Subtotal</span>
                                            <span>৳{(subtotal || 0).toLocaleString()}</span>
                                        </div>
                                        {paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (
                                            <div className="flex justify-between text-lg text-gray-400">
                                                <span>Shipping Charge</span>
                                                <span>৳{(Number.isFinite(shippingCharge) ? shippingCharge : 0).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-lg text-gray-400">
                                            <span>Discount</span>
                                            <span>৳{(discount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-2xl font-bold text-white pt-2 border-t border-gray-700">
                                            <span>Payable Amount</span>
                                            <span>৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Checkout Form */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-xl">
                        <h2 className="text-2xl font-semibold text-white mb-6 pb-4 border-b border-gray-700">
                            Billing Details
                        </h2>

                        <form onSubmit={handleCheckout} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customerInfo.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={customerInfo.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerInfo.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Address *
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={customerInfo.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={customerInfo.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Postcode
                                    </label>
                                    <input
                                        type="text"
                                        name="postcode"
                                        value={customerInfo.postcode}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        value={customerInfo.country}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    >
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            {paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (
                                <>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">
                                            District *
                                        </label>
                                        <select
                                            name="district"
                                            value={customerInfo.district}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                            required
                                        >
                                            <option value="">Select District</option>
                                            {Object.keys(districtsThanas).map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                    </div>
                                    {customerInfo.district && (
                                        <div>
                                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                                Thana *
                                            </label>
                                            <select
                                                name="thana"
                                                value={customerInfo.thana}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                                required
                                            >
                                                <option value="">Select Thana</option>
                                                {districtsThanas[customerInfo.district]?.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="pt-4 border-t border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
                                <div className="space-y-4">
                                    {customerInfo.country === 'Bangladesh' && (
                                        <label className="flex items-start bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={() => setPaymentMethod('cod')}
                                                className="mt-1 mr-3 text-blue-500 focus:ring-blue-500"
                                            />
                                            <div>
                                                <span className="block font-medium text-white">Cash on Delivery</span>
                                                <span className="block text-sm text-gray-400 mt-1">Pay when you receive your order</span>
                                            </div>
                                        </label>
                                    )}
                                    <label className="flex items-start bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-blue-500 transition cursor-pointer">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="pay_first"
                                            checked={paymentMethod === 'pay_first'}
                                            onChange={() => setPaymentMethod('pay_first')}
                                            className="mt-1 mr-3 text-blue-500 focus:ring-blue-500"
                                        />
                                        <div>
                                            <span className="block font-medium text-white">Pay with SSLCOMMERZ</span>
                                            <span className="block text-sm text-gray-400 mt-1">Secure online payment (Cards, Mobile Banking, etc.)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || cart.length === 0}
                                className={`w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg ${loading ? 'opacity-80' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    `Complete Order - ৳${(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}`
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}