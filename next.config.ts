import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "everaw.in",
      //   pathname: "/cdn/**",
      // },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/collection/all",
        destination: "/collections/all",
        permanent: true,
      },
      {
        source: "/collection",
        destination: "/collections/all",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
