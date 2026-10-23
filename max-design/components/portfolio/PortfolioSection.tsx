"use client";

import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import {
  type PortfolioItem,
  CARD_H,
  DEFAULT_HEADING,
  LABEL_TOP,
  portfolioCategories,
} from "@/data/portfolio";
import CategoryTabs from "./CategoryTabs";
import PortfolioCard from "./PortfolioCard";
import VideoModal from "./VideoModal";

/** Video layout: ek jaisay cards ek row-group me (3 / 4 / 1 column), har group ka apna gap (Figma) */
const VIDEO_GROUP: Record<string, { cols: string; gap: string }> = {
  vtall: { cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", gap: "1.25vw" },
  vsmall: { cols: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", gap: "0.9344vw" },
  vwide: { cols: "grid-cols-1", gap: "0" },
};

function groupByVariant(items: PortfolioItem[]) {
  const groups: { variant: string; items: { item: PortfolioItem; index: number }[] }[] = [];
  items.forEach((item, index) => {
    const variant = item.variant ?? "vtall";
    const last = groups[groups.length - 1];
    if (last && last.variant === variant) last.items.push({ item, index });
    else groups.push({ variant, items: [{ item, index }] });
  });
  return groups;
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const STORE_KEY = "portfolio-category";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function PortfolioSection() {
  // URL /portfolio hi rehta hai, sirf state change hoti hai
  const [activeId, setActiveId] = useState(portfolioCategories[0].id);
  // Pop-up me chal rahi video (null = band)
  const [playing, setPlaying] = useState<PortfolioItem | null>(null);
  const closeVideo = useCallback(() => setPlaying(null), []);
  const router = useRouter();

  // Card par click: agar card ka `href` hai to us page par jao, warna video pop-up kholo
  const openItem = useCallback(
    (item: PortfolioItem) => {
      if (item.href) router.push(item.href);
      else setPlaying(item);
    },
    [router],
  );

  // Page se wapas aane par wahi tab (jaise AI Ad Creatives) khula rahe, Branding par wapas na jaye
  useIsoLayoutEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORE_KEY);
      if (saved && portfolioCategories.some((c) => c.id === saved)) setActiveId(saved);
    } catch {}
  }, []);
  const changeCategory = useCallback((id: string) => {
    setActiveId(id);
    try {
      sessionStorage.setItem(STORE_KEY, id);
    } catch {}
  }, []);
  const active =
    portfolioCategories.find((c) => c.id === activeId) ?? portfolioCategories[0];

  return (
    <section className={`${poppins.className} px-[5vw] pt-[clamp(48px,9.375vw,180px)] pb-[clamp(64px,8vw,160px)]`}>
      <h1
        style={{ "--hw": `${((active.headingW ?? 850) / 1920) * 100}vw` } as React.CSSProperties}
        className="max-w-[var(--hw)] text-[clamp(44px,4.1667vw,80px)] leading-[0.96] font-medium tracking-[-0.08em] text-white max-[820px]:max-w-full">
        {active.heading ?? DEFAULT_HEADING}
      </h1>

      <div className="mt-[clamp(20px,2.1875vw,42px)] border-t border-[#424242] pt-[clamp(20px,2.1354vw,41px)]">
        <CategoryTabs
          categories={portfolioCategories}
          activeId={active.id}
          onChange={changeCategory}
        />
      </div>

      <div
        key={active.id}
        role="tabpanel"
        className="mt-[clamp(32px,9.375vw,180px)]"
      >
        {active.items.length > 0 && active.layout === "video" ? (
          <div
            className="flex flex-col gap-[16px] lg:w-[90vw] lg:ml-[var(--off)] lg:gap-[var(--rg)]"
            style={
              {
                "--rg": `${((active.rowGap ?? 24) / 1920) * 100}vw`,
                "--off": `${((active.gridOffset ?? 0) / 1920) * 100}vw`,
              } as React.CSSProperties
            }
          >
            {groupByVariant(active.items).map((g, gi) => (
              <div
                key={gi}
                className={`grid gap-[16px] lg:gap-x-[var(--cg)] lg:gap-y-[var(--rg)] ${VIDEO_GROUP[g.variant]?.cols ?? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}
                style={{ "--cg": VIDEO_GROUP[g.variant]?.gap ?? "1.25vw" } as React.CSSProperties}
              >
                {g.items.map(({ item, index }) => (
                  <PortfolioCard key={item.id} item={item} index={index} onOpen={openItem} />
                ))}
              </div>
            ))}
          </div>
        ) : active.items.length > 0 ? (
          <div
            className={
              active.layout === "bento"
                ? "grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-6 lg:gap-[1.25vw]"
                : "grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-3 lg:gap-[1.25vw]"
            }
          >
            {active.items.map((item, i) => (
              <PortfolioCard
                key={item.id}
                index={i}
                onOpen={openItem}
                item={item}
                cardH={active.cardH ?? CARD_H}
                labelTop={active.labelTop ?? LABEL_TOP}
              />
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-[clamp(16px,1.25vw,24px)] text-white/45">
            {active.label} projects coming soon.
          </p>
        )}
      </div>

      <VideoModal item={playing} onClose={closeVideo} />
    </section>
  );
}