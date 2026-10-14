"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

/*
  Blog page: just the heading row (same as the service pages): the word-by-word heading,
  the chrome logo turning 360deg, and the thin divider line under them. Same Figma sizes as
  the Brand Design heading row (1727 x 121 at 1920 wide, 97 side padding, 80px Poppins Medium).
*/

/* side padding: 97 Figma px on desktop, fluid on phones */
const SIDE = "px-[calc(97*var(--u))] [@media(max-width:900px)]:px-[var(--pad)]";

/* ───────── animation helpers (all in this file) ─────────
   (the word "mask" has extra side padding with an equal negative margin: the headings use negative letter-spacing,
    so without it the last letter of every word, e.g. the "e" or the ".", was cut off by overflow-hidden) 
   useInView : true once the element has been scrolled into view (stays true).
   Words     : splits a text into words. "mask" = every word slides up out of a hidden strip,
               "fade" = every word fades up. Words come in one after another (step ms apart).
   Nothing moves when the visitor has "reduce motion" turned on. */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function Words({
  text,
  mode = "mask",
  delay = 0,
  step = 70,
}: {
  text: string;
  mode?: "mask" | "fade";
  delay?: number;
  step?: number;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.2);
  const words = text.split(" ");
  return (
    <span ref={ref} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {mode === "mask" ? (
            <span
              aria-hidden="true"
              className="-mt-[0.14em] -mr-[0.2em] -mb-[0.16em] -ml-[0.1em] inline-block overflow-hidden pt-[0.14em] pr-[0.2em] pb-[0.16em] pl-[0.1em] align-top"
            >
              <span
                style={{ transitionDelay: inView ? `${delay + i * step}ms` : "0ms" }}
                className={`inline-block origin-bottom-left transition-[translate,rotate] duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  inView ? "translate-y-0 rotate-0" : "translate-y-[125%] rotate-[5deg]"
                }`}
              >
                {w}
              </span>
            </span>
          ) : (
            <span
              aria-hidden="true"
              style={{ transitionDelay: inView ? `${delay + i * step}ms` : "0ms" }}
              className={`inline-block transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                inView ? "translate-y-0 opacity-100" : "translate-y-[0.6em] opacity-0"
              }`}
            >
              {w}
            </span>
          )}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

export default function BlogPage() {
  return (
    <div className="@container w-full bg-black text-white">
      {/* chrome logo: one full 360deg turn every 12 seconds, nothing when "reduce motion" is on */}
      <style>{`
        @keyframes chromeSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1920px] [--k:var(--u)] [--u:calc(min(100cqw,1920px)_/_1920)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:900px)]:[--pad:clamp(16px,5vw,96px)]">
        <main>
          {/* ───────── heading row (1727 x 121, divider line at the bottom) ───────── */}
          <section
            className={`${SIDE} mt-[calc(180*var(--u))] [@media(max-width:900px)]:mt-[32px] pb-[calc(120*var(--u))] [@media(max-width:900px)]:pb-[72px]`}
          >
            <div className="relative flex h-[calc(121*var(--u))] items-start border-b border-white/[0.26] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:items-center [@media(max-width:900px)]:justify-between [@media(max-width:900px)]:gap-[16px] [@media(max-width:900px)]:pb-[22px]">
              <h1 className="m-0 w-[calc(1136*var(--u))] text-[length:calc(80*var(--u))] leading-[0.96] font-medium tracking-[-0.08em] text-white [@media(max-width:900px)]:w-auto [@media(max-width:900px)]:text-[length:clamp(30px,7.4vw,64px)] [@media(max-width:900px)]:leading-[1.08]">
                <Words text="Beyond Pixels & Possibilities." delay={150} step={110} />
              </h1>
              <Image
                src="/images/services/chrome-shape.webp"
                alt=""
                width={260}
                height={259}
                unoptimized
                priority
                className="animate-[chromeSpin_12s_linear_infinite] will-change-transform motion-reduce:animate-none absolute top-[calc(-14*var(--u))] left-[calc(1620.5*var(--u))] block h-[calc(106.2*var(--u))] w-[calc(106.6*var(--u))] [@media(max-width:900px)]:static [@media(max-width:900px)]:h-[clamp(52px,12vw,96px)] [@media(max-width:900px)]:w-[clamp(52px,12vw,96px)] [@media(max-width:900px)]:flex-none"
              />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
