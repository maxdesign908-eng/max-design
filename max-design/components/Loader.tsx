"use client";

import { useEffect, useRef, useState } from "react";

/*
  Full-screen intro loader for MAX design.

  HOW IT WORKS
  - It is on screen from the very first paint (it is rendered on the server too, so the page
    never flashes before it).
  - The progress bar / % moves smoothly while the page loads and reaches 100% when the page
    (window "load") is ready. It stays at least MIN_MS so it never just blinks, and it leaves
    after MAX_MS even if something is very slow.
  - Then it fades out and removes itself from the page.
  - While it is visible the page cannot scroll. The scrollbar space is kept (scrollbar-gutter),
    so the page does NOT jump left/right when the loader appears or leaves.
  - Needs /public/images/loader-icon.webp (your logo icon, square).

  Use it ONCE, in app/layout.tsx:  <Loader />  (see the bottom of this file).
*/

const MIN_MS = 1800; // shortest time the loader stays (counted from the start of the page load)
const MAX_MS = 6000; // never block the site longer than this
const DONE_MS = 350; // pause on 100% before fading
const FADE_MS = 700; // fade-out time

const CSS = `
  /* lock scroll without moving the page: the scrollbar space stays reserved */
  html:has(.ld) { overflow: hidden; scrollbar-gutter: stable; background: #050505; }

  .ld {
    --red: #E71117;
    position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; overflow: hidden;
    background: #050505; color: #fff; font-family: Poppins, system-ui, sans-serif; letter-spacing: -0.04em;
    animation: ldIn .35s ease .1s both;
  }
  .ld.out { animation: ldOut ${FADE_MS}ms ease forwards; pointer-events: none; }
  .ld.out .ld-box { animation: ldBoxOut ${FADE_MS}ms cubic-bezier(.4,0,.2,1) forwards; }

  /* soft dark edges */
  .ld::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,.8) 100%);
  }

  /* one calm red glow, always centred (nothing drifts sideways) */
  .ld-glow {
    position: absolute; left: 50%; top: 50%; width: min(120vmax, 1400px); aspect-ratio: 1; translate: -50% -50%;
    pointer-events: none;
    background: radial-gradient(closest-side, rgba(231,17,23,.30), rgba(231,17,23,.09) 50%, transparent 75%);
    animation: ldBreath 3.6s ease-in-out infinite;
  }

  .ld-box { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: clamp(26px, 5vmin, 44px); }

  /* ── logo + rings ── */
  .ld-core { position: relative; width: clamp(170px, 27vmin, 250px); aspect-ratio: 1; display: grid; place-items: center; }

  .ld-halo {
    position: absolute; inset: 24%; border-radius: 50%; pointer-events: none;
    background: radial-gradient(closest-side, rgba(231,17,23,.75), transparent 72%);
    filter: blur(16px); animation: ldHalo 2.4s ease-in-out infinite;
  }
  .ld-icon {
    position: relative; z-index: 2; display: block;
    width: 44%; height: auto; aspect-ratio: 1 / 1; object-fit: contain;   /* never stretched */
    border-radius: 22%;
    box-shadow: 0 0 0 1px rgba(255,255,255,.12), 0 14px 34px rgba(0,0,0,.55);
    animation: ldFloat 2.4s ease-in-out infinite;
  }

  .ld-ring { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; }
  /* faint full circle the comet runs on */
  .ld-ring.t { border: 1px solid rgba(255,255,255,.08); }
  /* red comet */
  .ld-ring.a {
    background: conic-gradient(from 0deg, transparent 0 62%, rgba(231,17,23,.2) 78%, var(--red) 100%);
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
            mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));
    animation: ldSpin 1.5s linear infinite;
  }
  .ld-ring.a::after {
    content: ""; position: absolute; top: -3px; left: 50%; width: 8px; height: 8px; margin-left: -4px; border-radius: 50%;
    background: #fff; box-shadow: 0 0 14px 4px var(--red);
  }
  /* dashed inner ring turning the other way */
  .ld-ring.b { inset: 12%; border: 1px dashed rgba(255,255,255,.22); animation: ldSpin 14s linear infinite reverse; }
  /* ripples going out */
  .ld-ring.c, .ld-ring.d { inset: 0; border: 1px solid rgba(231,17,23,.45); animation: ldRipple 2.8s ease-out infinite; }
  .ld-ring.d { animation-delay: 1.4s; }

  /* two little dots orbiting the logo */
  .ld-orbit { position: absolute; inset: 12%; border-radius: 50%; pointer-events: none; animation: ldSpin 7s linear infinite; }
  .ld-orbit::before {
    content: ""; position: absolute; top: 50%; right: -3px; width: 6px; height: 6px; margin-top: -3px; border-radius: 50%;
    background: #fff; box-shadow: 0 0 10px 2px rgba(255,255,255,.55);
  }
  .ld-orbit.r { animation-duration: 10s; animation-direction: reverse; }
  .ld-orbit.r::before { right: auto; left: -3px; background: var(--red); box-shadow: 0 0 12px 3px var(--red); }

  /* ── name ── */
  .ld-name { margin: 0; font-size: clamp(22px, 3vmin, 30px); font-weight: 300; line-height: 1; animation: ldRise .7s cubic-bezier(.2,.7,.2,1) .25s both; }
  .ld-name b { font-weight: 700; }

  /* ── progress ── */
  .ld-prog { width: clamp(200px, 30vmin, 290px); animation: ldRise .7s cubic-bezier(.2,.7,.2,1) .4s both; }
  .ld-bar { height: 3px; border-radius: 3px; background: rgba(255,255,255,.12); overflow: hidden; }
  .ld-fill {
    display: block; height: 100%; width: 100%; border-radius: 3px; transform-origin: left center; transform: scaleX(0);
    background: linear-gradient(90deg, var(--red), #ff5a60); box-shadow: 0 0 12px rgba(231,17,23,.9);
    transition: transform .25s linear;
  }
  .ld-meta { display: flex; justify-content: space-between; margin-top: 10px; font-size: 11px; line-height: 1; letter-spacing: .14em; text-transform: uppercase; color: rgba(255,255,255,.5); }
  .ld-pct { font-variant-numeric: tabular-nums; color: rgba(255,255,255,.85); letter-spacing: .06em; }

  .ld-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

  @keyframes ldIn      { from { opacity: 0; } to { opacity: 1; } }
  @keyframes ldOut     { from { opacity: 1; } to { opacity: 0; } }
  @keyframes ldBoxOut  { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(1.06); } }
  @keyframes ldSpin    { to { transform: rotate(360deg); } }
  @keyframes ldFloat   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes ldHalo    { 0%,100% { opacity: .55; transform: scale(.92); } 50% { opacity: 1; transform: scale(1.12); } }
  @keyframes ldBreath  { 0%,100% { opacity: .7; transform: scale(.96); } 50% { opacity: 1; transform: scale(1.04); } }
  @keyframes ldRipple  { 0% { transform: scale(.9); opacity: .8; } 100% { transform: scale(1.5); opacity: 0; } }
  @keyframes ldRise    { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  @media (prefers-reduced-motion: reduce) {
    .ld, .ld * { animation: none !important; }
    .ld-fill { transition: none; }
  }
`;

type Phase = "loading" | "leaving" | "done";

export default function Loader({
  logoSrc = "/images/loader-icon.webp",
}: {
  /** the logo icon shown in the middle (square image, put the file in /public/images) */
  logoSrc?: string;
}) {
  const [phase, setPhase] = useState<Phase>("loading");
  const fillRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let loaded = false;
    let complete = false;
    let p = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // draw the progress straight into the DOM (no re-render every tick)
    const paint = (v: number) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${v / 100})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(v)}%`;
    };

    // eases toward 92% while the page is still loading
    const tick = setInterval(() => {
      if (complete) return;
      p += (92 - p) * 0.05;
      paint(p);
    }, 60);

    const finish = () => {
      if (loaded) return;
      loaded = true;
      // performance.now() = time since the page started loading
      const wait = Math.max(0, MIN_MS - performance.now());
      timers.push(
        setTimeout(() => {
          complete = true;
          clearInterval(tick);
          paint(100);
          timers.push(
            setTimeout(() => {
              setPhase("leaving");
              timers.push(setTimeout(() => setPhase("done"), FADE_MS));
            }, DONE_MS),
          );
        }, wait),
      );
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    timers.push(setTimeout(finish, MAX_MS));

    return () => {
      clearInterval(tick);
      window.removeEventListener("load", finish);
      timers.forEach(clearTimeout);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`ld${phase === "leaving" ? " out" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={phase === "loading"}
    >
      <style>{CSS}</style>
      <div className="ld-glow" aria-hidden="true" />
      <div className="ld-box">
        <div className="ld-core" aria-hidden="true">
          <span className="ld-ring c" />
          <span className="ld-ring d" />
          <span className="ld-ring t" />
          <span className="ld-ring a" />
          <span className="ld-ring b" />
          <span className="ld-orbit" />
          <span className="ld-orbit r" />
          <span className="ld-halo" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="ld-icon" src={logoSrc} alt="" draggable={false} />
        </div>

        <p className="ld-name" aria-hidden="true">
          <b>max</b>design
        </p>

        <div className="ld-prog" aria-hidden="true">
          <div className="ld-bar">
            <span className="ld-fill" ref={fillRef} />
          </div>
          <div className="ld-meta">
            <span>Loading</span>
            <span className="ld-pct" ref={pctRef}>
              0%
            </span>
          </div>
        </div>
        <span className="ld-sr">Loading</span>
      </div>
    </div>
  );
}

/*
  ── app/layout.tsx ──────────────────────────────────────────
  import Loader from "@/components/Loader";   // adjust the path to where you save this file

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body>
          <Loader />
          {children}
        </body>
      </html>
    );
  }
*/
