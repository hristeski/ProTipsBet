import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Cache-Control", value: "private, no-cache, must-revalidate" }],
      },
      {
        source: "/free-tips",
        headers: [{ key: "Cache-Control", value: "private, no-cache, must-revalidate" }],
      },
      {
        source: "/vip-tips",
        headers: [{ key: "Cache-Control", value: "private, no-cache, must-revalidate" }],
      },
      {
        source: "/history",
        headers: [{ key: "Cache-Control", value: "private, no-cache, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;