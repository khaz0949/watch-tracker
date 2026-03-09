import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      { protocol: "https", hostname: "upload.wikimedia.org", pathname: "/**" },
      { protocol: "https", hostname: "patek-res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "assets.rolex.com", pathname: "/**" },
      { protocol: "https", hostname: "media.richardmille.com", pathname: "/**" },
      { protocol: "https", hostname: "www.cartier.com", pathname: "/**" },
      { protocol: "https", hostname: "www.audemarspiguet.com", pathname: "/**" },
      { protocol: "https", hostname: "img.chrono24.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn2.chrono24.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
