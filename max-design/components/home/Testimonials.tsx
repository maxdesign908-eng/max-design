"use client";

import Image from "next/image";
import { useRef, useState } from "react";

/*
  Same system as About.tsx: Tailwind spacing is set in globals.css so that
  1 unit = 1 Figma px (1920 frame). `top-67` = 67px in Figma, and font sizes
  use calc(N * var(--spacing)). `max-[820px]:` is the stacked mobile layout.

  Figma numbers used here
  - section 1930 x 1133, heading Poppins 500 80/112, -4%, centered, top 92
  - cards row: 1726 wide, top 361, each card 570 tall, radius 14
  - quote: Poppins 26/33.8 (Light 300: Figma renders thinner than browsers, measured ~20% less ink than Regular in Chrome), box 467 x 166 at top 154 / left 49, vertically centred
  - author: Poppins 400 23.4/31.2, left 49, top 421.85
  - video: 272 x 526, radius 16, top 22, left 552 (inside the card)

  Hover on the video: the video box grows to fill the whole card while the
  text fades out. It is driven by `data-active` on the card, so the video and
  the text react together.
*/

type Testimonial = {
  brand: string; // alt text for the logo
  logo: string;
  quote: string;
  name: string;
  role: string;
  location: string;
  poster: string;
  videoSrc?: string; // optional: when set, the full video plays on hover
};

const TESTIMONIALS: Testimonial[] = [
  {
    brand: "Arrive",
    logo: "/images/arrive-logo.webp",
    quote:
      "They brought our app redesign to life beyond expectations! We’re thrilled with the results and truly loved collaborating with their incredibly talented team.",
    name: "Robin Fish",
    role: "Founder & CEO, Arrive",
    location: "New York, USA",
    poster: "/images/robin-fish.webp",
    // videoSrc: "/videos/robin-fish.mp4",
  },
  {
    brand: "Arrive",
    logo: "/images/arrive-logo.webp",
    quote:
      "They brought our app redesign to life beyond expectations! We’re thrilled with the results and truly loved collaborating with their incredibly talented team.",
    name: "Robin Fish",
    role: "Founder & CEO, Arrive",
    location: "New York, USA",
    poster: "/images/robin-fish.webp",
    // videoSrc: "/videos/robin-fish.mp4",
  },
];

const PER_PAGE = 2;

function PlayIcon() {
  return (
    <span className="absolute top-1/2 left-1/2 grid h-94 w-94 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/70 backdrop-blur-[2px] transition-transform duration-500 group-data-[active=true]/card:scale-90 max-[820px]:h-64 max-[820px]:w-64">
      <svg
        viewBox="0 0 24 24"
        className="h-[calc(38*var(--spacing))] w-[calc(38*var(--spacing))] translate-x-[calc(2*var(--spacing))] max-[820px]:h-[calc(26*var(--spacing))] max-[820px]:w-[calc(26*var(--spacing))]"
        fill="#1a1a1a"
        aria-hidden="true"
      >
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z" />
      </svg>
    </span>
  );
}

function Card({ t }: { t: Testimonial }) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    setActive(true);
    videoRef.current?.play().catch(() => {});
  };
  const close = () => {
    setActive(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <article
      data-active={active}
      onMouseLeave={close}
      className="
        group/card relative h-570 w-847 shrink-0 overflow-hidden
        rounded-[calc(14*var(--spacing))]
        border border-white/30 border-t-white/45 bg-[#A5A5A5]/[0.07] backdrop-blur-[10px]
        text-white

        max-[820px]:flex max-[820px]:h-auto max-[820px]:w-full
        max-[820px]:flex-col-reverse max-[820px]:gap-28 max-[820px]:p-16
      "
    >
      {/* ───── Text block (fades out while the video is open) ───── */}
      <div
        className="
          transition-opacity duration-500 ease-out
          group-data-[active=true]/card:pointer-events-none
          group-data-[active=true]/card:opacity-0
          max-[820px]:px-8 max-[820px]:pb-8
        "
      >
        <div className="absolute top-69 left-49 z-10 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0">
          <Image
            src={t.logo}
            alt={t.brand}
            width={120}
            height={43}
            className="block h-[calc(42.67*var(--spacing))] w-120"
          />
        </div>

        <p className="absolute top-154 left-49 z-10 flex h-166 w-467 items-center text-[calc(26*var(--spacing))] leading-[calc(33.8*var(--spacing))] font-light tracking-normal max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:mt-16 max-[820px]:block max-[820px]:h-auto max-[820px]:w-auto max-[820px]:text-[calc(17*var(--spacing))] max-[820px]:leading-[1.6]">
          “{t.quote}”
        </p>

        <div className="absolute top-[calc(421.85*var(--spacing))] left-49 z-10 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:mt-24">
          <p className="text-[calc(23.4*var(--spacing))] leading-[calc(31.2*var(--spacing))] font-light max-[820px]:text-[calc(18*var(--spacing))]">
            {t.name}
          </p>
          <p className="mt-6 font-light text-[calc(16*var(--spacing))] leading-[calc(24*var(--spacing))] max-[820px]:text-[calc(13*var(--spacing))]">
            {t.role}
            <br />
            {t.location}
          </p>
        </div>
      </div>

      {/* ───── Video box ─────
          Rest: 272 x 526 at (552, 22), radius 16.
          Hover: fills the whole card (0, 0, 847 x 570, radius 14). */}
      <div
        onMouseEnter={open}
        onClick={() => (active ? close() : open())}
        className="
          absolute z-20 cursor-pointer overflow-hidden
          top-22 left-552 h-526 w-272 rounded-[calc(16*var(--spacing))]
          transition-[top,left,width,height,border-radius] duration-[650ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]

          min-[821px]:group-data-[active=true]/card:top-0
          min-[821px]:group-data-[active=true]/card:left-0
          min-[821px]:group-data-[active=true]/card:h-570
          min-[821px]:group-data-[active=true]/card:w-847
          min-[821px]:group-data-[active=true]/card:rounded-none

          max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0
          max-[820px]:h-360 max-[820px]:w-full
        "
      >
        <Image
          src={t.poster}
          alt={`${t.name}, ${t.role}`}
          fill
          sizes="(max-width: 820px) 100vw, 850px"
          className="object-cover object-[center_25%]"
        />

        {t.videoSrc && (
          <video
            ref={videoRef}
            src={t.videoSrc}
            poster={t.poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-data-[active=true]/card:opacity-100"
          />
        )}

        <PlayIcon />
      </div>
    </article>
  );
}

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(TESTIMONIALS.length / PER_PAGE);
  const visible = TESTIMONIALS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <section className="relative isolate h-1067 w-full overflow-hidden bg-black text-white max-[820px]:h-auto max-[820px]:px-20 max-[820px]:pt-[18px] max-[820px]:pb-[18px]">
      {/* ───── Background: red glass panels ─────
          Values taken from your Figma properties:
          3817 x 2147, rotated 27.5deg clockwise (Figma shows -27.5), opacity 0.21.
          Figma gives top/left of the rotated bounding box, so these are
          converted to the unrotated box CSS needs. The left value is measured
          from the section's centre so it stays put at any width.
          Blur: Figma's 29.2 is a layer-blur radius; 12px matches your frame best
          (measured against your screenshot). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute rotate-[27.5deg] opacity-[0.21] blur-[12px] max-[820px]:opacity-[0.3]"
          style={{
            width: "calc(3817 * var(--spacing))",
            height: "calc(2147 * var(--spacing))",
            top: "calc(-624.22 * var(--spacing))",
            left: "calc(50% - 1961.99 * var(--spacing))",
          }}
        >
          <Image
            src="/images/bg-glass.webp"
            alt=""
            fill
            sizes="4000px"
            quality={75}
            className="object-cover"
          />
        </div>
      </div>

      {/* ───── Heading ───── */}
      <h2 className="absolute top-60 left-1/2 z-10 w-982 -translate-x-1/2 text-center text-[calc(80*var(--spacing))] leading-[1.12] font-medium tracking-[-0.04em] max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:w-auto max-[820px]:translate-x-0 max-[820px]:text-[calc(38*var(--spacing))]">
        Designed to Impress.
        <br />
        Remembered for More.
      </h2>

      {/* ───── Cards ───── */}
      <div
        key={page}
        className="absolute top-329 left-1/2 z-10 flex w-[calc(1726*var(--spacing))] -translate-x-1/2 gap-32 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:mt-[36px] max-[820px]:w-full max-[820px]:translate-x-0 max-[820px]:flex-col"
      >
        {visible.map((t, i) => (
          <Card key={`${page}-${i}`} t={t} />
        ))}
      </div>

      {/* ───── Pager: one segment per page ───── */}
      <div className="absolute top-1003 left-1/2 z-10 flex -translate-x-1/2 items-center gap-6 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:mt-[36px] max-[820px]:translate-x-0 max-[820px]:justify-center">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonials ${i + 1}`}
            aria-current={i === page}
            onClick={() => setPage(i)}
            className={`h-4 cursor-pointer rounded-full transition-all duration-500 ${
              i === page ? "w-75 bg-[#e10613]" : "w-20 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}