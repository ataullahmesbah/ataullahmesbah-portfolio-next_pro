'use client';
import { useState } from 'react';
import Image from 'next/image';
import bkash from '../../../../../public/images/shop/bkash.png';

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
    setAcceptedTerms,
    payableAmount,
    subtotal,
    discount,
    shippingCharge
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
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-medium mb-4">Payment Method</h2>

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
                            className="text-purple-500 focus:ring-purple-500 mt-1 flex-shrink-0"
                            disabled={loading}
                        />
                        <div className="flex-1 min-w-0">
                            <span className="block font-medium text-white text-sm sm:text-base">Cash on Delivery</span>
                            <span className="text-gray-400 text-xs sm:text-sm break-words">
                                Pay ৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()} when you receive your order
                                {shippingCharge > 0 && ` (Includes ৳${shippingCharge.toLocaleString()} shipping)`}
                            </span>
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
                            className="text-purple-500 focus:ring-purple-500 mt-1 flex-shrink-0"
                            disabled={loading}
                        />
                        <div className="flex-1 min-w-0">
                            <span className="block font-medium text-white text-sm sm:text-base">bKash Payment</span>
                            <span className="text-gray-400 text-xs sm:text-sm break-words">
                                Pay ৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()} via bKash
                                {shippingCharge > 0 && ` (Includes ৳${shippingCharge.toLocaleString()} shipping)`}
                            </span>

                            {/* Bkash Payment Instructions */}
                            {paymentMethod === 'bkash' && (
                                <div className="mt-3 p-3 sm:p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                                    <div className="space-y-3 sm:space-y-4">
                                        {/* Header */}
                                        <div className="text-center mb-3 sm:mb-4">
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
                                                    <Image
                                                        src={bkash}
                                                        alt="bKash"
                                                        width={20}
                                                        height={20}
                                                        className="object-contain w-5 h-5 sm:w-6 sm:h-6"
                                                    />
                                                </div>
                                                <span className="text-lg sm:text-xl font-bold text-gray-100">bKash</span>
                                            </div>
                                        </div>

                                        {/* Steps */}
                                        <div className="space-y-2 sm:space-y-3">
                                            {[
                                                { step: '01', text: 'Go to your bKash app or Dial *247#' },
                                                { step: '02', text: 'Choose Payment' },
                                                { step: '03', text: 'Enter below Merchant Account Number' },
                                                { step: '04', text: 'Enter total amount' },
                                                { step: '06', text: 'Now enter your bKash Account PIN to confirm the transaction' },
                                                { step: '07', text: 'Copy Transaction ID from payment confirmation message and paste that Transaction ID below' }
                                            ].map((item, index) => (
                                                <div key={index} className="flex items-start gap-2 sm:gap-3">
                                                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                                        {item.step}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs sm:text-sm text-white break-words">
                                                            {item.text.includes('*247#') ? (
                                                                <>
                                                                    Go to your bKash app or Dial <span className="text-green-400 font-mono">*247#</span>
                                                                </>
                                                            ) : item.text.includes('total amount') ? (
                                                                <>
                                                                    Enter <span className="text-yellow-400 font-bold">total amount</span>
                                                                </>
                                                            ) : (
                                                                item.text
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Payment Details Box */}
                                        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30">
                                            <div className="text-center mb-3">
                                                <p className="text-xs sm:text-sm text-gray-300">You need to send us</p>
                                                <p className="text-xl sm:text-2xl font-bold text-yellow-400 break-all">
                                                    ৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()}
                                                </p>
                                                <div className="flex flex-col sm:flex-row sm:justify-center sm:gap-4 mt-1">
                                                    {shippingCharge > 0 && (
                                                        <p className="text-xs text-gray-400">
                                                            Includes ৳{shippingCharge.toLocaleString()} shipping
                                                        </p>
                                                    )}
                                                    {discount > 0 && (
                                                        <p className="text-xs text-green-400">
                                                            Includes ৳{discount.toLocaleString()} discount
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1">
                                                    <span className="text-xs sm:text-sm text-gray-300">Account Type:</span>
                                                    <span className="text-xs sm:text-sm font-bold text-green-400">Merchant</span>
                                                </div>
                                                <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1">
                                                    <span className="text-xs sm:text-sm text-gray-300">Account Number:</span>
                                                    <span className="text-sm sm:text-lg font-bold text-white font-mono break-all">01881334450</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bkash Form Fields */}
                                        <div className="grid grid-cols-1 gap-3 sm:gap-4 mt-3 sm:mt-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                                    Your bKash Account Number *
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm">
                                                        +88
                                                    </span>
                                                    <input
                                                        type="text"
                                                        value={bkashNumber}
                                                        onChange={handleBkashNumberChange}
                                                        placeholder="01XXXXXXXXX"
                                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 sm:pl-12 pr-3 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                                        maxLength={11}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">Enter the bKash number you used for payment</p>
                                            </div>

                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                                                    Your bKash Transaction ID *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={transactionId}
                                                    onChange={handleTransactionIdChange}
                                                    placeholder="e.g., Yx4oM2"
                                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono uppercase"
                                                    maxLength={20}
                                                />
                                                <p className="text-xs text-gray-400 mt-1">Copy from payment confirmation message</p>
                                            </div>
                                        </div>

                                        {/* Important Note */}
                                        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                                <p className="text-xs text-yellow-400 break-words">
                                                    <strong>Important:</strong> Please ensure the bKash number and Transaction ID are correct. We will verify your payment before processing the order.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </label>
                )}

                {/* Online Payment - Simple Radio Button */}
                <label className="flex items-start gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-purple-500 transition-colors">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="pay_first"
                        checked={paymentMethod === 'pay_first'}
                        onChange={() => setPaymentMethod('pay_first')}
                        className="text-purple-500 focus:ring-purple-500 mt-1 flex-shrink-0"
                        disabled={loading}
                    />
                    <div className="flex-1 min-w-0">
                        <span className="block font-medium text-white text-sm sm:text-base">Online Payment</span>
                        <span className="text-gray-400 text-xs sm:text-sm break-words">
                            Pay ৳{(Number.isFinite(payableAmount) ? payableAmount : 0).toLocaleString()} now
                            {shippingCharge > 0 && ` (Includes ৳${shippingCharge.toLocaleString()} shipping)`}
                        </span>
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
                        className="text-purple-500 focus:ring-purple-500 mt-1 rounded flex-shrink-0"
                        disabled={loading}
                    />
                    <div className="flex-1 min-w-0">
                        <span className={`text-xs sm:text-sm ${acceptedTerms ? 'text-white' : 'text-gray-400'} group-hover:text-white transition-colors break-words`}>
                            I accept the{' '}
                            <a
                                href="/terms-of-service"
                                target="_blank"
                                className="text-purple-400 hover:text-purple-300 break-words"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Terms & Conditions
                            </a>
                            ,{' '}
                            <a
                                href="/return-policy"
                                target="_blank"
                                className="text-purple-400 hover:text-purple-300 break-words"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Return & Refund Policy
                            </a>
                            {' '}and{' '}
                            <a
                                href="/privacy-policy"
                                target="_blank"
                                className="text-purple-400 hover:text-purple-300 break-words"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Privacy Policy
                            </a>
                            {' '}of SOOQRA ONE
                        </span>
                    </div>
                </label>
            </div>

            {/* Validation Messages */}
            {paymentMethod === 'bkash' && (!bkashNumber || !transactionId) && (
                <div className="mt-3 p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-red-400 text-center break-words">
                        Please provide both bKash number and Transaction ID to proceed.
                    </p>
                </div>
            )}

            {!acceptedTerms && (
                <div className="mt-3 p-2 sm:p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <p className="text-xs text-red-400 text-center break-words">
                        Please accept the Terms & Conditions to place your order.
                    </p>
                </div>
            )}
        </div>
    );
}