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
};

export default nextConfig;