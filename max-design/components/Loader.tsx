"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/*
  Loader for MAX design. It has TWO modes:

  1) FIRST VISIT / REFRESH  -> full screen (covers everything, no navbar).
  2) CLICKING AN INTERNAL LINK (Portfolio, Services, case studies ...) -> the same loader, but it
     starts BELOW the navbar, so the navbar stays visible the whole time.

  HOW IT WORKS
  - Mode 1 waits for window "load" (at least MIN_MS, at most MAX_MS).
  - Mode 2: a click on any internal link (<Link> or <a>) to a different page shows the loader
    right away. When the new page is there (the pathname changes) it finishes and fades out.
    It stays at least ROUTE_MIN_MS so it never just blinks, and leaves after ROUTE_MAX_MS.
  - The progress bar / % moves smoothly and reaches 100% when the page is ready.
  - While it is visible the page cannot scroll, and the page width never changes (no jump / zoom
    when the loader appears or leaves).
  - Also works for browser Back / Forward. For a button that uses router.push() (not a link) call
        document.dispatchEvent(new Event("page-loader:start"));
    right before router.push(...).
  - Needs /public/images/loader-icon.webp (your logo icon, square).

  Use it ONCE, in app/layout.tsx:  <Loader />  (see the bottom of this file).
*/

const MIN_MS = 1800; // first visit: shortest time the loader stays
const MAX_MS = 6000; // first visit: never block the site longer than this
const ROUTE_MIN_MS = 900; // link click: shortest time the loader stays
const ROUTE_MAX_MS = 5000; // link click: never block longer than this
const DONE_MS = 350; // pause on 100% before fading (first visit)
const ROUTE_DONE_MS = 150; // pause on 100% before fading (link click)
const FADE_MS = 700; // fade-out time

const CSS = `
  /* first visit: lock scroll without moving the page (scrollbar space stays reserved).
     On link clicks the scrollbar is not touched at all, so the page width never changes. */
  html:has(.ld:not(.route)) { overflow: hidden; scrollbar-gutter: stable; background: #050505; }

  .ld {
    --red: #E71117;
    position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; overflow: hidden;
    background: #050505; color: #fff; font-family: Poppins, system-ui, sans-serif; letter-spacing: -0.04em;
    animation: ldIn .35s ease .1s both; will-change: opacity;
  }
  .ld.route { animation: ldIn .2s ease both; overscroll-behavior: contain; touch-action: none; }
  .ld.route.out { animation: ldOut 450ms ease forwards; }  /* link click: plain fade, no zoom */
  .ld.out { animation: ldOut ${FADE_MS}ms ease forwards; pointer-events: none; }
  .ld:not(.route).out .ld-box { animation: ldBoxOut ${FADE_MS}ms cubic-bezier(.4,0,.2,1) forwards; }

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

/* height of the navbar that is visible at the top of the screen right now (0 = no navbar -> full screen) */
function visibleNavBottom(selector: string): number {
  let bottom = 0;
  document.querySelectorAll(selector).forEach((el) => {
    const r = el.getBoundingClientRect();
    const looksLikeNavbar =
      r.width >= window.innerWidth * 0.5 && r.height <= 200 && r.top <= 24 && r.bottom > 0;
    if (looksLikeNavbar) bottom = Math.max(bottom, Math.round(r.bottom));
  });
  return bottom;
}

type Phase = "loading" | "leaving" | "done";

export default function Loader({
  logoSrc = "/images/loader-icon.webp",
  navSelector = "header, nav",
}: {
  /** the logo icon shown in the middle (square image, put the file in /public/images) */
  logoSrc?: string;
  /** CSS selector of your navbar. On link clicks the loader starts right below it. */
  navSelector?: string;
}) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("loading");
  const [route, setRoute] = useState(false); // false = first visit (full screen), true = link click
  const [top, setTop] = useState(0); // where the loader starts (below the navbar) on link clicks
  const fillRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const api = useRef<{ routeDone: () => void }>({ routeDone: () => {} });
  const pathRef = useRef(pathname);

  // block wheel / touch scrolling behind the loader (without touching the scrollbar)
  const overlayRef = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const stop = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let tick: ReturnType<typeof setInterval> | undefined;
    let p = 0;
    let complete = false;
    let initialActive = true; // the first-visit loader is still showing
    let routeActive = false; // a link-click loader is showing
    let routeFinishing = false;
    let routeStart = 0;
    let loaded = false;

    // draw the progress straight into the DOM (no re-render every tick)
    const paint = (v: number) => {
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${v / 100})`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(v)}%`;
    };

    // eases toward 92% while the page is still loading
    const startTick = () => {
      if (tick) clearInterval(tick);
      p = 0;
      complete = false;
      paint(0);
      tick = setInterval(() => {
        if (complete) return;
        p += (92 - p) * 0.05;
        paint(p);
      }, 60);
    };

    // go to 100%, pause, fade out, remove
    const leave = (doneMs: number) => {
      complete = true;
      if (tick) clearInterval(tick);
      paint(100);
      timers.push(
        setTimeout(() => {
          setPhase("leaving");
          timers.push(
            setTimeout(() => {
              setPhase("done");
              initialActive = false;
              routeActive = false;
              routeFinishing = false;
            }, FADE_MS),
          );
        }, doneMs),
      );
    };

    /* ───── mode 1: first visit ───── */
    startTick();
    const finishInitial = () => {
      if (loaded) return;
      loaded = true;
      // performance.now() = time since the page started loading
      const wait = Math.max(0, MIN_MS - performance.now());
      timers.push(setTimeout(() => leave(DONE_MS), wait));
    };
    if (document.readyState === "complete") finishInitial();
    else window.addEventListener("load", finishInitial, { once: true });
    timers.push(setTimeout(finishInitial, MAX_MS));

    /* ───── mode 2: click on an internal link ───── */
    const routeDone = () => {
      if (!routeActive || routeFinishing) return;
      routeFinishing = true;
      const wait = Math.max(0, ROUTE_MIN_MS - (performance.now() - routeStart));
      timers.push(setTimeout(() => leave(ROUTE_DONE_MS), wait));
    };
    api.current = { routeDone };

    // show the link-click loader (starts below the navbar; full screen if there is no navbar)
    const begin = () => {
      if (initialActive || routeActive) return;
      routeActive = true;
      routeFinishing = false;
      routeStart = performance.now();
      setTop(visibleNavBottom(navSelector));
      setRoute(true);
      setPhase("loading");
      startTick();
      timers.push(setTimeout(routeDone, ROUTE_MAX_MS));
    };

    const onClick = (e: MouseEvent) => {
      if (initialActive || routeActive) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;
      if (a.getAttribute("rel")?.includes("external")) return;

      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return; // other website
      if (url.pathname === window.location.pathname) return; // same page / only #hash

      begin();
    };

    // browser Back / Forward buttons
    const onPop = () => {
      if (window.location.pathname !== pathRef.current) begin();
    };

    // manual trigger: document.dispatchEvent(new Event("page-loader:start"))
    const onManual = () => begin();

    document.addEventListener("click", onClick, true); // capture: works even if a link stops the click
    window.addEventListener("popstate", onPop);
    document.addEventListener("page-loader:start", onManual);

    return () => {
      if (tick) clearInterval(tick);
      window.removeEventListener("load", finishInitial);
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("page-loader:start", onManual);
      timers.forEach(clearTimeout);
    };
  }, [navSelector]);

  // the new page is here -> finish the link-click loader
  useEffect(() => {
    pathRef.current = pathname;
    api.current.routeDone();
  }, [pathname]);

  if (phase === "done") return null;

  return (
    <div
      ref={overlayRef}
      className={`ld${route ? " route" : ""}${phase === "leaving" ? " out" : ""}`}
      style={route ? { top } : undefined}
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
