
"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE =
  'a, button, summary, select, label, [role="button"], [role="link"], [data-cursor="hover"]';

const TEXT_FIELD =
  'input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

const SHAPE =
  "M37.62 0.00 L34.06 0.00 L34.00 0.38 L33.62 0.75 L32.38 1.25 L31.81 1.75 L30.88 2.25 L30.00 2.94 L27.94 4.12 L27.25 4.69 L26.31 5.12 L23.94 6.81 L23.31 7.06 L22.38 7.81 L21.56 8.12 L20.81 8.75 L19.88 9.25 L17.69 10.81 L15.31 12.12 L14.56 12.75 L12.31 14.12 L11.38 14.88 L10.56 15.19 L9.75 15.81 L7.38 17.25 L6.62 17.88 L5.81 18.25 L5.00 18.88 L4.56 19.06 L3.44 20.00 L2.25 21.38 L1.75 22.38 L1.31 22.94 L0.69 24.50 L0.31 24.88 L0.00 24.94 L0.00 30.50 L0.50 30.75 L0.81 31.38 L1.25 33.94 L1.81 35.44 L2.19 37.56 L2.81 39.38 L3.12 41.31 L3.88 43.62 L4.12 45.31 L4.69 46.75 L5.25 49.75 L6.06 51.50 L7.19 52.44 L7.31 52.94 L10.56 52.94 L10.56 52.69 L10.94 52.31 L11.56 52.06 L12.94 51.81 L15.00 51.06 L16.31 50.81 L18.19 50.06 L19.75 49.81 L21.62 49.06 L22.94 48.81 L25.00 48.06 L26.31 47.81 L28.19 47.06 L29.69 46.81 L30.75 46.31 L32.25 45.88 L34.69 44.06 L36.69 41.38 L37.19 39.81 L37.69 38.75 L37.94 37.31 L38.12 31.00 L38.75 23.62 L38.75 21.25 L38.88 20.50 L38.94 16.00 L39.25 9.50 L39.62 8.19 L39.62 7.31 L39.94 6.88 L39.94 3.38 L39.38 2.94 L38.75 1.38 L37.69 0.44Z";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Enable only for devices with a mouse or trackpad.
  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    );

    const sync = () => setEnabled(mq.matches);

    sync();
    mq.addEventListener("change", sync);

    return () => mq.removeEventListener("change", sync);
  }, []);

  // Keep the cursor active across client-side page navigation.
  useEffect(() => {
    const el = box.current;
    if (!enabled || !el) return;

    const root = document.documentElement;

    root.classList.add("custom-cursor");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let firstMove = true;
    let animationFrame = 0;
    let lastTime = 0;

    const draw = (now: number) => {
      const dt = Math.min(
        (now - (lastTime || now)) / 1000,
        0.05
      );

      lastTime = now;

      const factor = reduceMotion
        ? 1
        : 1 - Math.exp(-dt / 0.045);

      currentX += (targetX - currentX) * factor;
      currentY += (targetY - currentY) * factor;

      el.style.transform =
        `translate3d(${currentX}px, ${currentY}px, 0)`;

      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        animationFrame = requestAnimationFrame(draw);
      } else {
        animationFrame = 0;
        lastTime = 0;
      }
    };

    const moveCursor = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      targetX = e.clientX;
      targetY = e.clientY;

      if (firstMove) {
        currentX = targetX;
        currentY = targetY;
        firstMove = false;

        el.style.transform =
          `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      el.dataset.visible = "true";

      if (!animationFrame) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const handlePointerOver = (e: PointerEvent) => {
      const target = e.target as Element | null;

      el.dataset.hover = target?.closest?.(INTERACTIVE)
        ? "true"
        : "false";

      el.dataset.hide = target?.closest?.(TEXT_FIELD)
        ? "true"
        : "false";
    };

    const handlePointerDown = () => {
      el.dataset.down = "true";
    };

    const handlePointerUp = () => {
      el.dataset.down = "false";
    };

    const handlePointerLeave = () => {
      el.dataset.visible = "false";
    };

    const handleWindowFocus = () => {
      // Wait for the next actual pointer event before showing.
      firstMove = true;
      el.dataset.visible = "false";
    };

    window.addEventListener("pointermove", moveCursor, {
      passive: true,
    });

    window.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });

    window.addEventListener("pointerdown", handlePointerDown, {
      passive: true,
    });

    window.addEventListener("pointerup", handlePointerUp, {
      passive: true,
    });

    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    window.addEventListener("blur", handlePointerLeave);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("pointermove", moveCursor);
      window.removeEventListener(
        "pointerover",
        handlePointerOver
      );
      window.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
      window.removeEventListener("pointerup", handlePointerUp);

      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      window.removeEventListener("blur", handlePointerLeave);
      window.removeEventListener("focus", handleWindowFocus);

      // Remove the class only when this effect is cleaned up.
      root.classList.remove("custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <style>{`
        html.custom-cursor,
        html.custom-cursor * {
          cursor: none !important;
        }

        html.custom-cursor input:not([type="button"]):not([type="submit"]):not([type="checkbox"]):not([type="radio"]),
        html.custom-cursor textarea,
        html.custom-cursor [contenteditable="true"] {
          cursor: text !important;
        }
      `}</style>

      <div
        ref={box}
        aria-hidden="true"
        data-visible="false"
        data-hover="false"
        data-down="false"
        data-hide="false"
        className="group pointer-events-none fixed left-0 top-0 z-[9999] will-change-transform"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
        }}
      >
        <div className="absolute -left-[20px] -top-[26.5px] opacity-0 transition-opacity duration-150 group-data-[hide=true]:!opacity-0 group-data-[visible=true]:opacity-100">
          <svg
            width="27"
            height="30"
            viewBox="0 0 40 53"
            className="block scale-100 overflow-visible transition-transform duration-200 ease-out group-data-[down=true]:scale-[0.82] group-data-[hover=true]:scale-[1.3] motion-reduce:transition-none"
          >
            <path d={SHAPE} fill="#E71117" />
          </svg>
        </div>
      </div>
    </>
  );
}
