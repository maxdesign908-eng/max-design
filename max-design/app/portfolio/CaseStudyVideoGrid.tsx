"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PortfolioItem } from "@/data/portfolio";
import VideoModal from "@/components/portfolio/VideoModal"; // <-- change if your VideoModal is elsewhere

/**
 * Same background as the long image (Figma frame colour).
 * If you still see a colour difference, just change this one value.
 */
export const VIDEO_BG = "#121212";

/**
 * Figma numbers (frame ~2960 wide, so everything is a % of the width = scales like the long image)
 *  card 917.6 x 1625.84, radius 56.43, border 0.78, left padding 47.73, gap ~56
 */
const CARD_W = 917.6;
const CARD_H = 1625.84;
const FRAME = 2960;
const cq = (px: number) => `${(px / FRAME) * 100}cqw`;

function VideoCard({
  item,
  index,
  onOpen,
}: {
  item: PortfolioItem;
  index: number;
  onOpen: (item: PortfolioItem) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const vref = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(false);

  // Reveal + play when on screen, pause when off screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
        const vid = vref.current;
        if (vid && !reduce) {
          if (entry.isIntersecting) vid.play().catch(() => {});
          else vid.pause();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const bw = `max(0.6px, ${cq(0.78)})`; // Figma border 0.78px
  const radius = cq(56.43); // Figma radius 56.43px

  return (
    <article
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`Play ${item.title} video`}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(item);
        }
      }}
      style={{
        aspectRatio: `${CARD_W} / ${CARD_H}`,
        borderRadius: radius,
        padding: bw,
        // Figma gradient border: #FFFFFF 0% -> #313131 36.06% -> #FFFFFF 100%
        background: "linear-gradient(180deg, #FFFFFF 0%, #313131 36.06%, #FFFFFF 100%)",
        transitionDelay: shown ? `${(index % 3) * 90}ms` : "0ms",
      }}
      className={`group relative w-full cursor-pointer transition-[opacity,translate] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline focus-visible:outline-white ${
        shown ? "translate-y-0 opacity-100" : "translate-y-[36px] opacity-0"
      }`}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-neutral-900"
        style={{ borderRadius: `calc(${radius} - ${bw})` }}
      >
        {/* No poster: plain video, muted + loop */}
        <video
          ref={vref}
          src={item.video}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={item.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </article>
  );
}

export default function CaseStudyVideoGrid({ items }: { items: PortfolioItem[] }) {
  const [playing, setPlaying] = useState<PortfolioItem | null>(null);
  const close = useCallback(() => setPlaying(null), []);

  return (
    <>
      {/* Full width, same background as the long image. container-type makes cqw = width of this box */}
      <div style={{ background: VIDEO_BG, containerType: "inline-size" }}>
        {/* Always 3 columns (also on mobile), same side padding + gap as the long image */}
        <div
          className="grid grid-cols-3"
          style={{
            columnGap: cq(56),
            rowGap: cq(56),
            paddingLeft: cq(47.73),
            paddingRight: cq(47.73),
            paddingTop: cq(8), // long image already has bottom padding, so only the small remaining gap
            paddingBottom: cq(47.73),
          }}
        >
          {items.map((item, i) => (
            <VideoCard key={item.id} item={item} index={i} onOpen={setPlaying} />
          ))}
        </div>
      </div>
      <VideoModal item={playing} onClose={close} />
    </>
  );
}