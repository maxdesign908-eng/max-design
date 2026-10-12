"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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

/*
  Sizes use Tailwind's spacing scale, which is set in globals.css so that
  1 unit = 1 Figma px (1920 frame). Example: `left-111` = 111px in Figma.
  Font sizes use calc(N * var(--spacing)) for the same reason.
  `max-[820px]:` classes are the stacked mobile layout.

  Stacking: the background layer is z-0, all content is z-10. Content that is
  `static` on mobile is `relative` instead, so z-index still applies to it.
*/
export default function About() {
  return (
    <section className="relative isolate h-1108 w-full  overflow-hidden bg-black text-white max-[820px]:flex max-[820px]:h-auto max-[820px]:flex-col max-[820px]:gap-28 max-[820px]:px-20 max-[820px]:pt-32 max-[820px]:pb-48">
      {/* ───── Background: rotated red glass panels ───── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/*
          Fitted against your reference screenshot (correlation 0.99):
          - Figma's -35.22° is CLOCKWISE, so the CSS is rotate(+35.22deg).
          - opacity 0.18 and size 4000.18 x 2250.10 are the Figma values.
          - Figma's blur 17.9 is ~10px as a CSS filter blur.
          - top/left place the layer where the reference has it, relative to
            this section. They use var(--spacing) so they scale with the
            1920 frame like the rest of the layout.
        */}
        <div
          className="
            absolute
            top-[calc(-705*var(--spacing))]
            left-[calc(-1552*var(--spacing))]
            h-[calc(2250.1025734209065*var(--spacing))]
            w-[calc(4000.182434128488*var(--spacing))]
            rotate-[35.22deg]
            opacity-[0.18]
            blur-[4px]

            max-[820px]:top-1/2
            max-[820px]:left-1/2
            max-[820px]:-translate-x-1/2
            max-[820px]:-translate-y-1/2
            max-[820px]:h-[1620px]
            max-[820px]:w-[2880px]
            max-[820px]:opacity-[0.3]
          "
        >
          <Image
            src="/images/bg-glass.webp"
            alt=""
            fill
            sizes="(max-width: 820px) 2667px, 4000px"
            quality={75}
            className="object-cover"
          />
        </div>
      </div>

      {/* ───── Content ───── */}
      <h1 className="absolute top-140 left-111 z-10 w-982 text-[calc(80*var(--spacing))] leading-[1.12] font-medium tracking-[-0.04em] max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:w-auto max-[820px]:pr-[calc(110*var(--spacing))] max-[820px]:text-[calc(40*var(--spacing))]">
        Design solutions for startups and growing brands.
      </h1>

      {/* Logo: object-contain + kept fully inside the section so it never gets cut.
          mix-blend-screen makes the video's black background transparent. */}
      <video
        className="pointer-events-none absolute mix-blend-screen top-60 left-1540 z-10 h-300 w-300 object-contain max-[820px]:top-24 max-[820px]:right-16 max-[820px]:left-auto max-[820px]:h-90 max-[820px]:w-90"
        src="/videos/logo.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className="absolute top-480 left-111 z-10 h-464 w-560 overflow-hidden max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:h-260 max-[820px]:w-full">
        <Image
          src="/images/head.jpg"
          alt="Silhouette of a head lit by red light"
          fill
          sizes="(max-width: 820px) 100vw, 30vw"
          priority
          className="object-cover object-[center_20%]"
        />
      </div>

      <div className="absolute top-478 left-839 z-10 flex h-247 w-972 flex-col items-start gap-48 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:h-auto max-[820px]:w-auto max-[820px]:gap-24">
        <p className="text-[calc(32*var(--spacing))] leading-[calc(48*var(--spacing))] font-normal tracking-[-0.04em] max-[820px]:text-[calc(16*var(--spacing))] max-[820px]:leading-[1.85] max-[820px]:tracking-normal">
          At Max Design, we turn ideas into powerful visual experiences. With
          strategy, creativity, and innovation, we create brands that connect,
          stand out, and leave a lasting impression.
        </p>

        {/* More About Us */}
        <a
          href="#about"
          className="
            box-border
            inline-flex
            h-56
            w-240
            shrink-0
            items-center
            rounded-full
            border-[0.57px]
            border-white/35
            px-[calc(14.9*var(--spacing))]
            text-[calc(17*var(--spacing))]
            text-white
            transition-colors
            hover:border-[#ff1e2d]
            focus-visible:outline-2
            focus-visible:outline-offset-3
            focus-visible:outline-[#ff1e2d]

            max-[820px]:h-48
            max-[820px]:w-200
            max-[820px]:text-[calc(14*var(--spacing))]
          "
        >
          {/* Left red dot */}
          <i className="h-7 w-7 shrink-0 rounded-full bg-[#ff1e2d] max-[820px]:h-6 max-[820px]:w-6" />

          {/* Text */}
          <span className="ml-[calc(9.17*var(--spacing))] whitespace-nowrap">
            More About Us
          </span>

          {/* Arrow */}
          <span className="ml-auto grid h-[calc(38*var(--spacing))] min-h-[calc(38*var(--spacing))] w-[calc(38*var(--spacing))] min-w-[calc(38*var(--spacing))] shrink-0 place-items-center rounded-full bg-[#ff1e2d]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.48 0L13.44 0.99L13.33 1.1C10.56 4.01 10.66 7.98 12.49 9.87L11.52 10.86C10.01 9.3 9.47 6.87 10.01 4.46L1.95 12.64L1 11.65L9.06 3.47C6.7 4 4.34 3.43 2.83 1.87L3.8 0.88C5.65 0.88 9.6 2.92 12.48 0Z"
                fill="white"
              />
            </svg>
          </span>
        </a>
      </div>

      <div className="absolute top-806 left-839 z-10 flex gap-48 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:gap-22">
        <div>
          <strong className="block text-[calc(72*var(--spacing))] leading-[1.1] font-medium max-[820px]:text-[calc(34*var(--spacing))]">
            <Counter end={30} suffix="+" />
          </strong>
          <span className="mt-8 block text-[calc(18*var(--spacing))] whitespace-nowrap max-[820px]:text-[calc(11*var(--spacing))]">
            Successful Brands
          </span>
        </div>

        <div>
          <strong className="block text-[calc(72*var(--spacing))] leading-[1.1] font-medium max-[820px]:text-[calc(34*var(--spacing))]">
            <Counter end={5} suffix="K+" />
          </strong>
          <span className="mt-8 block text-[calc(18*var(--spacing))] whitespace-nowrap max-[820px]:text-[calc(11*var(--spacing))]">
            Social Media Campaigns
          </span>
        </div>

        <div>
          <strong className="block text-[calc(72*var(--spacing))] leading-[1.1] font-medium max-[820px]:text-[calc(34*var(--spacing))]">
            <Counter end={100} suffix="+" />
          </strong>
          <span className="mt-8 block text-[calc(18*var(--spacing))] whitespace-nowrap max-[820px]:text-[calc(11*var(--spacing))]">
            Happy Clients
          </span>
        </div>
      </div>
    </section>
  );
}