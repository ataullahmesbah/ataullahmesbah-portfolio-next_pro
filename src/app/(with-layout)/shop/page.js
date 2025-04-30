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
    const products = await getProducts();

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Shop</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Link href={`/shop/${product._id}`} key={product._id}>
                        <div className="border rounded-lg shadow-lg p-4 hover:shadow-xl transition">
                            <Image
                                src={product.mainImage}
                                alt={product.title}
                                width={400}
                                height={200}
                                className="rounded"
                            />
                            <h3 className="text-xl font-bold mt-2">{product.title}</h3>
                            <p className="text-gray-600">BDT {product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}