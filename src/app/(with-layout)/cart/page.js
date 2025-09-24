'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversionRates, setConversionRates] = useState({ USD: 123, EUR: 135, BDT: 1 });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [availableSizesMap, setAvailableSizesMap] = useState({});
    const router = useRouter();

    useEffect(() => {
        const updateCart = () => {
            const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
            const uniqueCart = removeDuplicateCartItems(storedCart);
            setCart(uniqueCart);
        };
        updateCart();
        window.addEventListener('cartUpdated', updateCart);
        return () => window.removeEventListener('cartUpdated', updateCart);
    }, []);

    useEffect(() => {
        axios
            .get('/api/products/conversion-rates')
            .then((response) => {
                setConversionRates(response.data);
            })
            .catch((err) => {
                console.error('Error fetching conversion rates:', err);
                showCustomToast('Failed to load currency conversion rates', 'error');
            });
    }, []);

    // Function to remove duplicate cart items (same product + same size)
    const removeDuplicateCartItems = (cartItems) => {
        const uniqueItemsMap = new Map();

        cartItems.forEach(item => {
            const key = `${item._id}-${item.size || 'no-size'}`;

            if (uniqueItemsMap.has(key)) {
                const existingItem = uniqueItemsMap.get(key);
                const mergedQuantity = existingItem.quantity + item.quantity;
                const finalQuantity = Math.min(mergedQuantity, 3); // Max 3 products

                uniqueItemsMap.set(key, {
                    ...existingItem,
                    quantity: finalQuantity
                });
            } else {
                uniqueItemsMap.set(key, {
                    ...item,
                    quantity: Math.min(item.quantity, 3) // Ensure max 3
                });
            }
        });

        return Array.from(uniqueItemsMap.values());
    };

    // Helper function to create consistent size keys
    const getSizeKey = (size) => size || 'no-size';
    const getItemSizeKey = (item) => item.size || 'no-size';

    // Fetch available sizes for each product in cart
    useEffect(() => {
        const fetchSizesForProducts = async () => {
            if (cart.length === 0) return;

            try {
                const productIds = [...new Set(cart.map(item => item._id))];
                const sizesMap = {};

                for (const productId of productIds) {
                    try {
                        const response = await axios.get(`/api/products/${productId}`);
                        const product = response.data;

                        if (product.sizes && product.sizes.length > 0) {
                            sizesMap[productId] = product.sizes
                                .filter(size => size.quantity > 0)
                                .map(size => size.name);
                        }
                    } catch (error) {
                        console.error(`Error fetching product ${productId}:`, error);
                    }
                }

                setAvailableSizesMap(sizesMap);
            } catch (error) {
                console.error('Error fetching sizes:', error);
            }
        };

        fetchSizesForProducts();
    }, [cart]);

    const validateQuantityWithBackend = async (productId, newQuantity, size) => {
        try {
            // Check maximum limit first
            if (newQuantity > 3) {
                return {
                    valid: false,
                    message: 'Maximum 3 products allowed per item'
                };
            }

            const response = await axios.post('/api/products/cart/validate', {
                productId,
                quantity: newQuantity,
                size,
            });
            return response.data;
        } catch (error) {
            console.error('Error validating quantity:', error);
            return {
                valid: false,
                message: error.response?.data?.message || 'Error checking product availability'
            };
        }
    };

    const handleQuantityChange = async (productId, newQuantity, size) => {
        if (newQuantity < 1) return;

        setIsLoading(true);
        try {
            const validation = await validateQuantityWithBackend(productId, newQuantity, size);
            if (!validation.valid) {
                showCustomToast(validation.message, 'error');
                setIsLoading(false);
                return;
            }

            const updatedCart = cart.map((item) =>
                item._id === productId && getItemSizeKey(item) === getSizeKey(size)
                    ? { ...item, quantity: newQuantity }
                    : item
            );

            const uniqueCart = removeDuplicateCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(uniqueCart));
            setCart(uniqueCart);
            window.dispatchEvent(new Event('cartUpdated'));

            // Show success toast for quantity change
            if (newQuantity > 1) {
                showCustomToast(
                    `Quantity updated to ${newQuantity} for ${cart.find(item => item._id === productId && getItemSizeKey(item) === getSizeKey(size))?.title
                    }`,
                    'success'
                );
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            showCustomToast('Failed to update quantity', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveItem = (productId, size) => {
        const updatedCart = cart.filter((item) =>
            !(item._id === productId && getItemSizeKey(item) === getSizeKey(size))
        );

        const uniqueCart = removeDuplicateCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(uniqueCart));
        setCart(uniqueCart);
        window.dispatchEvent(new Event('cartUpdated'));

        // Show custom toast notification
        const product = cart.find(item => item._id === productId && getItemSizeKey(item) === getSizeKey(size));
        if (product) {
            showCustomToast(`${product.title} has been removed from cart`, 'success');
        }

        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    const confirmDelete = (productId, size, title) => {
        setItemToDelete({ productId, size, title });
        setShowDeleteModal(true);
    };

    // Custom Toast Function
    const showCustomToast = (message, type = 'info') => {
        // Remove any existing toast
        const existingToast = document.querySelector('.custom-toast-page');
        if (existingToast) {
            document.body.removeChild(existingToast);
        }

        const toastElement = document.createElement('div');
        toastElement.className = `custom-toast-page custom-toast-${type}`;

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

    const handleSizeChange = async (productId, oldSize, newSize) => {
        if (oldSize === newSize) return;

        setIsLoading(true);
        try {
            // Check if the new size is available
            const response = await axios.get(`/api/products/${productId}`);
            const product = response.data;

            if (product.sizes && product.sizes.length > 0) {
                const sizeData = product.sizes.find(s => s.name === newSize);
                if (!sizeData || sizeData.quantity === 0) {
                    showCustomToast('Selected size is not available', 'error');
                    setIsLoading(false);
                    return;
                }
            }

            // Update the cart with the new size
            const updatedCart = cart.map((item) =>
                item._id === productId && getItemSizeKey(item) === getSizeKey(oldSize)
                    ? { ...item, size: newSize }
                    : item
            );

            const uniqueCart = removeDuplicateCartItems(updatedCart);
            localStorage.setItem('cart', JSON.stringify(uniqueCart));
            setCart(uniqueCart);
            window.dispatchEvent(new Event('cartUpdated'));

            showCustomToast(
                `Size updated to ${newSize} for ${cart.find(item => item._id === productId && getItemSizeKey(item) === getSizeKey(oldSize))?.title
                }`,
                'success'
            );
        } catch (error) {
            console.error('Error changing size:', error);
            showCustomToast('Failed to update size', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const getSubtotal = () => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getTotalQuantity = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const handleProceedToCheckout = async () => {
        setIsLoading(true);
        try {
            // Check for quantity limits before validation
            const exceededLimitItems = cart.filter(item => item.quantity > 3);
            if (exceededLimitItems.length > 0) {
                exceededLimitItems.forEach(item => {
                    showCustomToast(`Maximum 3 units allowed for ${item.title}`, 'error');
                });

                // Auto-correct quantities
                const correctedCart = cart.map(item => ({
                    ...item,
                    quantity: Math.min(item.quantity, 3)
                }));

                localStorage.setItem('cart', JSON.stringify(correctedCart));
                setCart(correctedCart);
                window.dispatchEvent(new Event('cartUpdated'));
                setIsLoading(false);
                return;
            }

            // First remove any duplicates before validation
            const cleanedCart = removeDuplicateCartItems(cart);
            if (cleanedCart.length !== cart.length) {
                showCustomToast('Duplicate items removed from cart', 'info');
                localStorage.setItem('cart', JSON.stringify(cleanedCart));
                setCart(cleanedCart);
                window.dispatchEvent(new Event('cartUpdated'));
            }

            const validationPromises = cleanedCart.map(async (item) => {
                const validation = await validateQuantityWithBackend(item._id, item.quantity, item.size);
                return { ...validation, productId: item._id, size: item.size, title: item.title };
            });

            const results = await Promise.all(validationPromises);
            const invalidItems = results.filter((result) => !result.valid);

            if (invalidItems.length > 0) {
                invalidItems.forEach((item) => {
                    showCustomToast(`${item.title}: ${item.message}`, 'error');
                });

                const updatedCart = await Promise.all(
                    cleanedCart.map(async (item) => {
                        try {
                            const response = await axios.get(`/api/products/${item._id}`);
                            const product = response.data;
                            if (item.size) {
                                const sizeData = product.sizes.find((s) => s.name === item.size);
                                if (!sizeData || item.quantity > sizeData.quantity) {
                                    showCustomToast(
                                        `Adjusted quantity to ${sizeData?.quantity || 0} for ${item.title} (size: ${item.size})`,
                                        'info'
                                    );
                                    return { ...item, quantity: Math.min(item.quantity, sizeData?.quantity || 0) };
                                }
                            } else if (item.quantity > product.quantity) {
                                showCustomToast(
                                    `Adjusted quantity to ${product.quantity} for ${item.title}`,
                                    'info'
                                );
                                return { ...item, quantity: Math.min(item.quantity, product.quantity) };
                            }
                            return item;
                        } catch (error) {
                            console.error(`Error updating product ${item._id}:`, error);
                            showCustomToast(`Failed to validate ${item.title}`, 'error');
                            return item;
                        }
                    })
                );

                const finalCart = removeDuplicateCartItems(updatedCart);
                localStorage.setItem('cart', JSON.stringify(finalCart));
                setCart(finalCart);
                window.dispatchEvent(new Event('cartUpdated'));
                setIsLoading(false);
                return;
            }

            router.push('/checkout');
        } catch (error) {
            console.error('Error validating cart:', error);
            showCustomToast('Failed to validate cart items', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <div className="mb-6 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <p className="text-xl text-gray-400 mb-6">Your cart is empty</p>
                        <Link
                            href="/shop"
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-md transition-all duration-300 shadow-lg hover:shadow-purple-800/30"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-800 p-4 rounded-lg mb-6">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-yellow-400">
                                    Adding products to the cart does not mean they are reserved. Buy now to not miss the chance to purchase!
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-gray-800 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold mb-6">Cart Items ({getTotalQuantity()} items)</h2>
                                    <div className="space-y-6">
                                        {cart.map((item, index) => (
                                            <div key={`${item._id}-${getItemSizeKey(item)}-${index}`} className="flex items-center gap-4 pb-6 border-b border-gray-700 last:border-0 last:pb-0">
                                                <div className="relative w-20 h-20 flex-shrink-0">
                                                    <Image
                                                        src={item.mainImage}
                                                        alt={item.mainImageAlt || item.title}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover rounded-md"
                                                        sizes="80px"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium truncate">{item.title}</h3>
                                                    {item.size && availableSizesMap[item._id] && availableSizesMap[item._id].length > 0 && (
                                                        <div className="mt-2">
                                                            <label className="text-xs text-gray-400 mr-2">Size:</label>
                                                            <select
                                                                value={item.size}
                                                                onChange={(e) => handleSizeChange(item._id, item.size, e.target.value)}
                                                                className="text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                                                                disabled={isLoading}
                                                            >
                                                                {availableSizesMap[item._id].map(size => (
                                                                    <option key={size} value={size}>{size}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                    <p className="text-indigo-400 font-medium mt-2 text-sm">৳{item.price.toLocaleString()}</p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center border border-gray-600 rounded-md overflow-hidden mb-2">
                                                        <button
                                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1, item.size)}
                                                            disabled={item.quantity <= 1 || isLoading}
                                                            className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-3 py-1 bg-gray-800 min-w-[2rem] text-center">{item.quantity}/3</span>
                                                        <button
                                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1, item.size)}
                                                            disabled={isLoading || item.quantity >= 3}
                                                            className="px-3 py-1 bg-gray-700 text-white hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isLoading ? '...' : '+'}
                                                        </button>
                                                    </div>
                                                    <p className="text-indigo-400 font-medium">৳{(item.price * item.quantity).toLocaleString()}</p>
                                                    <button
                                                        onClick={() => confirmDelete(item._id, item.size, item.title)}
                                                        className="mt-2 text-gray-400 hover:text-red-400 transition-colors"
                                                        disabled={isLoading}
                                                        title="Remove item"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-6 sticky top-6 border border-gray-700 shadow-lg">
                                    <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex items-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-sm">Delivery: 3-7 business days</span>
                                        </div>
                                        <div className="flex items-center text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span className="text-sm">Free returns within 15 days</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Subtotal</span>
                                            <span className="font-medium">৳{getSubtotal().toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-semibold pt-4 border-t border-gray-700">
                                            <span>Total</span>
                                            <span className="text-indigo-400">৳{getSubtotal().toLocaleString()}</span>
                                        </div>

                                        <button
                                            onClick={handleProceedToCheckout}
                                            disabled={cart.length === 0 || isLoading}
                                            className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white rounded-md transition-all duration-300 shadow-lg hover:shadow-purple-800/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Validating...
                                                </span>
                                            ) : 'Proceed to Checkout'}
                                        </button>

                                        <Link
                                            href="/shop"
                                            className="block w-full py-3 mt-3 bg-gray-700 hover:bg-gray-600 text-white text-center rounded-md transition-colors duration-300"
                                        >
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 shadow-xl">
                        <h3 className="text-xl font-semibold mb-4">Confirm Removal</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to remove {itemToDelete?.title} from your cart?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRemoveItem(itemToDelete.productId, itemToDelete.size)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                            >
                                Yes, Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
    .custom-toast-page {
        position: fixed;
        top: 24px; /* Changed from bottom: 24px */
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

    .custom-toast-page.show {
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
`}</style>
        </div>
    );
}