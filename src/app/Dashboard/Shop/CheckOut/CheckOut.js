'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function Checkout() {
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postcode: '',
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
    const [validatingCart, setValidatingCart] = useState(false);

    const toggleCoupon = () => {
        setIsCouponOpen(!isCouponOpen);
    };

    // Custom Toast Function
    const showCustomToast = (message, type = 'info') => {
        const existingToast = document.querySelector('.custom-toast-checkout');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }

        const toastElement = document.createElement('div');
        toastElement.className = `custom-toast-checkout custom-toast-${type}`;

        const icons = {
            success: `
                <svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
            `,
            error: `
                <svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
            `,
            info: `
                <svg xmlns="http://www.w3.org/2000/svg" class="toast-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
            `
        };

        toastElement.innerHTML = `
            <div class="toast-content">
                ${icons[type]}
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(toastElement);

        setTimeout(() => {
            toastElement.classList.add('show');
        }, 10);

        setTimeout(() => {
            toastElement.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toastElement)) {
                    document.body.removeChild(toastElement);
                }
            }, 300);
        }, 4000);
    };

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
                console.error('Error fetching checkout data:', error);
                setError('Failed to load checkout data. Please refresh the page.');
                showCustomToast('Failed to load checkout data. Please refresh the page.', 'error');
            }
        };
        fetchData();
    }, []);

    const validateCart = async () => {
        setValidatingCart(true);
        try {
            const validationPromises = cart.map(async (item) => {
                try {
                    const response = await axios.post('/api/products/cart/validate', {
                        productId: item._id,
                        quantity: item.quantity,
                        size: item.size || null
                    });
                    return { ...response.data, productId: item._id, size: item.size || null, title: item.title };
                } catch (error) {
                    console.error(`Error validating product ${item._id}:`, error);
                    return {
                        valid: false,
                        message: error.response?.data?.message || 'Error validating item',
                        productId: item._id,
                        size: item.size || null,
                        title: item.title
                    };
                }
            });

            const results = await Promise.all(validationPromises);
            const invalidItems = results.filter(result => !result.valid);

            if (invalidItems.length > 0) {
                const updatedCart = cart.map(item => {
                    const validation = results.find(r => r.productId === item._id && (r.size || null) === (item.size || null));
                    if (!validation.valid && validation.availableQuantity !== undefined) {
                        showCustomToast(
                            `Adjusted quantity to ${validation.availableQuantity} for ${item.title}${item.size ? ` (size: ${item.size})` : ''}`,
                            'info'
                        );
                        return { ...item, quantity: validation.availableQuantity };
                    }
                    return item;
                });

                setCart(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                window.dispatchEvent(new Event('cartUpdated'));

                invalidItems.forEach(result => {
                    showCustomToast(
                        `${result.title || 'Product'}: ${result.message}${result.size ? ` (size: ${result.size})` : ''}`,
                        'error'
                    );
                });

                return false;
            }

            return true;
        } catch (error) {
            console.error('Cart validation error:', error);
            showCustomToast('Failed to validate cart items', 'error');
            return false;
        } finally {
            setValidatingCart(false);
        }
    };

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

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1 || !productId) return;

        try {
            const response = await axios.get(`/api/products/${productId}`);
            const product = response.data;

            if (newQuantity > product.quantity) {
                showCustomToast(`Only ${product.quantity} units available for ${product.title}`, 'error');
                return;
            }

            if (newQuantity > 3) {
                showCustomToast(`Maximum 3 units allowed for ${product.title}`, 'error');
                return;
            }

            const updatedCart = cart.map(item =>
                item._id === productId ? { ...item, quantity: newQuantity } : item
            );
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            window.dispatchEvent(new Event('cartUpdated'));

            showCustomToast(`Quantity updated to ${newQuantity} for ${product.title}`, 'success');

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
                        showCustomToast('Coupon no longer applicable.', 'error');
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
                        showCustomToast(`Cart total must be at least ৳${appliedCoupon.minCartTotal}`, 'error');
                    }
                }
            }
        } catch (error) {
            console.error('Error validating product stock:', error);
            showCustomToast('Error checking product availability', 'error');
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
                showCustomToast('No valid products in cart.', 'error');
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
                        showCustomToast('Coupon not applicable to cart items.', 'error');
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
                    showCustomToast(`Coupon ${couponCode} applied successfully!`, 'success');
                } else if (response.data.type === 'global') {
                    const discountAmount = response.data.discountAmount;
                    setDiscount(Number.isFinite(discountAmount) ? discountAmount : 0);
                    setAppliedCoupon({
                        code: couponCode,
                        type: 'global',
                        discountAmount,
                        minCartTotal: response.data.minCartTotal || 0,
                    });
                    showCustomToast(`Coupon ${couponCode} applied successfully!`, 'success');
                }
            } else {
                setCouponError(response.data.message || 'Invalid coupon code.');
                showCustomToast(response.data.message || 'Invalid coupon code.', 'error');
            }
        } catch (err) {
            console.error('Error applying coupon:', err.response?.data || err.message);
            setCouponError('Error applying coupon. Please try again.');
            showCustomToast('Error applying coupon. Please try again.', 'error');
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

        const isCartValid = await validateCart();
        if (!isCartValid) {
            setLoading(false);
            return;
        }

        if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
            setError('Please fill in all required fields.');
            showCustomToast('Please fill in all required fields.', 'error');
            setLoading(false);
            return;
        }

        if (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (!customerInfo.district || !customerInfo.thana)) {
            setError('Please select district and thana for COD.');
            showCustomToast('Please select district and thana for COD.', 'error');
            setLoading(false);
            return;
        }

        if (!cart.length) {
            setError('Your cart is empty.');
            showCustomToast('Your cart is empty.', 'error');
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
                size: item.size || null
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
                    await axios.post('/api/products/coupons/record-usage', {
                        userId,
                        couponCode: appliedCoupon.code,
                        email: customerInfo.email,
                        phone: customerInfo.phone,
                    });
                }
                if (paymentMethod === 'cod') {
                    localStorage.removeItem('cart');
                    window.dispatchEvent(new Event('cartUpdated'));
                    showCustomToast(`Order ${orderData.orderId} placed successfully!`, 'success');
                    setLoading(true); // Keep button disabled during redirect
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
                        showCustomToast('Redirecting to payment gateway...', 'info');
                        setLoading(true); // Keep button disabled during redirect
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
            console.error('Checkout error:', err.response?.data || err.message);
            setError(errorMessage);
            showCustomToast(errorMessage, 'error');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4 sm:px-6 lg:px-8 border-b border-b-gray-800">
            <div className="max-w-6xl mx-auto">


                <div className="text-center poppins-regular mb-8 py-5 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/60 backdrop-blur-md shadow-xl">
                    {/* Animated icon */}
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-3 shadow-lg animate-pulse hover:animate-none hover:scale-110 transition-transform duration-300">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Secure Checkout
                    </h1>

                    {/* Subtitle with brand */}
                    <p className="text-gray-300 text-sm mb-2">
                        Complete your order with <span className="text-purple-300 font-semibold">Sooqra One</span>
                    </p>

                    {/* Mini progress bar */}
                    <div className="w-16 h-0.5 bg-gray-700 rounded-full mx-auto overflow-hidden">
                        <div className="w-3/4 h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-600/90 text-white p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-medium mb-6">Billing Details</h2>
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={customerInfo.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={customerInfo.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Phone Number *</label>
                                <PhoneInput
                                    country={'bd'}
                                    value={customerInfo.phone}
                                    onChange={handlePhoneChange}
                                    inputClass="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
                                    buttonClass="bg-gray-700 border-gray-600"
                                    dropdownClass="bg-gray-800 border-gray-600"
                                    containerClass="w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Address *</label>
                                <textarea
                                    name="address"
                                    value={customerInfo.address}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
                                    rows="2"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm mb-1">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={customerInfo.city}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Postcode</label>
                                    <input
                                        type="text"
                                        name="postcode"
                                        value={customerInfo.postcode}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Country</label>
                                <select
                                    name="country"
                                    value={customerInfo.country}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
                                >
                                    <option value="Bangladesh">Bangladesh</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (
                                <>
                                    <div>
                                        <label className="block text-sm mb-1">District *</label>
                                        <select
                                            name="district"
                                            value={customerInfo.district}
                                            onChange={handleInputChange}
                                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
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
                                            <label className="block text-sm mb-1">Thana *</label>
                                            <select
                                                name="thana"
                                                value={customerInfo.thana}
                                                onChange={handleInputChange}
                                                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:outline-none focus:border-purple-500"
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
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-medium mb-4">Your Order</h2>

                            {validatingCart && (
                                <div className="text-center py-4">
                                    <div className="inline-flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Validating cart...
                                    </div>
                                </div>
                            )}

                            {cart.length === 0 ? (
                                <p className="text-gray-400">Your cart is empty</p>
                            ) : (
                                <div className="space-y-4">
                                    {cart.map((item) => (
                                        <div key={item._id} className="flex items-start gap-4 pb-4 border-b border-gray-700">
                                            <div className="relative w-16 h-16 flex-shrink-0">
                                                <Image
                                                    src={item.mainImage || '/placeholder.png'}
                                                    alt={item.title || 'Product'}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm">{item.title || 'Unknown Product'}</h3>
                                                <p className="text-gray-400 text-xs">
                                                    ৳{(getBDTPrice(item) || 0).toLocaleString()} × {item.quantity || 1}
                                                </p>
                                                {item.size && <p className="text-xs text-gray-300">Size: {item.size}</p>}
                                            </div>
                                            <div className="text-sm">
                                                ৳{((getBDTPrice(item) || 0) * (item.quantity || 1)).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleCoupon}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-purple-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                                />
                                            </svg>
                                            <span className="text-sm text-purple-400 hover:text-purple-300">Have a Coupon?</span>
                                        </div>
                                        <div
                                            className={`coupon-box overflow-hidden transition-all duration-300 ease-in-out ${isCouponOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 mt-2 relative">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                    placeholder="Enter coupon code"
                                                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:border-purple-500"
                                                />
                                                <button
                                                    onClick={handleCouponApply}
                                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                                                >
                                                    Apply
                                                </button>
                                                <button
                                                    onClick={toggleCoupon}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-600 rounded-full"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 text-gray-400 hover:text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-red-400 text-xs mt-2">{couponError}</p>
                                            )}
                                            {discount > 0 && (
                                                <p className="text-green-400 text-xs mt-2">
                                                    Coupon applied! ৳{discount.toLocaleString()} discount
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>৳{(subtotal || 0).toLocaleString()}</span>
                                        </div>
                                        {paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' && (
                                            <div className="flex justify-between text-sm">
                                                <span>Shipping</span>
                                                <span>৳{(Number.isFinite(shippingCharge) ? shippingCharge : 0).toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span>Discount</span>
                                            <span>-৳{(discount || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-medium pt-2 border-t border-gray-700">
                                            <span>Total</span>
                                            <span>৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                {customerInfo.country === 'Bangladesh' && (
                                    <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-purple-500">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === 'cod'}
                                            onChange={() => setPaymentMethod('cod')}
                                            className="text-purple-500 focus:ring-purple-500"
                                        />
                                        <div>
                                            <span className="block">Cash on Delivery</span>
                                            <span className="text-gray-400 text-xs">Pay when you receive your order</span>
                                        </div>
                                    </label>
                                )}
                                <label className="flex items-center gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-purple-500">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="pay_first"
                                        checked={paymentMethod === 'pay_first'}
                                        onChange={() => setPaymentMethod('pay_first')}
                                        className="text-purple-500 focus:ring-purple-500"
                                    />
                                    <div>
                                        <span className="block">Online Payment</span>
                                        <span className="text-gray-400 text-xs">Cards, Mobile Banking, etc.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0 || validatingCart}
                            className={`w-full py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition ${loading || validatingCart ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading || validatingCart ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                `Place Order - ৳${(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}`
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-toast-checkout {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d1b4e 100%);
                    color: #fff;
                    padding: 16px 20px;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(128, 0, 128, 0.3);
                    border-left: 4px solid #8b5cf6;
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1001;
                    max-width: 320px;
                    backdrop-filter: blur(10px);
                }

                .custom-toast-checkout.show {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .custom-toast-success {
                    border-left-color: #10b981;
                    background: linear-gradient(135deg, #1a1a1a 0%, #064e3b 100%);
                }

                .custom-toast-error {
                    border-left-color: #ef4444;
                    background: linear-gradient(135deg, #1a1a1a 0%, #7f1d1d 100%);
                }

                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .toast-icon {
                    width: 20px;
                    height: 20px;
                    color: #8b5cf6;
                    flex-shrink: 0;
                }

                .custom-toast-success .toast-icon {
                    color: #10b981;
                }

                .custom-toast-error .toast-icon {
                    color: #ef4444;
                }

                .toast-message {
                    flex: 1;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .toast-close {
                    background: none;
                    border: none;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: all 0.2s;
                }

                .toast-close:hover {
                    color: #fff;
                    background: rgba(255,255,255,0.1);
                }
                    .coupon-box {
                    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
                }
                .coupon-box.max-h-0 {
                    max-height: 0;
                    opacity: 0;
                }
                .coupon-box.max-h-40 {
                    max-height: 10rem; /* Adjust based on content height */
                }
                .coupon-box input {
                    padding-right: 2.5rem; /* Space for close icon */
                }
                .coupon-box button:hover {
                    transform: scale(1.05);
                }
                .coupon-box .text-red-400,
                .coupon-box .text-green-400 {
                    font-weight: 500;
                    padding: 0.5rem;
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.05);
                }
            `}</style>
        </div>
    );
}