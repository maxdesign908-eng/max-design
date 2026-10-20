"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CARD_H, CARD_W, LABEL_H, LABEL_TOP, BAR_H, type PortfolioItem } from "@/data/portfolio";

type Props = {
  item: PortfolioItem;
  /** Figma: card height (Branding 721, Social 721.2) */
  cardH?: number;
  /** Figma: label ka `top` (Branding 660, Social 657) */
  labelTop?: number;
  /** Grid me position (stagger animation ke liye) */
  index?: number;
};

export default function PortfolioCard({ item, cardH = CARD_H, labelTop = LABEL_TOP, index = 0 }: Props) {
  const { crop } = item;

  // Smooth reveal: card jab screen me aata hai (ya category badalne par naya mount hota hai)
  // to neeche se halka sa upar uthta hua fade-in hota hai.
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const pct = (px: number) => `${(px / cardH) * 100}%`;

  return (
    <article
      ref={ref}
      style={{
        aspectRatio: `${CARD_W} / ${cardH}`,
        transitionDelay: shown ? `${(index % 3) * 90}ms` : "0ms",
      }}
      className={`group @container relative w-full overflow-hidden rounded-[14px] border-[0.53px] border-white/50 bg-neutral-900 transition-[opacity,translate] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        shown ? "translate-y-0 opacity-100" : "translate-y-[36px] opacity-0"
      }`}
    >
      {crop ? (
        // Figma ki exact width/height/left/top (card ke % me convert hoti hai)
        <Image
          src={item.image}
          alt={item.title}
          width={Math.round(crop.width)}
          height={Math.round(crop.height)}
          unoptimized
          className="absolute max-w-none transition-transform duration-500 group-hover:scale-105"
          style={{
            width: `${(crop.width / CARD_W) * 100}%`,
            height: `${(crop.height / CARD_H) * 100}%`,
            left: `${(crop.left / CARD_W) * 100}%`,
            top: `${(crop.top / CARD_H) * 100}%`,
          }}
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

      {/* Jin images me naam image ke andar likha hai: neeche ki bar wali patti ko image ki
          static copy se dhak dete hain, taake hover par sirf image zoom ho, naam nahi. */}
      {item.labelInImage && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" style={{ height: pct(BAR_H) }}>
          <Image
            src={item.image}
            alt=""
            aria-hidden
            width={1400}
            height={1802}
            unoptimized
            className="absolute bottom-0 left-0 w-full max-w-none object-cover"
            style={{ height: `${(cardH / BAR_H) * 100}%` }}
          />
        </div>
      )}

      {/* Label bar ki patli line (sab cards par same) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t border-white/60" style={{ height: pct(BAR_H) }} />

      {/* Label: Figma = left 20, top 660, height 36 (card 560 x 721), Poppins Bold 32px at 560px card width; font-size card ki width ke saath scale hoti hai (5.7143cqw = 32/560), isliye image me likhe naam ke barabar rehta hai.
          Jin images me naam pehle se likha hai (labelInImage) wahan dobara nahi likhte. */}
      {!item.labelInImage && (
        <h3 style={{ top: pct(labelTop), height: pct(LABEL_H) }} className="absolute left-[3.5714%] text-[length:5.7143cqw] leading-[1.12] font-bold tracking-[-0.04em] whitespace-nowrap text-white uppercase">
          {item.title}
        </h3>
      )}
    </article>
  );
}