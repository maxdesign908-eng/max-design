"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CaseStudy } from "@/data/caseStudies";

/**
 * Lambi image wala page (jaise Roche Melgar): sirf image, navbar aur footer nahi.
 *
 * - Image tukdon me hai; tukde bina gap ke ek ke neeche ek lagte hain, aur har tukda
 *   pichle ke upar 1px chadha hota hai taake zoom par bhi koi patli line na dikhe.
 * - PC / tablet (768px+): bari WebP. Phone (767px tak): chhoti WebP (1170px = 3x phone).
 * - Pehle 2 tukde foran load hote hain, baaki scroll karne par (lazy), isliye page tez khulta hai.
 * - Animation: page khulte hi pehla tukda halka sa fade + upar uthta hai (sirf CSS, JS ke bagair bhi chalta hai).
 *   Baaki tukde scroll karke screen par aate hain to ek ek karke fade-in hote hain.
 *   Band karna ho to neeche <Reveal> ki jagah seedha <picture> likh do.
 * - Upar left me chhota gol "wapas" button hai (navbar nahi). Hatana ho to neeche <Link> wala hissa delete kar do.
 */

/** Neeche wale tukde: jab screen ke qareeb aayein tab fade + 28px upar se aayein */
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // "visible" = default (server par bhi). Sirf screen se neeche wale tukde chhupa kar baad me dikhate hain.
  const [state, setState] = useState<"visible" | "hidden" | "shown">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return; // pehle se screen par hai

    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className ?? ""} transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[opacity,transform] ${
        state === "hidden" ? "translate-y-[28px] opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      {children}
    </div>
  );
}

export default function LongImageView({ study }: { study: CaseStudy }) {
  const image = study.longImage;
  if (!image) return null;

  return (
    <section className="relative w-full bg-black">
      <style>{`
        @keyframes lv-enter { from { opacity: 0; transform: translateY(32px) scale(0.985); } to { opacity: 1; transform: none; } }
        @keyframes lv-back  { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
        .lv-first { animation: lv-enter 1000ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .lv-back  { animation: lv-back 700ms 350ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) { .lv-first, .lv-back { animation: none; } }
      `}</style>

      <h1 className="sr-only">{study.title}</h1>

      <Link
        href="/portfolio"
        aria-label="Back to portfolio"
        className="lv-back fixed top-[16px] left-[16px] z-50 grid h-[44px] w-[44px] place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 focus-visible:outline focus-visible:outline-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px]" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </Link>

      <div className="flex w-full flex-col">
        {image.slices.map((s, i) => {
          const pic = (
            <picture className="block w-full">
              <source media="(max-width: 767px)" srcSet={s.mobile} width={s.mw} height={s.mh} />
              <img
                src={s.desktop}
                width={s.w}
                height={s.h}
                alt={i === 0 ? image.alt : ""}
                loading={i < 2 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                decoding="async"
                className="block h-auto w-full"
              />
            </picture>
          );
          const overlap = i > 0 ? "-mt-[1px]" : "";
          return i === 0 ? (
            <div key={s.desktop} className="lv-first">{pic}</div>
          ) : (
            <Reveal key={s.desktop} className={overlap}>
              {pic}
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}