import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 1. Fix for "Body exceeded 1 MB limit":
     Increases the payload limit for Server Actions (e.g., image uploads).
  */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", 
    },
  },

  /* 2. Fix for "hostname images.unsplash.com is not configured":
     Whitelists Unsplash so next/image can optimize and serve the files.
  */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
    ],
  },
  
  // Add any other existing config options here
};

export default nextConfig;