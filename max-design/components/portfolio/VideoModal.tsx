"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { PortfolioItem } from "@/data/portfolio";

/**
 * Pop-up video player.
 * Card par click -> video screen ke upar aati hai, peeche ka poora page blur ho jata hai.
 * Band karne ke liye: X button, backdrop par click, ya Esc.
 */
export default function VideoModal({
  item,
  onClose,
}: {
  item: PortfolioItem | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false); // portal tabhi jab browser me ho
  const [visible, setVisible] = useState(false); // fade/scale animation
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const src = item ? (item.modalVideo ?? item.video) : undefined;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!item) {
      setVisible(false);
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // peeche ka page scroll na ho
    const raf = requestAnimationFrame(() => setVisible(true));
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [item]);

  if (!mounted || !item || !src) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={() => onCloseRef.current()}
      className={`fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 p-[16px] backdrop-blur-2xl transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close video"
        onClick={(e) => {
          e.stopPropagation();
          onCloseRef.current();
        }}
        className="absolute top-[16px] right-[16px] z-10 grid h-[44px] w-[44px] cursor-pointer place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="h-[20px] w-[20px]"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <video
        key={src}
        src={src}
        poster={item.poster ?? item.image}
        controls
        autoPlay
        playsInline
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[88vh] max-w-[92vw] rounded-[14px] bg-black shadow-[0_30px_80px_rgba(0,0,0,0.6)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      />
    </div>,
    document.body,
  );
}
