import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/app-aluno',
        destination: '/aluno',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
