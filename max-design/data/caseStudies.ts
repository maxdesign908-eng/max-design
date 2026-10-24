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
        { desktop: "/portfolio/roche-melgar/01.webp", mobile: "/portfolio/roche-melgar/01-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
        { desktop: "/portfolio/roche-melgar/02.webp", mobile: "/portfolio/roche-melgar/02-m.webp", w: 3840, h: 1458, mw: 1170, mh: 444 },
        { desktop: "/portfolio/roche-melgar/03.webp", mobile: "/portfolio/roche-melgar/03-m.webp", w: 3840, h: 1324, mw: 1170, mh: 403 },
        { desktop: "/portfolio/roche-melgar/04.webp", mobile: "/portfolio/roche-melgar/04-m.webp", w: 3840, h: 1520, mw: 1170, mh: 463 },
        { desktop: "/portfolio/roche-melgar/05.webp", mobile: "/portfolio/roche-melgar/05-m.webp", w: 3840, h: 2150, mw: 1170, mh: 655 },
        { desktop: "/portfolio/roche-melgar/06.webp", mobile: "/portfolio/roche-melgar/06-m.webp", w: 3840, h: 2150, mw: 1170, mh: 655 },
        { desktop: "/portfolio/roche-melgar/07.webp", mobile: "/portfolio/roche-melgar/07-m.webp", w: 3840, h: 2116, mw: 1170, mh: 645 },
        { desktop: "/portfolio/roche-melgar/08.webp", mobile: "/portfolio/roche-melgar/08-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
        { desktop: "/portfolio/roche-melgar/09.webp", mobile: "/portfolio/roche-melgar/09-m.webp", w: 3840, h: 2150, mw: 1170, mh: 655 },
        { desktop: "/portfolio/roche-melgar/10.webp", mobile: "/portfolio/roche-melgar/10-m.webp", w: 3840, h: 1816, mw: 1170, mh: 553 },
        { desktop: "/portfolio/roche-melgar/11.webp", mobile: "/portfolio/roche-melgar/11-m.webp", w: 3840, h: 2452, mw: 1170, mh: 747 },
        { desktop: "/portfolio/roche-melgar/12.webp", mobile: "/portfolio/roche-melgar/12-m.webp", w: 3840, h: 1458, mw: 1170, mh: 444 },
        { desktop: "/portfolio/roche-melgar/13.webp", mobile: "/portfolio/roche-melgar/13-m.webp", w: 3840, h: 3902, mw: 1170, mh: 1189 },
        { desktop: "/portfolio/roche-melgar/14.webp", mobile: "/portfolio/roche-melgar/14-m.webp", w: 3840, h: 2150, mw: 1170, mh: 655 },
        { desktop: "/portfolio/roche-melgar/15.webp", mobile: "/portfolio/roche-melgar/15-m.webp", w: 3840, h: 2134, mw: 1170, mh: 650 },
        { desktop: "/portfolio/roche-melgar/16.webp", mobile: "/portfolio/roche-melgar/16-m.webp", w: 3840, h: 2116, mw: 1170, mh: 645 },
        { desktop: "/portfolio/roche-melgar/17.webp", mobile: "/portfolio/roche-melgar/17-m.webp", w: 3840, h: 2640, mw: 1170, mh: 804 },
      ],
    },
  },
  {
    slug: "oh-belly",
    title: "Oh Belly",
    items: [],
    longImage: {
      alt: "Oh Belly brand identity case study",
      slices: [
        { desktop: "/portfolio/oh-belly/01.webp", mobile: "/portfolio/oh-belly/01-m.webp", w: 3840, h: 2211, mw: 1170, mh: 674 },
        { desktop: "/portfolio/oh-belly/02.webp", mobile: "/portfolio/oh-belly/02-m.webp", w: 3840, h: 2211, mw: 1170, mh: 674 },
        { desktop: "/portfolio/oh-belly/03.webp", mobile: "/portfolio/oh-belly/03-m.webp", w: 2880, h: 1659, mw: 1170, mh: 674 },
        { desktop: "/portfolio/oh-belly/04.webp", mobile: "/portfolio/oh-belly/04-m.webp", w: 2880, h: 1659, mw: 1170, mh: 674 },
       { desktop: "/portfolio/oh-belly/05.gif", mobile: "/portfolio/oh-belly/05.gif", w: 1400, h: 788, mw: 1400, mh: 788 },
        { desktop: "/portfolio/oh-belly/06.webp", mobile: "/portfolio/oh-belly/06-m.webp", w: 2880, h: 709, mw: 1170, mh: 288 },
        { desktop: "/portfolio/oh-belly/07.webp", mobile: "/portfolio/oh-belly/07-m.webp", w: 2880, h: 1659, mw: 1170, mh: 674 },
        { desktop: "/portfolio/oh-belly/08.webp", mobile: "/portfolio/oh-belly/08-m.webp", w: 2880, h: 960, mw: 1170, mh: 390 },
        { desktop: "/portfolio/oh-belly/09.webp", mobile: "/portfolio/oh-belly/09-m.webp", w: 2880, h: 1659, mw: 1170, mh: 674 },
        { desktop: "/portfolio/oh-belly/10.gif", mobile: "/portfolio/oh-belly/10.gif", w: 1400, h: 787, mw: 1400, mh: 787 },
        { desktop: "/portfolio/oh-belly/11.webp", mobile: "/portfolio/oh-belly/11-m.webp", w: 2880, h: 1659, mw: 1170, mh: 674 },
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
        { desktop: "/portfolio/chain-legal/01-v3.webp", mobile: "/portfolio/chain-legal/01-m-v3.webp", w: 3840, h: 4126, mw: 1170, mh: 1257 },
        { desktop: "/portfolio/chain-legal/02-v3.webp", mobile: "/portfolio/chain-legal/02-m-v3.webp", w: 3840, h: 5106, mw: 1170, mh: 1556 },
        { desktop: "/portfolio/chain-legal/03-v3.webp", mobile: "/portfolio/chain-legal/03-m-v3.webp", w: 3840, h: 3376, mw: 1170, mh: 1028 },
        { desktop: "/portfolio/chain-legal/04-v3.webp", mobile: "/portfolio/chain-legal/04-m-v3.webp", w: 3840, h: 4636, mw: 1170, mh: 1413 },
      ],
    },
  },
    {
    slug: "belsio-crm",
    title: "Belsio CRM",
    items: [],
    longImage: {
      alt: "Belsio CRM UI/UX case study",
      slices: [
        { desktop: "/portfolio/belsio-crm/01.webp", mobile: "/portfolio/belsio-crm/01-m.webp", w: 2542, h: 1382, mw: 1170, mh: 636 },
        { desktop: "/portfolio/belsio-crm/02.webp", mobile: "/portfolio/belsio-crm/02-m.webp", w: 2550, h: 1376, mw: 1170, mh: 631 },
        { desktop: "/portfolio/belsio-crm/03.webp", mobile: "/portfolio/belsio-crm/03-m.webp", w: 2556, h: 1368, mw: 1170, mh: 626 },
                { desktop: "/portfolio/belsio-crm/04.webp", mobile: "/portfolio/belsio-crm/04-m.webp", w: 2542, h: 1352, mw: 1170, mh: 622 },
      ],
    },
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);