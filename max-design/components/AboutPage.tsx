"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

/*
  About Us page (Figma 1920 wide). Everything below the navbar.

  Desktop (> 900px): every size is N * var(--u), 1 Figma px (scales with the page, capped at 1920).
  Tablet / phone (<= 900px): everything stacks in one column with fluid sizes.

  Numbers from your Figma:
    block ......... 1726 x 650.56, 97 from the left, 494 from the top (heading row ends at 399 -> 95 gap)
    picture ....... 559 x 468, radius 20, centred in the block height   |   gap picture -> text 170
    text column ... 997 wide: heading 997 x 262 (Poppins Medium 80 / 112%, -4%), 24 gap,
                    paragraph 972 x 143 (Regular 32 / 48, -4%), 24 gap, tab card 996.83 x 197.56 (radius 10)
    tab row ....... 937 x 46 at 35 / 30 inside the card; label Poppins SemiBold 18 / 18, -0.72px
*/

const TABS = [
  {
    id: "mission",
    label: "Our Mission",
    lines: [
      "We build bold identities that speak your story visually and verbally. From websites to packaging,",
      "we design experiences that are beautiful and functional. We don\u2019t just make things look good framer",
      "website template crafted.",
    ],
  },
  {
    id: "vision",
    label: "Our Vision",
    lines: [
      "We build bold identities that speak your story visually and verbally. From websites to packaging,",
      "we design experiences that are beautiful and functional. We don\u2019t just make things look good framer",
      "website template crafted.",
    ],
  },
  {
    id: "value",
    label: "Our Value",
    lines: [
      "We build bold identities that speak your story visually and verbally. From websites to packaging,",
      "we design experiences that are beautiful and functional. We don\u2019t just make things look good framer",
      "website template crafted.",
    ],
  },
];

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

export default function AboutPage() {
  const [active, setActive] = useState(0);
  const [blockRef, blockIn] = useInView<HTMLDivElement>(0.15);

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
            className={`${SIDE} mt-[calc(180*var(--u))] [@media(max-width:900px)]:mt-[32px]`}
          >
            <div className="relative flex h-[calc(121*var(--u))] items-start border-b border-white/[0.26] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:items-center [@media(max-width:900px)]:justify-between [@media(max-width:900px)]:gap-[16px] [@media(max-width:900px)]:pb-[22px]">
              <h1 className="m-0 w-[calc(1136*var(--u))] text-[length:calc(80*var(--u))] leading-[0.96] font-medium tracking-[-0.08em] text-white [@media(max-width:900px)]:w-auto [@media(max-width:900px)]:text-[length:clamp(30px,7.4vw,64px)] [@media(max-width:900px)]:leading-[1.08]">
                <Words text="About Us" delay={150} step={110} />
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


          {/* ───────── picture + text block (1726 x 650.56) ───────── */}
          <section
            ref={blockRef}
            className={`${SIDE} mt-[calc(95*var(--u))] pb-[calc(120*var(--u))] [@media(max-width:900px)]:mt-[40px] [@media(max-width:900px)]:pb-[72px]`}
          >
            <div className="flex h-[calc(650.56*var(--u))] items-center gap-[calc(170*var(--u))] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:flex-col [@media(max-width:900px)]:items-stretch [@media(max-width:900px)]:gap-[32px]">
              {/* picture 559 x 468, radius 20 */}
              <div
                className={`relative h-[calc(468*var(--u))] w-[calc(559*var(--u))] flex-none overflow-hidden rounded-[calc(20*var(--u))] transition-[opacity,translate] duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-full [@media(max-width:900px)]:aspect-[559/468] [@media(max-width:900px)]:rounded-[20px] ${
                  blockIn ? "translate-y-0 opacity-100" : "translate-y-[calc(48*var(--u))] opacity-0"
                }`}
              >
                <Image
                  src="/images/head.jpg"
                  alt="Silhouette of a head lit by red light"
                  fill
                  sizes="(max-width: 900px) 100vw, 559px"
                  priority
                  className={`object-cover object-[center_20%] transition-[scale] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    blockIn ? "scale-100" : "scale-[1.15]"
                  }`}
                />
              </div>

              {/* text column 997 wide */}
              <div className="flex h-[calc(650.56*var(--u))] w-[calc(997*var(--u))] min-w-0 flex-none flex-col [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-full">
                <h2 className="m-0 h-[calc(262*var(--u))] text-[length:calc(80*var(--u))] leading-[1.12] font-medium tracking-[-0.04em] text-white [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:text-[length:clamp(32px,8vw,60px)]">
                  <Words text="Design solutions for startups and growing brands." delay={150} step={90} />
                </h2>

                <p className="m-0 mt-[calc(24*var(--u))] h-[calc(143*var(--u))] w-[calc(972*var(--u))] text-[length:calc(32*var(--u))] leading-[calc(48*var(--u))] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:mt-[20px] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-full [@media(max-width:900px)]:text-[length:clamp(17px,4.4vw,26px)] [@media(max-width:900px)]:leading-[1.5]">
                  <Words
                    mode="fade"
                    step={22}
                    text="At Max Design, we turn ideas into powerful visual experiences. With strategy, creativity, and innovation, we create brands that connect, stand out, and leave a lasting impression."
                  />
                </p>

                {/* tab card 996.83 x 197.56, radius 10 */}
                <div
                  style={{ transitionDelay: blockIn ? "450ms" : "0ms" }}
                  className={`relative mt-[calc(24*var(--u))] h-[calc(197.56*var(--u))] w-[calc(996.83*var(--u))] flex-none rounded-[calc(10*var(--u))] bg-white/[0.047] shadow-[inset_0_-6px_10px_-6px_rgba(255,255,255,0.10)] transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(max-width:900px)]:mt-[24px] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-full [@media(max-width:900px)]:rounded-[10px] [@media(max-width:900px)]:px-[18px] [@media(max-width:900px)]:py-[20px] ${
                    blockIn ? "translate-y-0 opacity-100" : "translate-y-[calc(36*var(--u))] opacity-0"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[inherit] border border-white/[0.18] border-t-white/[0.3]"
                  />

                  {/* tab row 937 x 46 at top 35 / left 30 */}
                  <div
                    role="tablist"
                    aria-label="About Max Design"
                    className="absolute top-[calc(35*var(--u))] left-[calc(30*var(--u))] flex h-[calc(46*var(--u))] w-[calc(937*var(--u))] items-start gap-[calc(48*var(--u))] [@media(max-width:900px)]:static [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-auto [@media(max-width:900px)]:flex-wrap [@media(max-width:900px)]:gap-x-[24px] [@media(max-width:900px)]:gap-y-[8px]"
                  >
                    {TABS.map((tab, i) => (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        id={`about-tab-${tab.id}`}
                        aria-selected={i === active}
                        aria-controls={`about-panel-${tab.id}`}
                        onClick={() => setActive(i)}
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        className={`m-0 cursor-pointer border-0 bg-transparent p-0 pt-[calc(3*var(--u))] text-left text-[length:calc(18*var(--u))] leading-[calc(18*var(--u))] font-semibold tracking-[-0.72px] whitespace-nowrap transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E71117] [@media(max-width:900px)]:pt-0 [@media(max-width:900px)]:text-[length:16px] [@media(max-width:900px)]:leading-[1.2] ${
                          i === active ? "text-white" : "text-white/50 hover:text-white/80"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* the three texts sit on top of each other; the open one fades up */}
                  <div className="absolute top-[calc(73*var(--u))] right-[calc(30*var(--u))] left-[calc(30*var(--u))] grid [@media(max-width:900px)]:static [@media(max-width:900px)]:mt-[14px]">
                    {TABS.map((tab, i) => (
                      <p
                        key={tab.id}
                        role="tabpanel"
                        id={`about-panel-${tab.id}`}
                        aria-labelledby={`about-tab-${tab.id}`}
                        aria-hidden={i !== active}
                        className={`col-start-1 row-start-1 m-0 text-[length:calc(16*var(--u))] leading-[1.7] font-normal tracking-[-0.02em] text-white/70 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(max-width:900px)]:text-[length:clamp(13px,3.6vw,16px)] [@media(max-width:900px)]:leading-[1.65] ${
                          i === active
                            ? "translate-y-0 opacity-100 delay-100"
                            : "pointer-events-none translate-y-[calc(10*var(--u))] opacity-0"
                        }`}
                      >
                        {tab.lines.map((line, li) => (
                          <span key={li} className="block whitespace-nowrap [@media(max-width:900px)]:inline [@media(max-width:900px)]:whitespace-normal">
                            {line}{" "}
                          </span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
