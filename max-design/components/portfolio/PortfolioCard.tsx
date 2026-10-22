"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CARD_H,
  CARD_W,
  LABEL_H,
  LABEL_TOP,
  BAR_H,
  type CardVariant,
  type FigmaCrop,
  type PortfolioItem,
} from "@/data/portfolio";

/**
 * Har card ka Figma config.
 *  - w / h        : card ka design size (px)
 *  - radius       : vw me (poori layout ke saath scale hota hai), max = Figma px
 *  - border/line  : border ki motai + opacity (Figma 0.53px white ~ white/50)
 *  - font         : cqw me (card ki width ke hisab se), left/top/height/bar = card ke % me
 *  - crop         : (sirf video) Figma ka video size/position card ke andar
 */
type Cfg = {
  w: number;
  h: number;
  radius: string;
  border: string;
  borderCls: string;
  lineCls: string;
  font: string;
  left: string;
  top: number; // fraction of card height
  labelH: number;
  bar: number;
  span?: string;
  widthPct?: number;
  crop?: FigmaCrop;
};

// AI Ad Creatives (bento). small = half ka 0.6573 scale
const AI = { top: 996 / 1080, labelH: 36 / 1080, bar: 136 / 1080 };
// Video Editing. vsmall = vtall ka 0.7474 scale
const VID = { top: 842 / 906, labelH: 24 / 906, bar: 105 / 906 };

const VARIANTS: Record<CardVariant, Cfg> = {
  small: { w: 560, h: 709.86, radius: "min(9.2px, 0.4792vw)", border: "0.35px", borderCls: "border-white/50 lg:border-white/35", lineCls: "border-white/60 lg:border-white/45", font: "3.7559cqw", left: "4.5775%", span: "lg:col-span-2", ...AI },
  half: { w: 852, h: 1080, radius: "min(14px, 0.7292vw)", border: "0.53px", borderCls: "border-white/50", lineCls: "border-white/60", font: "3.7559cqw", left: "4.5775%", span: "lg:col-span-3", ...AI },
  wide: { w: 1728, h: 1080, radius: "min(14px, 0.7292vw)", border: "0.53px", borderCls: "border-white/50", lineCls: "border-white/60", font: "1.8519cqw", left: "2.2569%", span: "sm:col-span-2 lg:col-span-6", ...AI },
  vtall: { w: 560, h: 906, radius: "min(9.2px, 0.4792vw)", border: "0.35px", borderCls: "border-white/50 lg:border-white/35", lineCls: "border-white/60 lg:border-white/45", font: "3.7554cqw", left: "4.9304%", crop: { width: 560, height: 995.56, left: 0, top: -18 }, ...VID },
  vsmall: { w: 418.55, h: 677.15, radius: "min(6.88px, 0.3583vw)", border: "0.26px", borderCls: "border-white/50 lg:border-white/30", lineCls: "border-white/60 lg:border-white/40", font: "3.7557cqw", left: "4.9314%", crop: { width: 429.36, height: 763.31, left: -5.36, top: -43.16 }, ...VID },
  vwide: { w: 1724, h: 906, radius: "min(9.2px, 0.4792vw)", border: "0.35px", borderCls: "border-white/50 lg:border-white/35", lineCls: "border-white/60 lg:border-white/45", font: "1.2198cqw", left: "1.6016%", widthPct: (1724 / 1728) * 100, crop: { width: 1724, height: 970, left: 0, top: 0 }, ...VID },
};

type Props = {
  item: PortfolioItem;
  /** Figma: card height (Branding 721, Social 721.2) */
  cardH?: number;
  /** Figma: label ka `top` (Branding 660, Social 657) */
  labelTop?: number;
  /** Grid me position (stagger animation ke liye) */
  index?: number;
  /** Click par video pop-up kholne ke liye (sirf unhi cards par jin ki video ho) */
  onOpen?: (item: PortfolioItem) => void;
};

export default function PortfolioCard({ item, cardH = CARD_H, labelTop = LABEL_TOP, index = 0, onOpen }: Props) {
  const v = item.variant ? VARIANTS[item.variant] : null;
  const playable = Boolean(onOpen && (item.modalVideo ?? item.video));

  // Default (Branding / Social / UI-UX) config
  const cfg: Cfg = v ?? {
    w: CARD_W,
    h: cardH,
    radius: "14px",
    border: "0.53px",
    borderCls: "border-white/50",
    lineCls: "border-white/60",
    font: "5.7143cqw",
    left: "3.5714%",
    top: labelTop / cardH,
    labelH: LABEL_H / cardH,
    bar: BAR_H / cardH,
  };
  const crop = item.crop ?? cfg.crop;

  // Smooth reveal + (video) sirf screen me ho to play
  const ref = useRef<HTMLElement>(null);
  const vref = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(false);
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

  const pctW = (px: number) => `${(px / cfg.w) * 100}%`;
  const pctH = (px: number) => `${(px / cfg.h) * 100}%`;
  const cropStyle = crop
    ? { width: pctW(crop.width), height: pctH(crop.height), left: pctW(crop.left), top: pctH(crop.top) }
    : undefined;
  const barH = `${cfg.bar * 100}%`;

  return (
    <article
      ref={ref}
      {...(playable
        ? {
            role: "button",
            tabIndex: 0,
            "aria-label": `Play ${item.title} video`,
            onClick: () => onOpen!(item),
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen!(item);
              }
            },
          }
        : {})}
      style={
        {
          aspectRatio: `${cfg.w} / ${cfg.h}`,
          // Desktop (lg+) = Figma bento naap, ye CSS variables `lg:` classes me use hote hain
          "--r": cfg.radius,
          "--bw": cfg.border,
          "--bar": barH,
          "--t": `${cfg.top * 100}%`,
          "--h": `${cfg.labelH * 100}%`,
          "--l": cfg.left,
          "--fs": cfg.font,
          ...(cfg.widthPct ? { width: `${cfg.widthPct}%` } : {}),
          transitionDelay: shown ? `${(index % 3) * 90}ms` : "0ms",
        } as React.CSSProperties
      }
      className={`group @container relative w-full ${playable ? "cursor-pointer focus-visible:outline focus-visible:outline-white" : ""} overflow-hidden rounded-[14px] border-[0.53px] border-solid lg:rounded-[var(--r)] lg:border-[length:var(--bw)] ${cfg.borderCls} ${cfg.span ?? ""} bg-neutral-900 transition-[opacity,translate] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        shown ? "translate-y-0 opacity-100" : "translate-y-[36px] opacity-0"
      }`}
    >
      {item.video ? (
        // Video: Figma ki exact width/height/left/top, muted loop, screen me aane par play
        <video
          ref={vref}
          src={item.video}
          poster={item.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={item.title}
          className="absolute max-w-none object-cover transition-transform duration-500 group-hover:scale-105"
          style={cropStyle ?? { inset: 0, width: "100%", height: "100%" }}
        />
      ) : crop ? (
        // Figma ki exact width/height/left/top (card ke % me convert hoti hai)
        <Image
          src={item.image}
          alt={item.title}
          width={Math.round(crop.width)}
          height={Math.round(crop.height)}
          unoptimized
          className="absolute max-w-none transition-transform duration-500 group-hover:scale-105"
          style={cropStyle}
        />
      ) : (
        <Image
          src={item.image}
          alt={item.title}
          fill
          unoptimized
          className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
            item.labelInImage ? "origin-bottom" : ""
          }`}
        />
      )}

      {/* Jin images me naam image ke andar likha hai: neeche ki patti ki static copy,
          taake hover par sirf image zoom ho, naam nahi. */}
      {item.labelInImage && !item.video && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: barH }}>
          <Image
            src={item.image}
            alt=""
            aria-hidden
            width={1400}
            height={1802}
            unoptimized
            className="absolute bottom-0 left-0 w-full max-w-none object-cover"
            style={{ height: `${(1 / cfg.bar) * 100}%` }}
          />
        </div>
      )}

      {/* Label bar ki patli line: mobile/tablet par Branding jaisi (card ki width ka 16.8%), lg+ par Figma bar */}
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-[16.8cqw] border-t lg:h-[var(--bar)] ${cfg.lineCls}`} />

      {/* Label: Poppins Bold, -4% spacing, line-height 112%, uppercase.
          Mobile/tablet: Branding wali size (5.7143cqw). lg+: Figma ki exact jagah/size. */}
      {!item.labelInImage && (
        <h3 className="absolute bottom-[4.46cqw] left-[3.5714cqw] h-[6.43cqw] text-[length:5.7143cqw] leading-[1.12] font-bold tracking-[-0.04em] whitespace-nowrap text-white uppercase lg:top-[var(--t)] lg:bottom-auto lg:left-[var(--l)] lg:h-[var(--h)] lg:text-[length:var(--fs)]">
          {item.title}
        </h3>
      )}
    </article>
  );
}