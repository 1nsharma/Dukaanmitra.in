/** @type {import('next').NextConfig} */

const isStaticExport = process.env.BUILD_STATIC === 'true';

const nextConfig = {
  // Conditionally set the output to 'export' for static builds
  output: isStaticExport ? 'export' : undefined,
  
  // GH Pages requires trailing slashes for clean subpage URLs
  trailingSlash: true,


  eslint: {
    // CI/production builds should not fail on lint setup availability.
    ignoreDuringBuilds: true,
  },

  images: {
    // When exporting a static site, the default Next.js image optimization is not available.
    // We must disable it for the static build to succeed.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dukaanmitra.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dukaanmitra.in',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
