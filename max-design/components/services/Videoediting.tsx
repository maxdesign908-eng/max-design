"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

/*
  Brand Design service page (Figma 1920 wide). Everything below the navbar.

  Desktop (> 900px): every size is N * var(--u), 1 Figma px (scales with the page, capped at 1920).
  Tablet / phone (<= 900px): fluid sizes with clamp(), cards in 2 / 1 columns.

  Vertical layout from your Figma numbers (page y):
    navbar 0-98 | heading row 278-399 | hero 435-1235 (1920 x 800, picture 1920 x 1279.8 shifted -110)
    intro paragraph 1271-1463 | "Our Expertise" 1553 | paragraph 1623 | tags 1791 / 1851
    "How We Work" 2003 | paragraph 2111 | 4 step cards 2287-2646 (413.5 x 358.78, gap 24)
*/

const STEPS = [
  { n: "01", title: "Discover", lines: ["Understand your goals, audience,", "content, and creative direction."] },
  { n: "02", title: "Plan", lines: ["Define the storytelling, pacing, visual", "style, and editing approach."] },
  { n: "03", title: "Edit", lines: ["Transform raw footage into a polished video", "with strong visuals, sound, and motion."] },
  { n: "04", title: "Launch & Refine", lines: ["Fine-tune every detail and deliver", "a platform ready final video."] },
];

const TAGS: string[][] = [
  ["Social Media Video Editing", "Short-Form Content & Reels", "Brand & Promotional Videos", "Motion Graphics & Animation",],
];

/* the red rounded badge (same shape as your cursor), traced from Figma, 13.48deg, 2.989x */
const BADGE =
  "M3.37 8.65A5.21 5.21 0 0 0 0.55 15.86L8.05 30.85A6.37 6.37 0 0 0 14.26 34.35L31.35 32.99A5.3 5.3 0 0 0 36.16 26.9L32.69 4.56A5.39 5.39 0 0 0 25.46 0.34Z";

/* side padding of every block: 97 Figma px on desktop, fluid on phones */
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

function Star({ on = true }: { on?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 13 13"
      className={`transition-[rotate,scale] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${on ? "rotate-0 scale-100" : "-rotate-180 scale-0"} mr-[calc(5.5*var(--u))] h-[calc(13*var(--u))] w-[calc(13*var(--u))] flex-none [@media(max-width:900px)]:mr-[6px] [@media(max-width:900px)]:h-[12px] [@media(max-width:900px)]:w-[12px]`}
    >
      <path
        fill="currentColor"
        d="M6.5 0C6.9 3.6 9.4 6.1 13 6.5C9.4 6.9 6.9 9.4 6.5 13C6.1 9.4 3.6 6.9 0 6.5C3.6 6.1 6.1 3.6 6.5 0Z"
      />
    </svg>
  );
}

function TagRow({ row, rowIndex }: { row: string[]; rowIndex: number }) {
  const [ref, inView] = useInView<HTMLUListElement>(0.3);
  return (
    <ul
      ref={ref}
      className="m-0 flex list-none flex-wrap gap-x-[calc(24*var(--u))] gap-y-[12px] p-0 [@media(max-width:900px)]:gap-x-[20px]"
    >
      {row.map((tag, i) => (
        <li
          key={tag}
          style={{ transitionDelay: inView ? `${rowIndex * 300 + i * 130}ms` : "0ms" }}
          className={`flex h-[calc(32*var(--u))] items-center text-[length:calc(16*var(--u))] leading-[calc(32*var(--u))] tracking-[-0.04em] whitespace-nowrap text-white/[0.48] transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:text-[length:clamp(13px,3.4vw,16px)] [@media(max-width:900px)]:leading-[1.6] ${
            inView ? "translate-x-0 opacity-100" : "-translate-x-[calc(30*var(--u))] opacity-0"
          }`}
        >
          <Star on={inView} />
          {tag}
        </li>
      ))}
    </ul>
  );
}

export default function Videoediting() {
  const [stepsRef, stepsIn] = useInView<HTMLOListElement>(0.2);

  return (
    <div className="@container w-full bg-black text-white">
      {/* chrome logo: one full 360deg turn every 12 seconds, nothing when "reduce motion" is on */}
      <style>{`
        @keyframes chromeSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes imgSettle {
          from { scale: 1.14; }
          to   { scale: 1; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(70px) scale(0.93); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes textUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1920px] [--k:var(--u)] [--u:calc(min(100cqw,1920px)_/_1920)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:900px)]:[--pad:clamp(16px,5vw,96px)]">

        <main>
          {/* ───────── heading row (1727 x 121, divider line at the bottom) ───────── */}
          <section
            className={`${SIDE} mt-[calc(180*var(--u))] [@media(max-width:900px)]:mt-[32px]`}
          >
            <div className="relative flex h-[calc(121*var(--u))] items-start border-b border-white/[0.26] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:items-center [@media(max-width:900px)]:justify-between [@media(max-width:900px)]:gap-[16px] [@media(max-width:900px)]:pb-[22px]">
              <h1 className="m-0 w-[calc(1250*var(--u))] text-[length:calc(80*var(--u))] leading-[0.96] font-medium tracking-[-0.08em] text-white [@media(max-width:900px)]:w-auto [@media(max-width:900px)]:text-[length:clamp(30px,7.4vw,64px)] [@media(max-width:900px)]:leading-[1.08]">
                <Words text="Visuals That Tell a Story" delay={150} step={110} />
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

          {/* ───────── hero picture (1920 x 800, picture shifted up 110) ───────── */}
          <div className="relative mt-[calc(36*var(--u))] h-[calc(800*var(--u))] w-full overflow-hidden [@media(max-width:900px)]:mt-[28px] [@media(max-width:900px)]:h-[clamp(230px,68vw,520px)]">
            <video
              src="/video/videoediting.mp4"
              muted
              autoPlay
        
              width={2576}
              height={1717}
            
              
              className="animate-[imgSettle_2s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none absolute top-[calc(-110*var(--u))] left-0 block h-auto w-full [@media(max-width:900px)]:top-0 [@media(max-width:900px)]:h-full [@media(max-width:900px)]:object-cover [@media(max-width:900px)]:object-[50%_55%]"
            />
          </div>

          {/* ───────── intro paragraph ───────── */}
          <p
            className={`${SIDE} m-0 mt-[calc(36*var(--u))] text-[length:calc(32*var(--u))] leading-[1.5] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:mt-[32px] [@media(max-width:900px)]:text-[length:clamp(17px,4.4vw,28px)]`}
          >
            <Words
              mode="fade"
              step={22}
              text="We create engaging video content that captures attention, communicates your message, and keeps your audience watching. From social media content and brand videos to promotional campaigns and cinematic edits, our video editing services combine creative storytelling, precise editing, motion, sound, and visual effects to bring your ideas to life."
            />
          </p>

          {/* ───────── Our Expertise ───────── */}
          <section className={`${SIDE} mt-[calc(90*var(--u))] [@media(max-width:900px)]:mt-[56px]`}>
            <h2 className="m-0 h-[calc(70*var(--u))] text-[length:calc(48*var(--u))] leading-[calc(72*var(--u))] font-medium tracking-[-0.08em] text-[#E71117] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:text-[length:clamp(30px,7vw,44px)] [@media(max-width:900px)]:leading-[1.2]">
              <Words text="Our Expertise" step={120} />
            </h2>
            <p className="m-0 text-[length:calc(24*var(--u))] leading-[2] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:mt-[14px] [@media(max-width:900px)]:text-[length:clamp(16px,4vw,22px)] [@media(max-width:900px)]:leading-[1.6]">
              <Words
                mode="fade"
                step={20}
                text="Our video editing process combines creative direction, precise editing, and continuous refinement to turn raw footage into engaging visual stories."
              />
            </p>

            <div className="mt-[calc(24*var(--u))] flex flex-col gap-[calc(28*var(--u))] [@media(max-width:900px)]:mt-[24px] [@media(max-width:900px)]:gap-[12px]">
              {TAGS.map((row, i) => (
                <TagRow key={i} row={row} rowIndex={i} />
              ))}
            </div>
          </section>

          {/* ───────── How We Work ───────── */}
          <section className={`${SIDE} mt-[calc(120*var(--u))] pb-[calc(120*var(--u))] [@media(max-width:900px)]:mt-[72px] [@media(max-width:900px)]:pb-[72px]`}>
            <h2 className="m-0 text-center text-[length:calc(80*var(--u))] leading-[1.12] font-medium tracking-[-0.04em] text-white [@media(max-width:900px)]:text-[length:clamp(36px,10vw,64px)]">
              <Words text="How We Work" step={120} />
            </h2>
            <p className="mx-auto mt-[calc(18.2*var(--u))] mb-0 w-[calc(1300*var(--u))] max-w-full text-center text-[length:calc(32*var(--u))] leading-[1.5] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:mt-[16px] [@media(max-width:900px)]:w-full [@media(max-width:900px)]:text-[length:clamp(16px,4.2vw,24px)]">
              <Words
                mode="fade"
                step={30}
                text="Our UI/UX design process combines research, strategy, and thoughtful design to create intuitive, visually consistent experiences that align with your business goals."
              />
            </p>

            <ol ref={stepsRef} className="m-0 mt-[calc(80*var(--u))] grid list-none grid-cols-4 gap-[calc(24*var(--u))] p-0 [@media(max-width:900px)]:mt-[36px] [@media(max-width:900px)]:grid-cols-2 [@media(max-width:900px)]:gap-[16px] [@media(max-width:560px)]:grid-cols-1">
              {STEPS.map(({ n, title, lines }, idx) => (
                /* each card is a container: all its inner sizes are N * var(--cu) = card width / 413.5 */
                <li
                  key={n}
                  style={{ animationDelay: `${idx * 160}ms` }}
                  className={`group @container relative aspect-[413.5/358.78] min-w-0 rounded-[10px] bg-white/[0.047] shadow-[inset_0_-6px_10px_-6px_rgba(255,255,255,0.10)] transition-[translate,scale,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[calc(14*var(--u))] hover:scale-[1.025] hover:bg-white/[0.075] hover:shadow-[inset_0_-6px_10px_-6px_rgba(255,255,255,0.16),0_28px_50px_-18px_rgba(231,17,23,0.35)] motion-reduce:transition-none ${
                    stepsIn
                      ? "animate-[cardIn_1.1s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none"
                      : "opacity-0"
                  }`}
                >
                  {/* outline: a little brighter along the top */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[10px] border border-white/[0.31] border-t-white/[0.44]"
                  />

                  <div className="absolute inset-0 [--cu:calc(100cqw_/_413.5)]">
                    {/* badge */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 413.5 358.78"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 h-full w-full origin-[81%_21.5%] transition-[scale,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-6 motion-reduce:transition-none"
                    >
                      <path
                        d={BADGE}
                        fill="#E71117"
                        transform="translate(335.08 77.44) rotate(13.48) scale(2.989) translate(-19.01 -19.258)"
                      />
                    </svg>

                    <span className="absolute top-[calc(47*var(--cu))] left-[calc(315*var(--cu))] flex transition-[scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 motion-reduce:transition-none h-[calc(50*var(--cu))] w-[calc(49*var(--cu))] items-center justify-center text-[length:calc(49.66*var(--cu))] leading-none font-medium tracking-[-0.01em] text-white">
                      {n}
                    </span>

                    <h3 style={{ animationDelay: `${idx * 160 + 450}ms` }} className={`${stepsIn ? "animate-[textUp_0.9s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none" : "opacity-0"} absolute top-[calc(228.3*var(--cu))] left-[calc(19*var(--cu))] m-0 flex h-[calc(36*var(--cu))] items-center text-[length:calc(48*var(--cu))] leading-[calc(36*var(--cu))] font-medium tracking-[-0.0833em] whitespace-nowrap text-white`}>
                      {title}
                    </h3>

                    <p style={{ animationDelay: `${idx * 160 + 650}ms` }} className={`${stepsIn ? "animate-[textUp_0.9s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none" : "opacity-0"} absolute top-[calc(281*var(--cu))] left-[calc(19*var(--cu))] m-0 text-[length:calc(18*var(--cu))] leading-[1.7] tracking-[-0.0444em] whitespace-nowrap text-white/[0.37]`}>
                      {lines.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
}