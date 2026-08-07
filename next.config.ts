import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity's asset CDN — project images resolve to https://cdn.sanity.io/images/<project>/...
    // once Sanity is configured (src/sanity/queries.ts); next/image rejects unlisted remote
    // hosts outright, so this has to be here before the first real fetch, not added reactively.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/**" }],
  },
};

export default nextConfig;
