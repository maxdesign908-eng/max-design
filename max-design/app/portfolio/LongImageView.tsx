/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CaseStudy } from "@/data/caseStudies";

/**
 * Lambi image wala page (jaise Roche Melgar): sirf image, navbar aur footer nahi.
 *
 * - Image tukdon me hai; tukde bina gap ke ek ke neeche ek lagte hain, aur har tukda
 *   pichle ke upar 1px chadha hota hai taake zoom par bhi koi patli line na dikhe.
 * - PC / tablet (768px+): bari WebP (3510px chauri). Phone (767px tak): chhoti WebP (1170px = 3x phone).
 * - Pehle 2 tukde foran load hote hain, baaki scroll karne par (lazy), isliye page tez khulta hai.
 * - Upar left me chhota gol "wapas" button hai (navbar nahi). Hatana ho to neeche <Link> wala hissa delete kar do.
 */
export default function LongImageView({ study }: { study: CaseStudy }) {
  const image = study.longImage;
  if (!image) return null;

  return (
    <section className="relative w-full bg-black">
      <h1 className="sr-only">{study.title}</h1>

      <Link
        href="/portfolio"
        aria-label="Back to portfolio"
        className="fixed top-[16px] left-[16px] z-50 grid h-[44px] w-[44px] place-items-center rounded-full bg-black/40 text-white ring-1 ring-white/25 backdrop-blur-md transition-colors duration-300 hover:bg-white/20 focus-visible:outline focus-visible:outline-white"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px]" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </Link>

      <div className="flex w-full flex-col">
        {image.slices.map((s, i) => (
          <picture key={s.desktop} className={`block w-full ${i > 0 ? "-mt-[1px]" : ""}`}>
            <source media="(max-width: 767px)" srcSet={s.mobile} width={s.mw} height={s.mh} />
            <img
              src={s.desktop}
              width={s.w}
              height={s.h}
              alt={i === 0 ? image.alt : ""}
              loading={i < 2 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              decoding="async"
              className="block h-auto w-full"
            />
          </picture>
        ))}
      </div>
    </section>
  );
}