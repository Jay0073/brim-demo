import type { NextConfig } from "next";

// GitHub Pages serves this project at https://<user>.github.io/brim-demo/, so
// everything lives under a sub-path in production. Change `repoBasePath` if the
// repo is renamed (or set to "" for a user/org root site or custom domain).
const isProd = process.env.NODE_ENV === "production";
const repoBasePath = "/brim-demo";
const basePath = isProd ? repoBasePath : "";

const nextConfig: NextConfig = {
  output: "export", // static HTML/CSS/JS export → /out
  images: {
    unoptimized: true, // no image optimizer on a static host
  },
  basePath,
  assetPrefix: isProd ? `${repoBasePath}/` : undefined,
  // Exposes the basePath to client code (see lib/asset.ts) so raw fetch() /
  // new Image() / <img> calls for /public assets resolve under the sub-path.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  trailingSlash: true, // emit /menu/index.html so deep links + refresh work on Pages
};

export default nextConfig;
