// /app/checkout/OnlinePayment.js
'use client';
import { useState } from 'react';

export default function OnlinePayment({
    customerInfo,
    payableAmount,
    orderData,
    onPaymentSuccess,
    onPaymentError,
    loading
}) {
    const [paymentLoading, setPaymentLoading] = useState(false);

    const initiateSSLCommerzPayment = async () => {
        setPaymentLoading(true);
        try {
            const response = await fetch('/api/payment/sslcommerz-initiate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    total_amount: payableAmount,
                    customerInfo: customerInfo,
                    orderData: orderData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Payment initiation failed');
            }

            if (data.status === 'SUCCESS' && data.GatewayPageURL) {
                // Redirect to SSLCommerz payment page
                window.location.href = data.GatewayPageURL;
            } else {
                throw new Error(data.failedreason || 'Payment initiation failed');
            }
        } catch (error) {
            console.error('Payment initiation error:', error);
            onPaymentError(error.message);
        } finally {
            setPaymentLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Secure Online Payment</h3>
            </div>

            <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="text-center mb-3">
                        <p className="text-sm text-gray-300">Total Amount to Pay</p>
                        <p className="text-2xl font-bold text-green-400">
                            ৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                        <div className="text-center p-2 bg-gray-700/50 rounded">
                            💳 Cards
                        </div>
                        <div className="text-center p-2 bg-gray-700/50 rounded">
                            📱 Mobile Banking
                        </div>
                        <div className="text-center p-2 bg-gray-700/50 rounded">
                            🏦 Internet Banking
                        </div>
                        <div className="text-center p-2 bg-gray-700/50 rounded">
                            📲 Wallet
                        </div>
                    </div>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>256-bit SSL secured payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Your data is safe and encrypted</span>
                    </div>
                </div>

                <button
                    onClick={initiateSSLCommerzPayment}
                    disabled={paymentLoading || loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {paymentLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Pay Now - ৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}
                        </>
                    )}
                </button>

                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        You will be redirected to SSLCommerz secure payment page
                    </p>
                </div>
            </div>
        </div>
    );
}