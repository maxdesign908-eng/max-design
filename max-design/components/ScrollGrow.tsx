"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Target = { left: number; top: number; width: number; height: number; radius: number };

type Props = {
  children: ReactNode;
  className?: string;
  /** Figma final frame (1920 artboard): 1741 x 978, left 89, top 1102, radius 12 */
  target?: Target;
  /** Spring stiffness. Zyada = tez/sharp. */
  stiffness?: number;
  /** Spring damping. 1 = critically damped (no bounce). */
  damping?: number;
};

const DESIGN_W = 1920;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
/** Narm start + narm end (sine ease-in-out): scroll ke saath video natural lagti hai */
const ease = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);

/**
 * Scroll par chhoti video -> Figma ke final frame tak bari hoti hai.
 *
 * - Sirf transform (GPU) use hota hai, layout nahi chhera jata.
 * - Progress scroll ke saath chalta hai: video ka grow us waqt poora hota hai jab
 *   final frame screen par vertically center ho jata hai (har screen height par theek).
 * - Spring (inertia) scroll ko follow karta hai -> jhatka nahi, smooth motion.
 * - Neeche wale section ke liye Hero.tsx mein spacer (track) hai, is liye video
 *   About ke upar/neeche overlap nahi karti.
 */
export default function ScrollGrow({
  children,
  className = "",
  target = { left: 89, top: 1102, width: 1741, height: 978, radius: 12 },
  stiffness = 170,
  damping = 1,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const desktop = window.matchMedia("(min-width: 1024px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let natural = { x: 0, y: 0, w: 1, h: 1 }; // page coordinates
    let origin = { x: 0, y: 0 }; // artboard (stage) ka page top-left
    let pos = 0; // spring position (0..1)
    let vel = 0;
    let raf = 0;
    let last = 0;

    const unit = () => Math.min(document.documentElement.clientWidth, DESIGN_W) / DESIGN_W;

    const reset = () => {
      el.style.transform = "";
      el.style.borderRadius = "";
      el.style.willChange = "";
      el.style.transformOrigin = "";
    };

    const measure = () => {
      el.style.transform = "none";
      const r = el.getBoundingClientRect();
      const anchor = (el.offsetParent as HTMLElement | null) ?? el.parentElement!;
      const a = anchor.getBoundingClientRect();
      natural = { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
      origin = { x: a.left + scrollX, y: a.top + scrollY };
    };

    const render = (p: number) => {
      const u = unit();
      const e = ease(clamp01(p));
      const sx = 1 + ((target.width * u) / natural.w - 1) * e;
      const sy = 1 + ((target.height * u) / natural.h - 1) * e;
      const tx = (origin.x + target.left * u - natural.x) * e;
      const ty = (origin.y + target.top * u - natural.y) * e;
      el.style.transformOrigin = "0 0";
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${sx}, ${sy})`;
      el.style.borderRadius = `${target.radius / sx}px / ${target.radius / sy}px`;
      el.style.overflow = "hidden";
      el.style.willChange = p > 0 && p < 1 ? "transform" : "";
    };

    /** 0..1: scroll jahan final frame screen par center ho, wahan 1 */
    const want = () => {
      const u = unit();
      const topGap = Math.max(24, (innerHeight - target.height * u) / 2);
      const span = Math.max(1, target.top * u - topGap);
      return clamp01((scrollY - origin.y) / span);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - (last || now - 16.67)) / 1000, 0.05);
      last = now;
      const goal = want();
      const steps = Math.ceil(dt / 0.004) || 1;
      const h = dt / steps;
      const c = 2 * Math.sqrt(stiffness) * damping;
      for (let i = 0; i < steps; i++) {
        vel += (stiffness * (goal - pos) - c * vel) * h;
        pos += vel * h;
      }
      if (Math.abs(goal - pos) < 0.0003 && Math.abs(vel) < 0.002) {
        pos = goal;
        vel = 0;
        render(pos);
        raf = 0;
        last = 0;
        return;
      }
      render(pos);
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const setup = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      vel = 0;
      if (!desktop.matches) {
        reset();
        return;
      }
      measure();
      pos = want();
      render(pos);
    };

    const onScroll = () => {
      if (!desktop.matches) return;
      if (reduce.matches) {
        pos = want();
        render(pos);
      } else kick();
    };

    setup();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", setup);
    desktop.addEventListener("change", setup);
    const ro = new ResizeObserver(setup); // fonts/images ke baad layout shift
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", setup);
      desktop.removeEventListener("change", setup);
      ro.disconnect();
      el.style.overflow = "";
      reset();
    };
  }, [target.left, target.top, target.width, target.height, target.radius, stiffness, damping]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}