import Image from 'next/image';
import Head from 'next/head';

export default async function ProductDetails({ params }) {
  const { slug } = params;

  // Fetch product
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products/slug/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Product Not Found</h1>
        <p className="text-red-500">Failed to load product details.</p>
      </div>
    );
  }
  const product = await res.json();

  return (
    <>
      <Head>
        <title>{product.title} | Mesbah Portfolio</title>
        <meta name="description" content={product.description.substring(0, 160)} />
        <meta name="keywords" content={`${product.title}, ${product.category?.name}, product`} />
        <meta name="robots" content="index, follow" />
      </Head>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{product.title}</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div>
              <Image
                src={product.mainImage}
                alt={product.title}
                width={400}
                height={400}
                className="rounded-lg object-cover w-full"
              />
              {product.additionalImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {product.additionalImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`${product.title} additional image ${index + 1}`}
                      width={150}
                      height={150}
                      className="rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Category</h2>
                <p className="text-gray-800">{product.category?.name || 'N/A'}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700">Prices</h2>
                <ul className="space-y-2">
                  {product.prices.map((price, index) => (
                    <li key={index} className="text-gray-800">
                      {price.currency}: {price.amount}
                      {price.exchangeRate && ` (1 ${price.currency} = ${price.exchangeRate} BDT)`}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700">Description</h2>
                <p className="text-gray-800">{product.description}</p>
              </div>

              {product.descriptions.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Additional Descriptions</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {product.descriptions.map((desc, index) => (
                      <li key={index} className="text-gray-800">{desc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.bulletPoints.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Features</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {product.bulletPoints.map((point, index) => (
                      <li key={index} className="text-gray-800">{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-gray-700">Product Type</h2>
                <p className="text-gray-800">{product.productType}</p>
              </div>

              {product.productType === 'Affiliate' && product.affiliateLink && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">Purchase Link</h2>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Buy Now
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}