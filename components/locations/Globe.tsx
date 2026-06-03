"use client";

// Interactive WebGL globe (cobe) that plots every Brim store and, when one is
// selected, spins along the shortest path to point that store at the viewer.
// Idle = gentle auto-rotate; drag to spin manually.
//
// NOTE on cobe v2: unlike v1, v2 has NO internal render loop / `onRender`
// callback. You drive it yourself — we run our own requestAnimationFrame loop
// and push each frame's rotation/size via `globe.update()`. All WebGL / window
// access lives inside useEffect so it's safe under the static export (the canvas
// prerenders to empty HTML and only comes alive after hydration).

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export interface GlobeMarker {
  id: string;
  lat: number;
  lng: number;
}

interface GlobeProps {
  markers: GlobeMarker[];
  /** id of the store to face the viewer, or null for idle auto-rotate. */
  focusId: string | null;
  className?: string;
}

// Monochrome markers — cool white. Non-selected sit slightly dimmer; the
// selected one goes pure white and also gets the SVG pin overlay (see render).
const MARKER: [number, number, number] = [0.62, 0.65, 0.72];
const MARKER_ACTIVE: [number, number, number] = [1, 1, 1];

const TWO_PI = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const posMod = (a: number, n: number) => ((a % n) + n) % n;

// How much of the canvas the sphere fills. cobe's default is 1; >1 zooms in.
const SCALE = 1.12;
// Mirror cobe's internal geometry so we can place a DOM pin exactly on a marker:
// the sphere radius (`ee` in cobe) plus the marker elevation we pass below.
const GLOBE_RADIUS = 0.8;
const MARKER_ELEVATION = 0.01;

// Convert a lat/lng into the [phi, theta] rotation that brings the point to the
// front of the globe. (Canonical cobe focus mapping.)
function locationToAngles(lat: number, lng: number): [number, number] {
  return [Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180];
}

// lat/lng → unit-sphere vector (matches cobe's internal `U`).
function locationToVector(lat: number, lng: number): [number, number, number] {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180 - Math.PI;
  const cosLat = Math.cos(phi);
  return [-cosLat * Math.cos(lambda), Math.sin(phi), cosLat * Math.sin(lambda)];
}

// Project a marker to normalized [0,1] canvas coords for the current rotation,
// replicating cobe's marker vertex transform (square canvas, no offset). Also
// reports whether the point faces the viewer so the pin can hide on the far side.
function projectMarker(
  lat: number,
  lng: number,
  phi: number,
  theta: number,
): { x: number; y: number; visible: boolean } {
  const r = GLOBE_RADIUS + MARKER_ELEVATION;
  const [vx, vy, vz] = locationToVector(lat, lng);
  const x = vx * r;
  const y = vy * r;
  const z = vz * r;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  const sx = cosP * x + sinP * z;
  const sy = sinP * sinT * x + cosT * y - cosP * sinT * z;
  const sz = -sinP * cosT * x + sinT * y + cosP * cosT * z;
  return {
    x: (sx * SCALE + 1) / 2,
    y: (-sy * SCALE + 1) / 2,
    visible: sz >= 0 || sx * sx + sy * sy >= GLOBE_RADIUS * GLOBE_RADIUS,
  };
}

function buildMarkers(markers: GlobeMarker[], focusId: string | null) {
  return markers.map((m) => ({
    location: [m.lat, m.lng] as [number, number],
    size: m.id === focusId ? 0.08 : 0.05,
    color: m.id === focusId ? MARKER_ACTIVE : MARKER,
  }));
}

export function Globe({ markers, focusId, className = "" }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  // Mutable animation state, shared between the rAF loop and pointer handlers
  // via refs so the loop never reads a stale closure.
  const phiRef = useRef(locationToAngles(30, 28)[0]); // start over Europe / Mid-East
  const thetaRef = useRef(0.3);
  const targetThetaRef = useRef(0.3);
  const focusRef = useRef<[number, number] | null>(null);
  const focusLocRef = useRef<[number, number] | null>(null); // [lat,lng] of focused store
  const pinRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef(buildMarkers(markers, focusId));
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const widthRef = useRef(0);
  const dprRef = useRef(1);

  // Create the globe + run the animation loop once. Everything dynamic flows
  // through refs / markersRef so we never recreate the globe.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    widthRef.current = canvas.offsetWidth || 400;

    const onResize = () => {
      if (canvasRef.current)
        widthRef.current = canvasRef.current.offsetWidth || widthRef.current;
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(canvas);

    const initialSize = (widthRef.current || 400) * dprRef.current;
    const globe = createGlobe(canvas, {
      devicePixelRatio: dprRef.current,
      width: initialSize,
      height: initialSize,
      phi: phiRef.current,
      theta: thetaRef.current,
      scale: SCALE,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 22000,
      mapBrightness: 5,
      mapBaseBrightness: 0.05,
      baseColor: [0.21, 0.21, 0.25], // dark slate sphere on the near-black page
      markerColor: MARKER_ACTIVE,
      glowColor: [0.45, 0.5, 0.62], // cool, neutral atmosphere (no orange)
      markerElevation: MARKER_ELEVATION,
      markers: markersRef.current,
    });
    globeRef.current = globe;

    // Our own render loop (v2 has none). Each frame: advance rotation, then
    // push the full state via update() so markers never get dropped.
    let raf = 0;
    const tick = () => {
      if (!draggingRef.current) {
        const focus = focusRef.current;
        if (focus) {
          // Ease toward the selected store along the shorter arc.
          const dPos = posMod(focus[0] - phiRef.current, TWO_PI);
          const dNeg = posMod(phiRef.current - focus[0], TWO_PI);
          phiRef.current += dPos < dNeg ? dPos * 0.085 : -dNeg * 0.085;
          targetThetaRef.current = focus[1];
        } else {
          phiRef.current += 0.005; // idle auto-spin
        }
      }
      thetaRef.current += (targetThetaRef.current - thetaRef.current) * 0.08;

      // `|| 400` guards the first frames before layout reports a real width.
      const size = (widthRef.current || 400) * dprRef.current;
      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        width: size,
        height: size,
        markers: markersRef.current,
      });

      // Ride the DOM pin along with the globe: project the focused store to its
      // real screen position each frame, and fade it out when it rotates to the
      // far side. (No focused store → no pin element, so we just skip.)
      const loc = focusLocRef.current;
      const pin = pinRef.current;
      if (loc && pin) {
        const p = projectMarker(loc[0], loc[1], phiRef.current, thetaRef.current);
        pin.style.left = `${p.x * 100}%`;
        pin.style.top = `${p.y * 100}%`;
        pin.style.opacity = p.visible ? "1" : "0";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Fade in once the first frame has painted (avoids a black square flash).
    const fade = requestAnimationFrame(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(fade);
      observer.disconnect();
      globe.destroy();
      globeRef.current = null;
    };
    // Created once — marker/focus changes are synced by the effect below
    // (all dynamic values flow through refs, so [] is intentional & complete).
  }, []);

  // Sync markers + focus target whenever the selection or store set changes.
  // The rAF loop reads markersRef/focusRef next frame, so no direct draw here.
  useEffect(() => {
    markersRef.current = buildMarkers(markers, focusId);

    if (!focusId) {
      focusRef.current = null; // back to idle auto-rotate
      focusLocRef.current = null; // and drop the pin
      return;
    }
    const target = markers.find((m) => m.id === focusId);
    focusRef.current = target ? locationToAngles(target.lat, target.lng) : null;
    focusLocRef.current = target ? [target.lat, target.lng] : null;
  }, [markers, focusId]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = true;
    focusRef.current = null; // hand control to the user; stop chasing the store
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
    e.currentTarget.style.cursor = "grabbing";
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!draggingRef.current) return;
    // Drag the surface with the pointer: drag right → globe spins right.
    phiRef.current += (e.clientX - lastXRef.current) * 0.005;
    targetThetaRef.current = clamp(
      targetThetaRef.current + (e.clientY - lastYRef.current) * 0.005,
      -1,
      1,
    );
    lastXRef.current = e.clientX;
    lastYRef.current = e.clientY;
  };

  const endDrag = (e: React.PointerEvent<HTMLCanvasElement>) => {
    draggingRef.current = false;
    e.currentTarget.style.cursor = "grab";
  };

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      {/* Warm radial halo behind the sphere for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.13), rgba(200,210,230,0.05) 45%, transparent 70%)",
        }}
      />
      <canvas
        ref={canvasRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="relative h-full w-full cursor-grab opacity-0 transition-opacity duration-700"
        style={{ touchAction: "pan-y" }}
      />

      {/* White location pin for the focused store. The rAF loop drives this
          wrapper to the marker's real projected position, so it rides the globe
          as it spins instead of sitting glued to the centre. */}
      {focusId && (
        <div
          ref={pinRef}
          aria-hidden
          className="pointer-events-none absolute z-10 transition-opacity duration-200"
          style={{ left: "50%", top: "50%", opacity: 0 }}
        >
          <span
            key={`pt-${focusId}`}
            className="absolute left-0 top-0 block size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
          </span>
          <span
            key={`pin-${focusId}`}
            className="absolute left-0 top-0 flex -translate-x-1/2 -translate-y-full flex-col items-center"
          >
            <svg
              className="animate-rise drop-shadow-[0_5px_12px_rgba(0,0,0,0.65)]"
              width="30"
              height="38"
              viewBox="0 0 24 32"
              fill="none"
            >
              <path
                d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 20 12 20s12-11.5 12-20C24 5.37 18.63 0 12 0Z"
                fill="#fff"
                stroke="rgba(0,0,0,0.35)"
              />
              <circle cx="12" cy="12" r="4.4" fill="#0a0a0a" />
            </svg>
          </span>
        </div>
      )}
    </div>
  );
}
