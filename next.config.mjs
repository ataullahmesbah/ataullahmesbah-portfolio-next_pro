/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['mongoose'], // Add if using Mongoose
    serverActions: true, // Enable if using Server Actions
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // Explicitly allow YouTube thumbnails
      },
      {
        protocol: 'https',
        hostname: '**', // Allows all HTTPS domains
      },
      {
        protocol: 'http',
        hostname: '**', // Allows all HTTP domains (Optional)
      },
    ],
    domains: ['img.youtube.com', '*'], // Full domain wildcard
    unoptimized: true, // Optional if optimization is not needed
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      dns: false,
      fs: false,
      child_process: false,
    };
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        mongodb: false,
        'mongodb-client-encryption': false,
        aws4: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/api/socket/io/:path*',
        destination: '/api/socket/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/api/socket/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL || 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
      {
        source: '/admin-dashboard/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/moderator-dashboard/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/user-dashboard/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/accounts/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
