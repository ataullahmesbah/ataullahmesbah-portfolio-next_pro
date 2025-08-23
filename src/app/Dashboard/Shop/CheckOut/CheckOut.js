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
            }
        };
        fetchData();
    }, []);


    // Add this function to your checkout component
    const validateCart = async () => {
        setValidatingCart(true);
        try {
            const response = await axios.post('/api/products/cart/validate', {
                cartItems: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                }))
            });

            const { isValid, results } = response.data;

            if (!isValid) {
                // Update cart with corrected quantities
                const updatedCart = cart.map(item => {
                    const validation = results.find(r => r.productId === item._id);
                    if (!validation.valid && validation.availableQuantity !== undefined) {
                        return { ...item, quantity: validation.availableQuantity };
                    }
                    return item;
                });

                setCart(updatedCart);
                localStorage.setItem('cart', JSON.stringify(updatedCart));
                window.dispatchEvent(new Event('cartUpdated'));

                // Show error messages
                results.forEach(result => {
                    if (!result.valid && result.message) {
                        toast.error(result.message);
                    }
                });

                return false;
            }

            return true;
        } catch (error) {
            console.error('Cart validation error:', error);
            toast.error('Failed to validate cart items');
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
            // Validate with backend before changing quantity
            const response = await axios.get(`/api/products/${productId}`);
            const product = response.data;

            if (newQuantity > product.quantity) {
                toast.error(`Only ${product.quantity} units available`);
                return;
            }

            if (newQuantity > 3) {
                toast.error('Maximum 3 units per product');
                return;
            }

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
        } catch (error) {
            console.error('Error validating product stock:', error);
            toast.error('Error checking product availability');
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
            console.log('Coupon validate response:', response.data);
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
            console.error('Error applying coupon:', err.response?.data || err.message);
            setCouponError('Error applying coupon. Please try again.');
            toast.error('Error applying coupon. Please try again.');
        }
    };


    const generateOrderId = () => {
        return 'ORDER_' + Math.random().toString(36).substr(2, 9).toUpperCase();
    };

    const payableAmount = subtotal - discount + (paymentMethod === 'cod' && customerInfo.country === 'Bangladesh' ? (Number.isFinite(shippingCharge) ? shippingCharge : 0) : 0);

    // Then update your handleCheckout function to call validateCart first
    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validate cart with backend first
        const isCartValid = await validateCart();
        if (!isCartValid) {
            setLoading(false);
            return;
        }

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

        console.log('Sending order data:', orderData);

        try {
            const orderResponse = await axios.post('/api/products/orders', orderData);
            console.log('Order creation response:', orderResponse.data);
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

                    console.log('SSLCOMMERZ response:', response.data);
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
            console.error('Checkout error:', err.response?.data || err.message);
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 py-8 px-4 sm:px-6 lg:px-8 border-b border-b-gray-800">
            <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: '#333', color: '#fff' } }} />
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-medium mb-2">Checkout</h1>
                    <p className="text-gray-400">Complete your purchase</p>
                </div>

                {error && (
                    <div className="bg-red-600/90 text-white p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Billing Details */}
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

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        {/* Order Items */}
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
                                                <div className="flex items-center mt-1">
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, (item.quantity || 1) - 1)}
                                                        className="px-2 py-1 bg-gray-700 text-white rounded-l hover:bg-gray-600"
                                                        disabled={(item.quantity || 1) <= 1 || validatingCart}
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-3 py-1 bg-gray-700 text-sm">{item.quantity || 1}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item._id, (item.quantity || 1) + 1)}
                                                        className="px-2 py-1 bg-gray-700 text-white rounded-r hover:bg-gray-600"
                                                        disabled={validatingCart}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-sm">
                                                ৳{((getBDTPrice(item) || 0) * (item.quantity || 1)).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Coupon Code */}
                                    <div className="pt-2">
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Coupon code"
                                                className="flex-1 bg-gray-700 border border-gray-600 rounded-md p-2 text-sm focus:outline-none focus:border-purple-500"
                                            />
                                            <button
                                                onClick={handleCouponApply}
                                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-500 text-xs">{couponError}</p>}
                                        {discount > 0 && (
                                            <p className="text-green-500 text-xs">
                                                Coupon applied! ৳{discount.toLocaleString()} discount
                                            </p>
                                        )}
                                    </div>

                                    {/* Order Totals */}
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

                        {/* Payment Method */}
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
                                        <span className="block">SSLCOMMERZ</span>
                                        <span className="text-gray-400 text-xs">Cards, Mobile Banking, etc.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Place Order Button */}
                        <button
                            type="submit"
                            onClick={handleCheckout}
                            disabled={loading || cart.length === 0}
                            className={`w-full py-3 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition ${loading ? 'opacity-70' : ''}`}
                        >
                            {loading ? (
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
        </div>
    );
}