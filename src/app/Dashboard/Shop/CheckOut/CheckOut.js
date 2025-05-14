'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
    const [userId, setUserId] = useState('mock-user-id');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
                setCart(storedCart);

                const districtsResponse = await axios.get('/api/products/districts-thanas');
                setDistrictsThanas(districtsResponse.data);

                const shippingResponse = await axios.get('/api/products/shipping-charges');
                const chargeMap = { 'Dhaka-Chattogram': 0, 'Others': 0 };
                shippingResponse.data.forEach(c => {
                    if (c.type === 'Dhaka-Chattogram' || c.type === 'Others') {
                        chargeMap[c.type] = c.charge || 0;
                    }
                });
                setShippingCharges(chargeMap);

                if (customerInfo.district) {
                    const charge = customerInfo.district === 'Dhaka' || customerInfo.district === 'Chattogram' || customerInfo.district === 'Chittagong'
                        ? chargeMap['Dhaka-Chattogram']
                        : chargeMap['Others'];
                    setShippingCharge(Number.isFinite(charge) ? charge : 0);
                }
            } catch (error) {
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

    const handlePhoneChange = (phone) => {
        setCustomerInfo((prev) => ({ ...prev, phone }));
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1 || !productId) return;
        const updatedCart = cart.map(item =>
            item._id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
        if (appliedCoupon) {
            if (appliedCoupon.type === 'product') {
                const cartItem = updatedCart.find(item => item._id === appliedCoupon.productId);
                if (cartItem) {
                    const discountAmount = (getBDTPrice(cartItem) * appliedCoupon.discountPercentage) / 100;
                    setDiscount(Number.isFinite(discountAmount) ? discountAmount : 0);
                } else {
                    setDiscount(0);
                    setAppliedCoupon(null);
                    setCouponCode('');
                    setCouponError('Coupon no longer applicable.');
                    toast.error('Coupon no longer applicable.');
                }
            } else if (appliedCoupon.type === 'global') {
                const subtotal = updatedCart.reduce((sum, item) => sum + getBDTPrice(item) * (item.quantity || 1), 0);
                if (subtotal >= appliedCoupon.minCartTotal) {
                    setDiscount(Number.isFinite(appliedCoupon.discountAmount) ? appliedCoupon.discountAmount : 0);
                } else {
                    setDiscount(0);
                    setAppliedCoupon(null);
                    setCouponCode('');
                    setCouponError(`Cart total must be at least ৳${appliedCoupon.minCartTotal}`);
                    toast.error(`Cart total must be at least ৳${appliedCoupon.minCartTotal}`);
                }
            }
        }
    };

    const subtotal = cart.reduce((sum, item) => sum + getBDTPrice(item) * (item.quantity || 1), 0);

    const handleCouponApply = async () => {
        setCouponError('');
        setDiscount(0);
        setAppliedCoupon(null);
        try {
            const productIds = cart.map(item => item._id).filter(id => id);
            if (!productIds.length) {
                setCouponError('No valid products in cart.');
                toast.error('No valid products in cart.');
                return;
            }
            const response = await axios.post('/api/products/coupons/validate', {
                code: couponCode,
                productIds,
                userId,
                cartTotal: subtotal,
                email: customerInfo.email,
                phone: customerInfo.phone,
            });
            if (response.data.valid) {
                if (response.data.type === 'product') {
                    const cartItem = cart.find(item => item._id === response.data.productId?.toString());
                    if (!cartItem) {
                        setCouponError('Coupon not applicable to cart items.');
                        toast.error('Coupon not applicable to cart items.');
                        return;
                    }
                    const discountAmount = (getBDTPrice(cartItem) * response.data.discountPercentage) / 100;
                    setDiscount(Number.isFinite(discountAmount) ? discountAmount : 0);
                    setAppliedCoupon({
                        code: couponCode,
                        type: 'product',
                        productId: response.data.productId,
                        discountPercentage: response.data.discountPercentage,
                    });
                    toast.success('Coupon applied successfully!');
                } else if (response.data.type === 'global') {
                    const discountAmount = response.data.discountAmount;
                    setDiscount(Number.isFinite(discountAmount) ? discountAmount : 0);
                    setAppliedCoupon({
                        code: couponCode,
                        type: 'global',
                        discountAmount,
                        minCartTotal: response.data.minCartTotal || 0,
                    });
                    toast.success('Coupon applied successfully!');
                }
            } else {
                setCouponError(response.data.message || 'Invalid coupon code.');
                toast.error(response.data.message || 'Invalid coupon code.');
            }
        } catch (err) {
            setCouponError('Error applying coupon. Please try again.');
            toast.error('Error applying coupon. Please try again.');
        }
    };

    const generateOrderId = () => {
        return 'ORDER_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const payableAmount = subtotal - discount + (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' ? (Number.isFinite(shippingCharge) ? shippingCharge : 0) : 0);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
            setError('Please fill in all required fields.');
            toast.error('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        if (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (!customerInfo.district || !customerInfo.thana)) {
            setError('Please select district and thana for COD.');
            toast.error('Please select district and thana for COD.');
            setLoading(false);
            return;
        }

        if (!cart.length) {
            setError('Your cart is empty.');
            toast.error('Your cart is empty.');
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
            couponCode: appliedCoupon ? appliedCoupon.code : null,
        };

        try {
            const orderResponse = await axios.post('/api/products/orders', orderData);
            if (orderResponse.data.message === 'Order created') {
                if (appliedCoupon) {
                    try {
                        await axios.post('/api/products/coupons/record-usage', {
                            userId,
                            couponCode: appliedCoupon.code,
                            email: customerInfo.email,
                            phone: customerInfo.phone,
                        });
                    } catch (usageError) {
                        setError(usageError.response?.data?.error || 'Failed to record coupon usage.');
                        toast.error(usageError.response?.data?.error || 'Failed to record coupon usage.');
                        setLoading(false);
                        return;
                    }
                }
                if (paymentMethod === 'cod') {
                    localStorage.removeItem('cart');
                    window.dispatchEvent(new Event('cartUpdated'));
                    toast.success('Order placed successfully!', { duration: 3000 });
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
                        toast.success('Redirecting to payment gateway...');
                        window.location.href = response.data.GatewayPageURL;
                    } else {
                        throw new Error(response.data.error || 'Payment initiation failed');
                    }
                }
            } else {
                throw new Error('Order creation failed');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Payment processing failed';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-6 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Secure Checkout</h1>
                    <p className="text-gray-400 text-sm sm:text-base">Complete your purchase in just a few steps</p>
                </div>

                {error && (
                    <div className="bg-red-600/90 text-white p-4 rounded-lg mb-8 text-center animate-fade-in">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 pb-4 border-b border-gray-700">
                            Your Order
                        </h2>

                        {cart.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4 sm:space-y-6">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex items-start gap-4 pb-4 border-b border-gray-700">
                                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                                            <Image
                                                src={item.mainImage || '/placeholder.png'}
                                                alt={item.title || 'Product'}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base sm:text-lg font-medium text-white">{item.title || 'Unknown Product'}</h3>
                                            <p className="text-gray-400 mt-1 text-sm sm:text-base">
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
                                                <span className="px-3 sm:px-4 py-1 bg-gray-700 text-white text-sm sm:text-base">{item.quantity || 1}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                                                    className="px-2 py-1 bg-gray-600 text-white rounded-r hover:bg-gray-700"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="ml-auto text-base sm:text-lg font-medium text-white">
                                            ৳{((getBDTPrice(item) || 0) * (item.quantity || 1)).toLocaleString()}
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-4 border-t border-gray-700">
                                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Enter coupon code"
                                            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm sm:text-base"
                                        />
                                        <button
                                            onClick={handleCouponApply}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p className="text-red-500 mb-4 text-sm sm:text-base">{couponError}</p>
                                    )}
                                    {discount > 0 && (
                                        <p className="text-green-500 mb-4 text-sm sm:text-base">
                                            Coupon applied! ৳{discount.toLocaleString()} discount
                                            {appliedCoupon?.type === 'product' && ` on ${cart.find(item => item._id === appliedCoupon.productId)?.title || 'product'}`}
                                        </p>
                                    )}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm sm:text-lg text-gray-400">
                                            <span>Subtotal</span>
                                            <span>৳{(subtotal || 0).toLocaleString()}</span>
                                        </div>
                                        {paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (
                                            <div className="flex justify-between text-sm sm:text-lg text-gray-400">
                                                <span>Shipping Charge</span>
                                                <span>৳{(Number.isFinite(shippingCharge) ? shippingCharge : 0).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm sm:text-lg text-gray-400">
                                            <span>Discount</span>
                                            <span>৳{(discount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg sm:text-2xl font-bold text-white pt-2 border-t border-gray-700">
                                            <span>Payable Amount</span>
                                            <span>৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 sm:p-6 shadow-xl">
                        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 pb-4 border-b border-gray-700">
                            Billing Details
                        </h2>

                        <form onSubmit={handleCheckout} className="space-y-4 sm:space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={customerInfo.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">
                                    Phone Number *
                                </label>
                                <PhoneInput
                                    country={'bd'}
                                    value={customerInfo.phone}
                                    onChange={handlePhoneChange}
                                    inputClass="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    buttonClass="bg-gray-700 border-gray-600"
                                    dropdownClass="bg-gray-700 text-white border-gray-600"
                                    containerClass="w-full"
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
                                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={customerInfo.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                                        className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                                            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                                                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-2 sm:py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">Payment Method</h3>
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
                                                <span className="block font-medium text-white text-sm sm:text-base">Cash on Delivery</span>
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
                                            <span className="block font-medium text-white text-sm sm:text-base">Pay with SSLCOMMERZ</span>
                                            <span className="block text-sm text-gray-400 mt-1">Secure online payment (Cards, Mobile Banking, etc.)</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || cart.length === 0}
                                className={`w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition shadow-lg ${loading ? 'opacity-80' : ''} text-sm sm:text-base`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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