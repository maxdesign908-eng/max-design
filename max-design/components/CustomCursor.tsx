"use client";

import { useEffect, useRef, useState } from "react";

/*
  Custom cursor: red rounded shape (#E71117), 39.9 x 38.24 px, centred on the pointer.
  - follows the mouse with a small smooth delay
  - grows over links / buttons, shrinks while pressed
  - hides over text fields (normal text cursor shows there) and when the mouse leaves the window
  - only on devices with a real mouse (hover + fine pointer); touch screens keep normal behaviour
  - "reduce motion": no delay, no grow animation
  Put <CustomCursor /> once in app/layout.tsx or app/page.tsx.
*/

const INTERACTIVE =
  'a, button, summary, select, label, [role="button"], [role="link"], [data-cursor="hover"]';
const TEXT_FIELD = 'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

// Rounded quadrilateral traced from your Vector.png (viewBox = its size)
const SHAPE =
  "M3.37 8.65A5.21 5.21 0 0 0 0.55 15.86L8.05 30.85A6.37 6.37 0 0 0 14.26 34.35L31.35 32.99A5.3 5.3 0 0 0 36.16 26.9L32.69 4.56A5.39 5.39 0 0 0 25.46 0.34Z";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // only for real mouse devices
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!enabled || !el) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0, ty = 0, x = 0, y = 0;
    let first = true, raf = 0, last = 0;

    const draw = (now: number) => {
      const dt = Math.min((now - (last || now)) / 1000, 0.05);
      last = now;
      const k = reduce ? 1 : 1 - Math.exp(-dt / 0.045); // ~45ms delay
      x += (tx - x) * k;
      y += (ty - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) raf = requestAnimationFrame(draw);
      else { raf = 0; last = 0; }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = e.clientX; ty = e.clientY;
      if (first) { x = tx; y = ty; first = false; el.style.transform = `translate3d(${x}px, ${y}px, 0)`; }
      el.dataset.visible = "true";
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      el.dataset.hover = t?.closest?.(INTERACTIVE) ? "true" : "false";
      el.dataset.hide = t?.closest?.(TEXT_FIELD) ? "true" : "false";
    };
    const onDown = () => (el.dataset.down = "true");
    const onUp = () => (el.dataset.down = "false");
    const onLeave = () => (el.dataset.visible = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* hide the normal cursor everywhere (text fields keep the I-beam) */}
      <style>{`
        html.custom-cursor, html.custom-cursor * { cursor: none !important; }
        html.custom-cursor input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),
        html.custom-cursor textarea,
        html.custom-cursor [contenteditable="true"] { cursor: text !important; }
      `}</style>

      <div
        ref={box}
        aria-hidden="true"
        data-visible="false"
        data-hover="false"
        data-down="false"
        data-hide="false"
        className="group pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        {/* centred on the pointer */}
        <div className="absolute -top-[19.12px] -left-[19.95px] opacity-0 transition-opacity duration-150 group-data-[hide=true]:!opacity-0 group-data-[visible=true]:opacity-100">
          <svg
            width="29.9"
            height="28.24"
            viewBox="0 0 36.23 34.37"
            preserveAspectRatio="none"
            className="block scale-100 transition-transform duration-200 ease-out group-data-[down=true]:scale-[0.82] group-data-[hover=true]:scale-[1.6] motion-reduce:transition-none"
          >
            <path d={SHAPE} fill="#E71117" />
          </svg>
        </div>
      </div>
    </>
  );
}
