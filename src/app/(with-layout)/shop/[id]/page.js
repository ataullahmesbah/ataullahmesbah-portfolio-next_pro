'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/components/Context/CartContext/CartContext';


async function getProduct(id) {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
}

export default function ProductDetails({ params }) {
  const [product, setProduct] = useState(null);
  const [currency, setCurrency] = useState('BDT');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      const data = await getProduct(params.id);
      setProduct(data);
      setMainImage(data.mainImage);
    }
    fetchProduct();
  }, [params.id]);

  if (!product) return <div>Loading...</div>;

  const price = product.prices.find((p) => p.currency === currency) || product.prices[0];
  const convertedPrice = price.amount.toFixed(2);
  const isAffiliate = product.productType === 'Affiliate';

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert('Added to cart!');
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image src={mainImage} alt={product.title} width={500} height={300} className="rounded" />
          <div className="flex gap-2 mt-4">
            {[product.mainImage, ...product.additionalImages].map((img, index) => (
              <Image
                key={index}
                src={img}
                alt="Thumbnail"
                width={100}
                height={60}
                className="cursor-pointer rounded"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="mt-4">
            <label className="font-semibold">Currency:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="ml-2 border rounded p-1"
            >
              {product.prices.map((p) => (
                <option key={p.currency} value={p.currency}>
                  {p.currency}
                </option>
              ))}
            </select>
          </div>
          <p className="text-2xl font-bold mt-2">
            {currency} {convertedPrice}
          </p>
          <h2 className="text-xl font-semibold mt-4">About this Item</h2>
          <p>{product.description}</p>
          {product.descriptions.length > 0 && (
            <div className="mt-2">
              <h3 className="font-semibold">Additional Details:</h3>
              <ul className="list-disc pl-5">
                {product.descriptions.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            </div>
          )}
          {product.bulletPoints.length > 0 && (
            <div className="mt-2">
              <h3 className="font-semibold">Features:</h3>
              <ul className="list-disc pl-5">
                {product.bulletPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4">
            <label className="font-semibold">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="border rounded px-2"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => Math.min(4, prev + 1))}
                className="border rounded px-2"
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-4 flex gap-4">
            {!isAffiliate && (
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Cart
              </button>
            )}
            <Link
              href={isAffiliate ? product.affiliateLink : '/checkout'}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Buy it Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}