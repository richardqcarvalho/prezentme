import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/public/*": ["./public/template.html"],
  },
};

export default nextConfig;
