"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

function Counter({
  end,
  suffix = "",
  duration = 2000,
}: {
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(end);
      return;
    }

    let animationFrame = 0;

    const run = () => {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;

        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);

        setCount(Math.floor(easedProgress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return (
    <span ref={ref} className="relative inline-block">
      <span className="opacity-0">{`${end}${suffix}`}</span>
      <span aria-hidden="true" className="absolute top-0 left-0">
        {`${count}${suffix}`}
      </span>
    </span>
  );
}

/*
  Sizes use Tailwind's spacing scale, which is set in globals.css so that
  1 unit = 1 Figma px (1920 frame). Example: `left-111` = 111px in Figma.
  Font sizes use calc(N * var(--spacing)) for the same reason.
  `max-[820px]:` classes are the stacked mobile layout.
*/
export default function About() {
  return (
    <section
      className="relative h-1108 w-full overflow-hidden bg-black text-white max-[820px]:flex max-[820px]:h-auto max-[820px]:flex-col max-[820px]:gap-28 max-[820px]:px-20 max-[820px]:pt-32 max-[820px]:pb-48"
    >
      <h1 className="absolute top-140 left-111 w-982 text-[calc(80*var(--spacing))] leading-[1.12] font-medium tracking-[-0.04em] max-[820px]:static max-[820px]:w-auto max-[820px]:pr-70 max-[820px]:text-[calc(40*var(--spacing))]">
        Design solutions for startups and growing brands.
      </h1>

      <video
        className="pointer-events-none absolute top-60 left-1540 h-300 w-300 object-cover max-[820px]:top-10 max-[820px]:-right-30 max-[820px]:left-auto max-[820px]:h-150 max-[820px]:w-150"
        src="/videos/logo.mp4"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      <div className="absolute top-480 left-111 h-464 w-560 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:h-260 max-[820px]:w-full">
        <Image
          src="/images/head.jpg"
          alt="Silhouette of a head lit by red light"
          fill
          sizes="(max-width: 820px) 100vw, 30vw"
          priority
          className="object-cover object-[center_20%]"
        />
      </div>

      <div className="absolute top-478 left-839 flex h-247 w-972 flex-col items-start gap-48 max-[820px]:static max-[820px]:h-auto max-[820px]:w-auto max-[820px]:gap-24">
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
  <i
    className="
      h-7
      w-7
      shrink-0
      rounded-full
      bg-[#ff1e2d]
      max-[820px]:h-6
      max-[820px]:w-6
    "
  />

  {/* Text */}
  <span className="ml-[calc(9.17*var(--spacing))] whitespace-nowrap">
    More About Us
  </span>

  {/* Arrow */}
  <span
    className="
      ml-auto
      grid
      h-[calc(38*var(--spacing))]
      w-[calc(38*var(--spacing))]
      min-h-[calc(38*var(--spacing))]
      min-w-[calc(38*var(--spacing))]
      shrink-0
      place-items-center
      rounded-full
      bg-[#ff1e2d]
    "
  >
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

      <div className="absolute top-806 left-839 flex gap-48 max-[820px]:static max-[820px]:gap-22">
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