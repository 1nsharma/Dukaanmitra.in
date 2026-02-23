/** @type {import('next').NextConfig} */

const isStaticExport = process.env.BUILD_STATIC === 'true';

const nextConfig = {
  // Conditionally set the output to 'export' for static builds
  output: isStaticExport ? 'export' : undefined,
  
  images: {
    // When exporting a static site, the default Next.js image optimization is not available.
    // We must disable it for the static build to succeed.
    unoptimized: isStaticExport ? true : false,
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
