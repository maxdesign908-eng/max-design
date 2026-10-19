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
              active ? "text-white" : "text-[#838383] hover:text-white"
            }`}
          >
            <span
              aria-hidden
              className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#838383]"
            />
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
