/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "images.unsplash.com", "cdn.pixabay.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
