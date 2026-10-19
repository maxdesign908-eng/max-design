"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import { portfolioCategories } from "@/data/portfolio";
import CategoryTabs from "./CategoryTabs";
import PortfolioCard from "./PortfolioCard";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function PortfolioSection() {
  // URL /portfolio hi rehta hai, sirf state change hoti hai
  const [activeId, setActiveId] = useState(portfolioCategories[0].id);
  const active =
    portfolioCategories.find((c) => c.id === activeId) ?? portfolioCategories[0];

  return (
    <section className={`${poppins.className} px-[5vw] pt-[clamp(48px,9.375vw,180px)] pb-[clamp(64px,8vw,160px)]`}>
      <h1 className="max-w-[44.3vw] text-[clamp(44px,4.1667vw,80px)] leading-[0.96] font-medium tracking-[-0.08em] text-white max-[820px]:max-w-full">
        Built to Be Remembered.
      </h1>

      <div className="mt-[clamp(20px,2.1875vw,42px)] border-t border-[#424242] pt-[clamp(20px,2.1354vw,41px)]">
        <CategoryTabs
          categories={portfolioCategories}
          activeId={active.id}
          onChange={setActiveId}
        />
      </div>

      <div
        key={active.id}
        role="tabpanel"
        className="mt-[clamp(32px,9.375vw,180px)]"
      >
        {active.items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[1.25vw]">
            {active.items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="py-24 text-center text-[clamp(16px,1.25vw,24px)] text-white/45">
            {active.label} projects coming soon.
          </p>
        )}
      </div>
    </section>
  );
}
