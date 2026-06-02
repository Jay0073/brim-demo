// Prefix a /public asset path with the deploy basePath (e.g. "/brim-demo").
//
// next/image, <Link> and next/navigation prepend basePath automatically — but
// raw fetch(), `new Image()` and plain <img src> do NOT. Use this for those so
// assets resolve correctly when hosted on a sub-path (GitHub Pages project site).
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (/^https?:\/\//.test(path) || path.startsWith("data:")) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
