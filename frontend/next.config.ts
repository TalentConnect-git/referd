import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "referd.in",
        pathname: "/**",
      },
      // Add if you have other domains
      // {
      //   protocol: "https",
      //   hostname: "your-other-domain.com",
      //   pathname: "/**",
      // },
    ],
  },
  /* config options here */
};

export default nextConfig;