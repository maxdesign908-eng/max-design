import Image from "next/image";
import { CARD_H, CARD_W, type PortfolioItem } from "@/data/portfolio";

export default function PortfolioCard({ item }: { item: PortfolioItem }) {
  const { crop } = item;

  return (
    <article className="group relative aspect-[560/721] w-full overflow-hidden rounded-[14px] border-[0.53px] border-white/50 bg-neutral-900">
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
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}

      {/* Label bar ki patli line (sab cards par same) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[13.04%] border-t border-white/60" />

      {/* Label: Figma = left 20, top 660, height 36 (card 560 x 721), Poppins Bold 32px.
          Jin images me naam pehle se likha hai (labelInImage) wahan dobara nahi likhte. */}
      {!item.labelInImage && (
        <h3 className="absolute top-[91.54%] left-[3.5714%] h-[4.99%] text-[clamp(16px,1.6667vw,32px)] leading-[1.125] font-bold tracking-[-0.04em] whitespace-nowrap text-white uppercase">
          {item.title}
        </h3>
      )}
    </article>
  );
}