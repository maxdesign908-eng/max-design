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
  /**
   * Agar ye diya ho to page SIRF lambi image dikhata hai (navbar aur footer ke bagair), baghair cards ke.
   * Lambi image ko tukdon (slices) me kata jata hai, kyunki ek WebP 16383px se lambi nahi ho sakti.
   * desktop = bari image, mobile = chhoti (phone ke liye). w/h aur mw/mh = pixel size.
   */
  longImage?: {
    alt: string;
    slices: { desktop: string; mobile: string; w: number; h: number; mw: number; mh: number }[];
  };
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
  {
    slug: "roche-melgar",
    title: "Roche Melgar",
    items: [],
    longImage: {
      alt: "Roche Melgar brand identity case study",
      slices: [
        { desktop: "/portfolio/roche-melgar/01.webp", mobile: "/portfolio/roche-melgar/01-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/02.webp", mobile: "/portfolio/roche-melgar/02-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/03.webp", mobile: "/portfolio/roche-melgar/03-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/04.webp", mobile: "/portfolio/roche-melgar/04-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/05.webp", mobile: "/portfolio/roche-melgar/05-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/06.webp", mobile: "/portfolio/roche-melgar/06-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/07.webp", mobile: "/portfolio/roche-melgar/07-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/08.webp", mobile: "/portfolio/roche-melgar/08-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/09.webp", mobile: "/portfolio/roche-melgar/09-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/10.webp", mobile: "/portfolio/roche-melgar/10-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/11.webp", mobile: "/portfolio/roche-melgar/11-m.webp", w: 3510, h: 2736, mw: 1170, mh: 912 },
        { desktop: "/portfolio/roche-melgar/12.webp", mobile: "/portfolio/roche-melgar/12-m.webp", w: 3510, h: 2672, mw: 1170, mh: 891 },
      ],
    },
  },
    {
    slug: "health-chain",
    title: "Health Chain",
    items: [],
    longImage: {
      alt: "Health Chain UI/UX case study",
      slices: [
        { desktop: "/portfolio/health-chain/01.webp", mobile: "/portfolio/health-chain/01-m.webp", w: 2433, h: 2000, mw: 1170, mh: 962 },
        { desktop: "/portfolio/health-chain/02.webp", mobile: "/portfolio/health-chain/02-m.webp", w: 2433, h: 2000, mw: 1170, mh: 962 },
        { desktop: "/portfolio/health-chain/03.webp", mobile: "/portfolio/health-chain/03-m.webp", w: 2433, h: 2000, mw: 1170, mh: 962 },
        { desktop: "/portfolio/health-chain/04.webp", mobile: "/portfolio/health-chain/04-m.webp", w: 2433, h: 2000, mw: 1170, mh: 961 },
      ],
    },
  },
    {
    slug: "chain-legal",
    title: "Chain Legal",
    items: [],
    longImage: {
      alt: "Chain Legal UI/UX case study",
           slices: [
        { desktop: "/portfolio/chain-legal/01.webp", mobile: "/portfolio/chain-legal/01-m.webp", w: 3840, h: 4126, mw: 1170, mh: 1257 },
        { desktop: "/portfolio/chain-legal/02.webp", mobile: "/portfolio/chain-legal/02-m.webp", w: 3840, h: 5106, mw: 1170, mh: 1556 },
        { desktop: "/portfolio/chain-legal/03.webp", mobile: "/portfolio/chain-legal/03-m.webp", w: 3840, h: 3376, mw: 1170, mh: 1028 },
        { desktop: "/portfolio/chain-legal/04.webp", mobile: "/portfolio/chain-legal/04-m.webp", w: 3840, h: 4636, mw: 1170, mh: 1413 },
      ],
    },
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);