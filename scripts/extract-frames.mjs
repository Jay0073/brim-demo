// Extract a scroll-scrubbable JPG sequence from the source video.
//
//   node scripts/extract-frames.mjs        (or: npm run frames)
//
// Requires ffmpeg on PATH. Reads assets/yt-video.mp4 and writes
// public/sequence/frame-0001.jpg … into a CLEAN folder (old frames removed).
//
// NOTE: the current source clip is a Wayback Burgers commercial; only the
// brand-free 1.0s–14.5s window (raw beef → smash → cheese → melt) is used.
// To use real Brim footage: drop it in as assets/yt-video.mp4, adjust the
// window below if needed, and re-run. The component reads the frame count
// from public/sequence/manifest.json, so you don't need to touch the .tsx.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FFMPEG = process.env.FFMPEG || "ffmpeg";
const INPUT = resolve("assets/yt-video.mp4");
const OUT = resolve("public/sequence");

// ── Tunables ──────────────────────────────────────────────────────────────
const START = 1.0; // seconds — skip the very first frames
const DURATION = 13.5; // seconds of footage to capture (brand-free window)
const FPS = 12; // frames per second of source → ~162 frames total
const WIDTH = 1280; // output width (height auto, keeps aspect)
const QUALITY = 3; // ffmpeg -q:v (2=best … 31=worst); 3 ≈ crisp + small
// ──────────────────────────────────────────────────────────────────────────

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

console.log(`Extracting ${START}s–${(START + DURATION).toFixed(1)}s @ ${FPS}fps …`);
execFileSync(
  FFMPEG,
  [
    "-y",
    "-ss", String(START),
    "-i", INPUT,
    "-t", String(DURATION),
    "-vf", `fps=${FPS},scale=${WIDTH}:-2`,
    "-q:v", String(QUALITY),
    resolve(OUT, "frame-%04d.jpg"),
  ],
  { stdio: ["ignore", "inherit", "inherit"] }
);

const frames = readdirSync(OUT).filter((f) => /^frame-\d+\.jpg$/.test(f)).sort();
const count = frames.length;

// Manifest lets the React component stay in sync automatically.
writeFileSync(
  resolve(OUT, "manifest.json"),
  JSON.stringify({ count, fps: FPS, width: WIDTH, pattern: "frame-%04d.jpg" }, null, 2)
);

console.log(`\n✅ Extracted ${count} frames → public/sequence/ (manifest.json written)`);
