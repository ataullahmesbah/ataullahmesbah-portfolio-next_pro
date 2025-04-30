'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../CartContext/CartContext';

export default function CartSlide() {
    const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useCart();

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300`}
        >
            <div className="p-4">
                <button onClick={() => setIsCartOpen(false)} className="text-red-500">
                    Close
                </button>
                <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                {cart.length === 0 ? (
                    <p>Cart is empty</p>
                ) : (
                    <div>
                        {cart.map((item) => (
                            <div key={item._id} className="flex gap-2 mb-4">
                                <Image src={item.mainImage} alt={item.title} width={80} height={50} />
                                <div>
                                    <h3>{item.title}</h3>
                                    <p>Quantity: {item.quantity}</p>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="text-red-500"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <Link
                            href="/checkout"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}