import type { NextConfig } from "next";

// GitHub Pages serves this project at https://<user>.github.io/brim-demo/, so
// everything lives under a sub-path in production. The sub-path is applied only
// when building in CI (GITHUB_PAGES=true — see .github/workflows/deploy.yml), so
// local builds (`npm run build` / `npm start`) serve at root and `serve out`
// works. Change the path if the repo is renamed, or leave GITHUB_PAGES unset for
// a user/org root site or custom domain.
const basePath = process.env.GITHUB_PAGES === "true" ? "/brim-demo" : "";

const nextConfig: NextConfig = {
  output: "export", // static HTML/CSS/JS export → /out
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true, // no image optimizer on a static host
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true, // emit /menu/index.html so deep links + refresh work on Pages
  // Exposes the basePath to client code (see lib/asset.ts) so raw fetch() /
  // new Image() / <img src> calls for /public assets resolve under the sub-path.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
