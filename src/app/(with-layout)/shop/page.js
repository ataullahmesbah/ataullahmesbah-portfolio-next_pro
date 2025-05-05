import Link from 'next/link';
import Image from 'next/image';

async function getProducts() {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch products');
    }
    return res.json();
}

export default async function Shop() {
    let products = [];
    try {
        products = await getProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        return (
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-8">Shop</h1>
                <p className="text-red-500">Failed to load products.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Shop</h1>
            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const bdtPrice = product.prices.find((p) => p.currency === 'BDT')?.amount || 'N/A';
                        return (
                            <div
                                key={product._id}
                                className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition"
                            >
                                <Image
                                    src={product.mainImage}
                                    alt={product.title}
                                    width={400}
                                    height={200}
                                    className="rounded object-cover w-full"
                                />
                                <h3 className="text-xl font-bold mt-2">
                                    <Link
                                        href={`/shop/${product.slug}`}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        {product.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-600">BDT ৳{bdtPrice}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}