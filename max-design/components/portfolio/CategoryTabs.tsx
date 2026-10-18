"use client";

import type { PortfolioCategory } from "@/data/portfolio";

type Props = {
  categories: PortfolioCategory[];
  activeId: string;
  onChange: (id: string) => void;
};

export default function CategoryTabs({ categories, activeId, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Portfolio categories"
      className="flex flex-wrap items-center gap-x-[18px] gap-y-3"
    >
      {categories.map((cat) => {
        const active = cat.id === activeId;
        return (
          <button
            key={cat.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(cat.id)}
            className={`flex cursor-pointer items-center gap-[18px] text-[clamp(14px,1.0417vw,20px)] leading-[1.12] font-normal tracking-[-0.04em] whitespace-nowrap transition-colors duration-200 ${
              active ? "text-white" : "text-white/45 hover:text-white/80"
            }`}
          >
            <span aria-hidden className="text-[0.7em] text-white/45">
              ●
            </span>
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
