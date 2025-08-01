import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pushcbtcyjqdsciueqrg.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },

  turbopack: {},

  async redirects() {
    return [
      {
        source: "/ribe",
        destination: "/afdelinger/ribe",
        permanent: true,
      },
      {
        source: "/billund",
        destination: "/afdelinger/billund",
        permanent: true,
      },
      {
        source: "/grindsted",
        destination: "/afdelinger/grindsted",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/hjem",
        destination: "/",
        permanent: true,
      },
    ];
  },

  generateBuildId: () => String(Date.now()),
};

export default nextConfig;
