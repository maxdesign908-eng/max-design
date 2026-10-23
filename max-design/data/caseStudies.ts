import type { PortfolioItem } from "./portfolio";

/**
 * Har project ka apna page: /portfolio/<slug>
 *
 * Naya page banana ho to:
 *  1) neeche ek naya object add karo (slug, title, items)
 *  2) files public/portfolio/<slug>/ me rakho
 *  3) portfolio.ts me us card par  href: "/portfolio/<slug>"  likh do
 *     (jis card par click karne se ye page khulna chahiye)
 */
export type CaseStudy = {
  /** URL ka hissa: /portfolio/<slug> */
  slug: string;
  title: string;
  /** heading ke saath chhota laal tag (optional) */
  badge?: string;
  /** Figma: cards ka left offset (px, 1920 frame par). Jams Wheels me -11 (cards 85 se shuru, heading 96 se) */
  gridOffset?: number;
  /** cards: variant "csmall" = 560x709.86 (Jams Wheels page ka card). modalVideo = click par pop-up me chalne wali video */
  items: PortfolioItem[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "jams-wheel",
    title: "Jams Wheels On Deals",
    badge: "Creative Ads, Powered by AI",
    gridOffset: -11,
    items: [
      {
        id: "dodge-challenger",
        title: "Dodge Challenger",
        image: "/portfolio/jams-wheel/dodge-challenger.webp",
        modalVideo: "/portfolio/jams-wheel/dodge-challenger.webm",
        variant: "csmall",
      },
      {
        id: "changan-uni-k-limited",
        title: "Changan Uni-K Limited",
        image: "/portfolio/jams-wheel/changan-uni-k-limited.webp",
        modalVideo: "/portfolio/jams-wheel/changan-uni-k-limited.webm",
        variant: "csmall",
      },
      {
        id: "chevrolet-camaro",
        title: "Chevrolet Camaro",
        image: "/portfolio/jams-wheel/chevrolet-camaro.webp",
        modalVideo: "/portfolio/jams-wheel/chevrolet-camaro.webm",
        variant: "csmall",
      },
      {
        id: "mercedes-benz",
        title: "Mercedes Benz",
        image: "/portfolio/jams-wheel/mercedes-benz.webp",
        modalVideo: "/portfolio/jams-wheel/mercedes-benz.webm",
        variant: "csmall",
      },
      {
        id: "kia-sorento",
        title: "Kia Sorento",
        image: "/portfolio/jams-wheel/kia-sorento.webp",
        modalVideo: "/portfolio/jams-wheel/kia-sorento.webm",
        variant: "csmall",
      },
      {
        id: "lexus",
        title: "Lexus",
        image: "/portfolio/jams-wheel/lexus.webp",
        modalVideo: "/portfolio/jams-wheel/lexus.webm",
        variant: "csmall",
      },
    ],
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);