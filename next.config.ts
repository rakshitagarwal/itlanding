import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Webflow ecommerce JS may still probe this path; stub it to our API
  async rewrites() {
    return [
      {
        source: "/.wf_graphql/:path*",
        destination: "/api/wf-graphql/:path*",
      },
    ];
  },
};

export default nextConfig;
