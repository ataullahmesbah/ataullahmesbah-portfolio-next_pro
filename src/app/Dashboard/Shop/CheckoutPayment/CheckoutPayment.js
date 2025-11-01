'use client';

import { useState } from 'react';

export default function CheckoutPayment({
    paymentMethod,
    setPaymentMethod,
    customerInfo,
    loading,
    bkashNumber,
    setBkashNumber,
    transactionId,
    setTransactionId,
    acceptedTerms,
    setAcceptedTerms
}) {
    const handleBkashNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            setBkashNumber(value);
        }
    };

    const handleTransactionIdChange = (e) => {
        const value = e.target.value.toUpperCase();
        setTransactionId(value);
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Payment Method</h2>

            <div className="space-y-3 mb-6">
                {/* Cash on Delivery */}
                {customerInfo.country === 'Bangladesh' && (
                    <label className="flex items-start gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-purple-500 transition-colors">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="text-purple-500 focus:ring-purple-500 mt-1"
                            disabled={loading}
                        />
                        <div className="flex-1">
                            <span className="block font-medium text-white">Cash on Delivery</span>
                            <span className="text-gray-400 text-sm">Pay when you receive your order</span>
                        </div>
                    </label>
                )}

                {/* Bkash Payment */}
                {customerInfo.country === 'Bangladesh' && (
                    <label className="flex items-start gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-purple-500 transition-colors">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="bkash"
                            checked={paymentMethod === 'bkash'}
                            onChange={() => setPaymentMethod('bkash')}
                            className="text-purple-500 focus:ring-purple-500 mt-1"
                            disabled={loading}
                        />
                        <div className="flex-1">
                            <span className="block font-medium text-white">Bkash Payment</span>
                            <span className="text-gray-400 text-sm">Instant payment via Bkash</span>

                            {/* Bkash Payment Instructions */}
                            {paymentMethod === 'bkash' && (
                                <div className="mt-3 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                                    <div className="space-y-3">
                                        {/* Step 1 */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                1
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">Open your Bkash App</p>
                                                <p className="text-xs text-gray-400">Go to your Bkash mobile application</p>
                                            </div>
                                        </div>

                                        {/* Step 2 */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                2
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">Make Payment</p>
                                                <p className="text-xs text-gray-400">
                                                    Send money to: <span className="text-green-400 font-mono">01880000000</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Step 3 */}
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                3
                                            </div>
                                            <div>
                                                <p className="text-sm text-white font-medium">Enter Details</p>
                                                <p className="text-xs text-gray-400">Fill in your payment details below</p>
                                            </div>
                                        </div>

                                        {/* Bkash Form Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                                    Your Bkash Number *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                                                        +88
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={bkashNumber}
                                                        onChange={handleBkashNumberChange}
                                                        placeholder="01XXXXXXXXX"
                                                        className="w-full bg-gray-700 border border-gray-600 rounded-md pl-12 pr-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                                                        maxLength={11}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-medium text-gray-300 mb-1">
                                                    Transaction ID *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={transactionId}
                                                    onChange={handleTransactionIdChange}
                                                    placeholder="e.g., 8A7B9C6D"
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 font-mono"
                                                    maxLength={20}
                                                />
                                            </div>
                                        </div>

                                        {/* Validation Note */}
                                        <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                            <p className="text-xs text-yellow-400 text-center">
                                                Please ensure the Bkash number and Transaction ID are correct. We'll verify your payment.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </label>
                )}

                {/* Online Payment */}
                <label className="flex items-start gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="pay_first"
                        checked={paymentMethod === 'pay_first'}
                        onChange={() => setPaymentMethod('pay_first')}
                        className="text-purple-500 focus:ring-purple-500 mt-1"
                        disabled={loading}
                    />
                    <div className="flex-1">
                        <span className="block font-medium text-white">Online Payment</span>
                        <span className="text-gray-400 text-sm">Cards, Mobile Banking, etc.</span>
                    </div>
                </label>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t border-gray-700 pt-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="text-purple-500 focus:ring-purple-500 mt-1 rounded"
                        disabled={loading}
                    />
                    <div className="flex-1">
                        <span className={`text-sm ${acceptedTerms ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors`}>
                            I accept the{' '}
                            <a
                                href="/terms"
                                target="_blank"
                                className="text-purple-400 hover:text-purple-300 underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Terms & Conditions
                            </a>
                            ,{' '}
                            <a
                                href="/refund-policy"
                                target="_blank"
                                className="text-purple-400 hover:text-purple-300 underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Return & Refund Policy
                            </a>
                            {' '}and{' '}
                            <a
                                href="/privacy-policy"
                                target="_blank"
                                className="text-purple-400 hover:text-purple-300 underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Privacy Policy
                            </a>
                            {' '}of oubd.shop
                        </span>
                    </div>
                </label>
            </div>

            {/* Validation Messages */}
            {paymentMethod === 'bkash' && (!bkashNumber || !transactionId) && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-red-400 text-center">
                        Please provide both Bkash number and Transaction ID to proceed.
                    </p>
                </div>
            )}

            {!acceptedTerms && (
                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-red-400 text-center">
                        Please accept the Terms & Conditions to place your order.
                    </p>
                </div>
            )}
        </div>
    );
}