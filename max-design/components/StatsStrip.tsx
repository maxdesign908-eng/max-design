"use client";

import { useEffect, useRef, useState } from "react";

/*
  Stats strip (Figma 1920 wide): four numbers between two thin lines.

  Strip ...... 1920 x 273, 1px line on the top and on the bottom, black fill
  Cell ....... 413.5 x 271, first one starts 97 from the left, 1px line on its right side (not on the last cell)
  Number ..... Poppins Medium 80 / 112%, -8%, centred (172.83 x 80 at top 65 of the cell)
  Label ...... Poppins Medium 16 / 24, -4%, centred (178.43 x 21 at top 182 of the cell)

  Space: the black block has the same empty space above and below the strip (130 Figma px, measured from your screenshots)

  Desktop (> 900px): every size is N * var(--u), 1 Figma px (scales with the page, capped at 1920).
  Tablet / phone (<= 900px): 2 x 2 grid with fluid sizes.
*/

const STATS = [
  { end: 23, suffix: "+", label: "Successful Brands" },
  { end: 5, suffix: "K+", label: "Social Media Campaigns" },
  { end: 100, suffix: "+", label: "Happy Clients" },
  { end: 6, suffix: "+", label: "Years Of Industry Experience" },
];

/*
  Counter updates the DOM directly inside requestAnimationFrame instead of
  calling setState on every frame, so there are no React re-renders while
  it counts. That is what makes it smooth. It is also short (1400ms) with an
  ease-out-expo curve, so it starts fast and settles gently.
*/
function Counter({
  end,
  suffix = "",
  duration = 1400,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const value = valueRef.current;
    if (!wrap || !value) return;

    const write = (n: number) => {
      value.textContent = `${n}${suffix}`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      write(end);
      return;
    }

    let frame = 0;

    const run = () => {
      const start = performance.now();

      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t); // easeOutExpo
        write(Math.round(eased * end));
        if (t < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          run();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(wrap);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, suffix, duration]);

  return (
    <span ref={wrapRef} className="relative inline-block tabular-nums">
      {/* Final value reserves the width so the layout never shifts */}
      <span className="invisible">{`${end}${suffix}`}</span>
      <span
        ref={valueRef}
        aria-hidden="true"
        className="absolute top-0 left-0"
      >
        {`0${suffix}`}
      </span>
    </span>
  );
}

export default function StatsStrip() {
  // entrance animation: plays once, when the strip is scrolled into view
  const ref = useRef<HTMLElement>(null);
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
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-label="Max Design in numbers"
      className="@container w-full bg-black py-[calc(130*min(100cqw,1920px)/1920)] text-white max-[900px]:py-[56px]"
    >
      <div className="w-full [--u:calc(min(100cqw,1920px)_/_1920)]">
        <div className="mx-auto h-[calc(273*var(--u))] w-full max-w-[1920px] border-y border-white/[0.14] pl-[calc(97*var(--u))] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:pl-0">
          <ul className="m-0 grid h-full list-none grid-cols-[repeat(4,calc(413.5*var(--u)))] p-0 [@media(max-width:900px)]:grid-cols-2">
            {STATS.map(({ end, suffix, label }, i) => (
              <li
                key={label}
                style={{ transitionDelay: inView ? `${i * 120}ms` : "0ms" }}
                className={`relative h-[calc(271*var(--u))] border-r border-white/[0.14] transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] last:border-r-0 motion-reduce:transition-none [@media(max-width:900px)]:flex [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:flex-col [@media(max-width:900px)]:items-center [@media(max-width:900px)]:justify-center [@media(max-width:900px)]:px-[12px] [@media(max-width:900px)]:py-[36px] [@media(max-width:900px)]:odd:border-r [@media(max-width:900px)]:even:border-r-0 [@media(max-width:900px)]:[&:nth-child(-n+2)]:border-b ${
                  inView ? "translate-y-0 opacity-100" : "translate-y-[calc(30*var(--u))] opacity-0"
                }`}
              >
                <strong className="absolute top-[calc(65*var(--u))] left-0 block h-[calc(80*var(--u))] w-full text-center text-[length:calc(80*var(--u))] leading-[1.12] font-medium tracking-[-0.08em] [@media(max-width:900px)]:static [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:text-[length:clamp(40px,11vw,64px)] [@media(max-width:900px)]:leading-[1.1]">
                  <Counter end={end} suffix={suffix} />
                </strong>
                <span className="absolute top-[calc(182*var(--u))] left-0 block h-[calc(21*var(--u))] w-full text-center text-[length:calc(16*var(--u))] leading-[calc(24*var(--u))] font-medium tracking-[-0.04em] [@media(max-width:900px)]:static [@media(max-width:900px)]:mt-[10px] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:text-[length:clamp(12px,3.2vw,16px)] [@media(max-width:900px)]:leading-[1.4]">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
} 