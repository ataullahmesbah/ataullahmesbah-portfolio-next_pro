/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true,
    },
    images: {
      domains: ['i.ibb.co', 'i.ibb.co.com'], // Keep your existing image domains
    },
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    },
  };
  
  export default nextConfig;
  