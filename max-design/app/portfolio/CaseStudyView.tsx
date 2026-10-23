"use client";

import { useCallback, useState } from "react";
import { Poppins } from "next/font/google";
import type { PortfolioItem } from "@/data/portfolio";
import type { CaseStudy } from "@/data/caseStudies";
import PortfolioCard from "../../components/portfolio/PortfolioCard";
import VideoModal from "../../components/portfolio/VideoModal";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/**
 * Ek project ka page (/portfolio/<slug>): heading + chhota laal tag, patli line, cards.
 * Card par click -> video pop-up (background blur).
 * Spacing (1920 par): 98 navbar + 180 upar, heading, line 42 neeche, cards 179 line ke baad. Cards 85 se shuru (gridOffset -11).
 */
export default function CaseStudyView({ study }: { study: CaseStudy }) {
  const [playing, setPlaying] = useState<PortfolioItem | null>(null);
  const closeVideo = useCallback(() => setPlaying(null), []);

  return (
    <section
      className={`${poppins.className} px-[5vw] pt-[clamp(48px,9.375vw,180px)] pb-[clamp(64px,8vw,160px)]`}
    >
      {/* heading: Poppins Medium 80 / 96%, -8%, box 800 wide.
          Tag (Figma): 488 x 56 pill, border 1px #E71117, fill #E71117 at 31%, 7px after the heading box.
          Its text: Poppins Medium 37.99 (= 0.4749em), -8%, box 454 x 36 at left 17 / top 10. */}
      <h1 className="flex flex-wrap items-center gap-x-[0.0875em] gap-y-[0.15em] text-[clamp(44px,4.1667vw,80px)] leading-[0.96] font-medium tracking-[-0.08em] text-white">
        <span className="w-[10em] max-w-full">{study.title}</span>
        {study.badge && (
          <span className="inline-flex items-center rounded-full border border-[#E71117] bg-[#E711174F] px-[0.4212em] py-[0.2369em] text-[0.4749em] leading-[0.96] font-medium tracking-[-0.08em] whitespace-nowrap text-white">
            {study.badge}
          </span>
        )}
      </h1>

      {/* line: 42 under the heading; cards start 179 under the line (Figma: heading 278, cards 577) */}
      <div className="mt-[clamp(20px,2.1875vw,42px)] border-t border-[#424242]" />

      <div
        className="mt-[clamp(32px,9.3229vw,179px)] grid grid-cols-1 gap-[16px] sm:grid-cols-2 lg:ml-[var(--off)] lg:w-[90vw] lg:grid-cols-6 lg:gap-[1.25vw]"
        style={{ "--off": `${((study.gridOffset ?? 0) / 1920) * 100}vw` } as React.CSSProperties}
      >
        {study.items.map((item, i) => (
          <PortfolioCard key={item.id} item={item} index={i} onOpen={setPlaying} />
        ))}
      </div>

      <VideoModal item={playing} onClose={closeVideo} />
    </section>
  );
}