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

    {
    slug: "itmis",
    title: "ITMIS",
    items: [],
    longImage: {
      alt: "ITMIS UI/UX case study",
      slices: [
        { desktop: "/portfolio/itmis/01.webp", mobile: "/portfolio/itmis/01-m.webp", w: 2576, h: 1531, mw: 1170, mh: 695 },
        { desktop: "/portfolio/itmis/02.webp", mobile: "/portfolio/itmis/02-m.webp", w: 2576, h: 1932, mw: 1170, mh: 878 },
        { desktop: "/portfolio/itmis/03.webp", mobile: "/portfolio/itmis/03-m.webp", w: 1400, h: 1024, mw: 1170, mh: 856 },
      ],
    },
  },

    {
    slug: "pixelette-technologies",
    title: "Pixelette Technologies",
    items: [],
    longImage: {
      alt: "Pixelette Technologies UI/UX case study",
      slices: [
        { desktop: "/portfolio/pixelette-technologies/01.webp", mobile: "/portfolio/pixelette-technologies/01-m.webp", w: 3840, h: 5578, mw: 1170, mh: 1700 },
        { desktop: "/portfolio/pixelette-technologies/02.webp", mobile: "/portfolio/pixelette-technologies/02-m.webp", w: 3840, h: 3828, mw: 1170, mh: 1166 },
        { desktop: "/portfolio/pixelette-technologies/03.webp", mobile: "/portfolio/pixelette-technologies/03-m.webp", w: 3840, h: 6062, mw: 1170, mh: 1847 },
        { desktop: "/portfolio/pixelette-technologies/04.webp", mobile: "/portfolio/pixelette-technologies/04-m.webp", w: 3840, h: 3082, mw: 1170, mh: 939 },
        { desktop: "/portfolio/pixelette-technologies/05.webp", mobile: "/portfolio/pixelette-technologies/05-m.webp", w: 3840, h: 5002, mw: 1170, mh: 1524 },
      ],
    },
  },
    {
    slug: "smart-contractor",
    title: "Smart Contractor",
    items: [],
    longImage: {
      alt: "Smart Contractor website UI/UX case study",
      slices: [
        { desktop: "/portfolio/smart-contractor/01.webp", mobile: "/portfolio/smart-contractor/01-m.webp", w: 3840, h: 2843, mw: 1170, mh: 866 },
        { desktop: "/portfolio/smart-contractor/02.webp", mobile: "/portfolio/smart-contractor/02-m.webp", w: 3840, h: 2318, mw: 1170, mh: 706 },
        { desktop: "/portfolio/smart-contractor/03.webp", mobile: "/portfolio/smart-contractor/03-m.webp", w: 3840, h: 1526, mw: 1170, mh: 465 },
        { desktop: "/portfolio/smart-contractor/04.webp", mobile: "/portfolio/smart-contractor/04-m.webp", w: 3840, h: 1583, mw: 1170, mh: 482 },
        { desktop: "/portfolio/smart-contractor/05.webp", mobile: "/portfolio/smart-contractor/05-m.webp", w: 3840, h: 1792, mw: 1170, mh: 546 },
        { desktop: "/portfolio/smart-contractor/06.webp", mobile: "/portfolio/smart-contractor/06-m.webp", w: 3840, h: 2785, mw: 1170, mh: 849 },
        { desktop: "/portfolio/smart-contractor/07.webp", mobile: "/portfolio/smart-contractor/07-m.webp", w: 3840, h: 1811, mw: 1170, mh: 552 },
        { desktop: "/portfolio/smart-contractor/08.webp", mobile: "/portfolio/smart-contractor/08-m.webp", w: 3840, h: 2380, mw: 1170, mh: 725 },
      ],
    },
    
  },
    {
    slug: "credit-smart-ai",
    title: "Credit Smart AI",
    items: [],
    longImage: {
      alt: "Credit Smart AI UI/UX case study",
      slices: [
        { desktop: "/portfolio/credit-smart-ai/01.webp", mobile: "/portfolio/credit-smart-ai/01-m.webp", w: 3840, h: 4452, mw: 1170, mh: 1356 },
        { desktop: "/portfolio/credit-smart-ai/02.webp", mobile: "/portfolio/credit-smart-ai/02-m.webp", w: 3840, h: 3608, mw: 1170, mh: 1100 },
        { desktop: "/portfolio/credit-smart-ai/03.webp", mobile: "/portfolio/credit-smart-ai/03-m.webp", w: 3840, h: 5298, mw: 1170, mh: 1614 },
      ],
    },
  },
  {
    slug: "law-ledger",
    title: "Law Ledger",
    items: [],
    longImage: {
      alt: "Law Ledger website UI/UX case study",
      slices: [
        { desktop: "/portfolio/law-ledger/01.webp", mobile: "/portfolio/law-ledger/01-m.webp", w: 3840, h: 3006, mw: 1170, mh: 916 },
        { desktop: "/portfolio/law-ledger/02.webp", mobile: "/portfolio/law-ledger/02-m.webp", w: 3840, h: 1875, mw: 1170, mh: 571 },
        { desktop: "/portfolio/law-ledger/03.webp", mobile: "/portfolio/law-ledger/03-m.webp", w: 3840, h: 1723, mw: 1170, mh: 525 },
        { desktop: "/portfolio/law-ledger/04.webp", mobile: "/portfolio/law-ledger/04-m.webp", w: 3840, h: 1682, mw: 1170, mh: 512 },
        { desktop: "/portfolio/law-ledger/05.webp", mobile: "/portfolio/law-ledger/05-m.webp", w: 3840, h: 2236, mw: 1170, mh: 681 },
        { desktop: "/portfolio/law-ledger/06.webp", mobile: "/portfolio/law-ledger/06-m.webp", w: 3840, h: 1917, mw: 1170, mh: 584 },
        { desktop: "/portfolio/law-ledger/07.webp", mobile: "/portfolio/law-ledger/07-m.webp", w: 3840, h: 1168, mw: 1170, mh: 356 },
        { desktop: "/portfolio/law-ledger/08.webp", mobile: "/portfolio/law-ledger/08-m.webp", w: 3840, h: 2035, mw: 1170, mh: 620 },
      ],
    },
  },
  {
    slug: "legalmind-ai",
    title: "LegalMind AI",
    items: [],
    longImage: {
      alt: "LegalMind AI website UI/UX case study",
      slices: [
        { desktop: "/portfolio/legalmind-ai/01.webp", mobile: "/portfolio/legalmind-ai/01-m.webp", w: 3840, h: 2485, mw: 1170, mh: 757 },
        { desktop: "/portfolio/legalmind-ai/02.webp", mobile: "/portfolio/legalmind-ai/02-m.webp", w: 3840, h: 1865, mw: 1170, mh: 568 },
        { desktop: "/portfolio/legalmind-ai/03.webp", mobile: "/portfolio/legalmind-ai/03-m.webp", w: 3840, h: 1630, mw: 1170, mh: 497 },
        { desktop: "/portfolio/legalmind-ai/04.webp", mobile: "/portfolio/legalmind-ai/04-m.webp", w: 3840, h: 1300, mw: 1170, mh: 396 },
        { desktop: "/portfolio/legalmind-ai/05.webp", mobile: "/portfolio/legalmind-ai/05-m.webp", w: 3840, h: 1295, mw: 1170, mh: 395 },
        { desktop: "/portfolio/legalmind-ai/06.webp", mobile: "/portfolio/legalmind-ai/06-m.webp", w: 3840, h: 3165, mw: 1170, mh: 964 },
        { desktop: "/portfolio/legalmind-ai/07.webp", mobile: "/portfolio/legalmind-ai/07-m.webp", w: 3840, h: 1730, mw: 1170, mh: 527 },
        { desktop: "/portfolio/legalmind-ai/08.webp", mobile: "/portfolio/legalmind-ai/08-m.webp", w: 3840, h: 2232, mw: 1170, mh: 680 },
        { desktop: "/portfolio/legalmind-ai/09.webp", mobile: "/portfolio/legalmind-ai/09-m.webp", w: 3840, h: 1058, mw: 1170, mh: 322 },
      ],
    },
  },
  {
    slug: "health-predictor",
    title: "Health Predictor",
    items: [],
    longImage: {
      alt: "Health Predictor website UI/UX case study",
      slices: [
        { desktop: "/portfolio/health-predictor/01.webp", mobile: "/portfolio/health-predictor/01-m.webp", w: 3840, h: 2430, mw: 1170, mh: 740 },
        { desktop: "/portfolio/health-predictor/02.webp", mobile: "/portfolio/health-predictor/02-m.webp", w: 3840, h: 2400, mw: 1170, mh: 731 },
        { desktop: "/portfolio/health-predictor/03.webp", mobile: "/portfolio/health-predictor/03-m.webp", w: 3840, h: 1730, mw: 1170, mh: 527 },
        { desktop: "/portfolio/health-predictor/04.webp", mobile: "/portfolio/health-predictor/04-m.webp", w: 3840, h: 750, mw: 1170, mh: 229 },
        { desktop: "/portfolio/health-predictor/05.webp", mobile: "/portfolio/health-predictor/05-m.webp", w: 3840, h: 1590, mw: 1170, mh: 484 },
        { desktop: "/portfolio/health-predictor/06.webp", mobile: "/portfolio/health-predictor/06-m.webp", w: 3840, h: 2550, mw: 1170, mh: 777 },
        { desktop: "/portfolio/health-predictor/07.webp", mobile: "/portfolio/health-predictor/07-m.webp", w: 3840, h: 1080, mw: 1170, mh: 329 },
        { desktop: "/portfolio/health-predictor/08.webp", mobile: "/portfolio/health-predictor/08-m.webp", w: 3840, h: 1992, mw: 1170, mh: 607 },
        { desktop: "/portfolio/health-predictor/09.webp", mobile: "/portfolio/health-predictor/09-m.webp", w: 3840, h: 1060, mw: 1170, mh: 323 },
      ],
    },
  },
    {
    slug: "transact-secure",
    title: "Transact Secure",
    items: [],
    longImage: {
      alt: "Transact Secure UI/UX case study",
      slices: [
        { desktop: "/portfolio/transact-secure/01.webp", mobile: "/portfolio/transact-secure/01-m.webp", w: 3840, h: 3944, mw: 1170, mh: 1202 },
        { desktop: "/portfolio/transact-secure/02.webp", mobile: "/portfolio/transact-secure/02-m.webp", w: 3840, h: 4408, mw: 1170, mh: 1343 },
        { desktop: "/portfolio/transact-secure/03.webp", mobile: "/portfolio/transact-secure/03-m.webp", w: 3840, h: 2912, mw: 1170, mh: 887 },
        { desktop: "/portfolio/transact-secure/04.webp", mobile: "/portfolio/transact-secure/04-m.webp", w: 3840, h: 4070, mw: 1170, mh: 1240 },
      ],
    },
  },

   {
    slug: "bnu-bestival-edition",
    title: "BNU (Bestival Edition)",
    items: [],
    longImage: {
      alt: "BNU Bestival Edition brand identity case study",
      slices: [
        { desktop: "/portfolio/bnu-bestival-edition/01.webp", mobile: "/portfolio/bnu-bestival-edition/01-m.webp", w: 1920, h: 1085, mw: 1170, mh: 661 },
        { desktop: "/portfolio/bnu-bestival-edition/02.webp", mobile: "/portfolio/bnu-bestival-edition/02-m.webp", w: 2800, h: 1883, mw: 1170, mh: 787 },
        { desktop: "/portfolio/bnu-bestival-edition/03.webp", mobile: "/portfolio/bnu-bestival-edition/03-m.webp", w: 1920, h: 893, mw: 1170, mh: 544 },
        { desktop: "/portfolio/bnu-bestival-edition/04.webp", mobile: "/portfolio/bnu-bestival-edition/04-m.webp", w: 1920, h: 893, mw: 1170, mh: 544 },
        { desktop: "/portfolio/bnu-bestival-edition/05.webp", mobile: "/portfolio/bnu-bestival-edition/05-m.webp", w: 1920, h: 893, mw: 1170, mh: 544 },
        { desktop: "/portfolio/bnu-bestival-edition/06.webp", mobile: "/portfolio/bnu-bestival-edition/06-m.webp", w: 1920, h: 1573, mw: 1170, mh: 959 },
      ],
    },
  },
   {
    slug: "pixelette-brand-guidelines",
    title: "Pixelette Technologies",
    items: [],
    longImage: {
      alt: "Pixelette Technologies brand guidelines and identity case study",
      slices: [
        { desktop: "/portfolio/pixelette-brand-guidelines/01.webp", mobile: "/portfolio/pixelette-brand-guidelines/01-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/02.webp", mobile: "/portfolio/pixelette-brand-guidelines/02-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/03.webp", mobile: "/portfolio/pixelette-brand-guidelines/03-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/04.webp", mobile: "/portfolio/pixelette-brand-guidelines/04-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/05.webp", mobile: "/portfolio/pixelette-brand-guidelines/05-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/06.webp", mobile: "/portfolio/pixelette-brand-guidelines/06-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/07.webp", mobile: "/portfolio/pixelette-brand-guidelines/07-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/08.webp", mobile: "/portfolio/pixelette-brand-guidelines/08-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/09.webp", mobile: "/portfolio/pixelette-brand-guidelines/09-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/10.webp", mobile: "/portfolio/pixelette-brand-guidelines/10-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/11.webp", mobile: "/portfolio/pixelette-brand-guidelines/11-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/12.webp", mobile: "/portfolio/pixelette-brand-guidelines/12-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/13.webp", mobile: "/portfolio/pixelette-brand-guidelines/13-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/pixelette-brand-guidelines/14.webp", mobile: "/portfolio/pixelette-brand-guidelines/14-m.webp", w: 1920, h: 1120, mw: 1170, mh: 682 },
        { desktop: "/portfolio/pixelette-brand-guidelines/15.webp", mobile: "/portfolio/pixelette-brand-guidelines/15-m.webp", w: 1920, h: 1078, mw: 1170, mh: 657 },
      ],
    },
  },
   {
    slug: "software-capital-llc",
    title: "Software Capital LLC",
    items: [],
    longImage: {
      alt: "Software Capital LLC brand identity case study",
      slices: [
        { desktop: "/portfolio/software-capital-llc/01.webp", mobile: "/portfolio/software-capital-llc/01-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/software-capital-llc/02.webp", mobile: "/portfolio/software-capital-llc/02-m.webp", w: 1920, h: 573, mw: 1170, mh: 349 },
        { desktop: "/portfolio/software-capital-llc/03.webp", mobile: "/portfolio/software-capital-llc/03-m.webp", w: 1920, h: 1053, mw: 1170, mh: 642 },
        { desktop: "/portfolio/software-capital-llc/04.webp", mobile: "/portfolio/software-capital-llc/04-m.webp", w: 1920, h: 1053, mw: 1170, mh: 642 },
        { desktop: "/portfolio/software-capital-llc/05.webp", mobile: "/portfolio/software-capital-llc/05-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/software-capital-llc/06.webp", mobile: "/portfolio/software-capital-llc/06-m.webp", w: 1920, h: 573, mw: 1170, mh: 349 },
        { desktop: "/portfolio/software-capital-llc/07.webp", mobile: "/portfolio/software-capital-llc/07-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/software-capital-llc/08.webp", mobile: "/portfolio/software-capital-llc/08-m.webp", w: 1920, h: 573, mw: 1170, mh: 349 },
        { desktop: "/portfolio/software-capital-llc/09.webp", mobile: "/portfolio/software-capital-llc/09-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/software-capital-llc/10.webp", mobile: "/portfolio/software-capital-llc/10-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/software-capital-llc/11.webp", mobile: "/portfolio/software-capital-llc/11-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/software-capital-llc/12.webp", mobile: "/portfolio/software-capital-llc/12-m.webp", w: 1920, h: 573, mw: 1170, mh: 349 },
        { desktop: "/portfolio/software-capital-llc/13.webp", mobile: "/portfolio/software-capital-llc/13-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
        { desktop: "/portfolio/software-capital-llc/14.webp", mobile: "/portfolio/software-capital-llc/14-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
      ],
    },
  },

   {
    slug: "jazbba",
    title: "Jazbba",
    items: [],
    longImage: {
      alt: "Jazbba brand identity case study",
      slices: [
        { desktop: "/portfolio/jazbba/01.webp", mobile: "/portfolio/jazbba/01-m.webp", w: 1920, h: 1074, mw: 1170, mh: 654 },
        { desktop: "/portfolio/jazbba/02.webp", mobile: "/portfolio/jazbba/02-m.webp", w: 1920, h: 1074, mw: 1170, mh: 654 },
        { desktop: "/portfolio/jazbba/03.webp", mobile: "/portfolio/jazbba/03-m.webp", w: 1920, h: 1074, mw: 1170, mh: 654 },
        { desktop: "/portfolio/jazbba/04.webp", mobile: "/portfolio/jazbba/04-m.webp", w: 1920, h: 1074, mw: 1170, mh: 654 },
        { desktop: "/portfolio/jazbba/05.webp", mobile: "/portfolio/jazbba/05-m.webp", w: 1920, h: 1074, mw: 1170, mh: 654 },
        { desktop: "/portfolio/jazbba/06.webp", mobile: "/portfolio/jazbba/06-m.webp", w: 1920, h: 1074, mw: 1170, mh: 654 },
        { desktop: "/portfolio/jazbba/07.webp", mobile: "/portfolio/jazbba/07-m.webp", w: 1920, h: 1920, mw: 1170, mh: 1170 },
      ],
    },
  },
    {
    slug: "galis-home",
    title: "Gali’s Home",
    items: [],
    longImage: {
      alt: "Gali’s Home brand identity case study",
      slices: [
        { desktop: "/portfolio/galis-home/01.webp", mobile: "/portfolio/galis-home/01-m.webp", w: 1920, h: 1079, mw: 1170, mh: 658 },
        { desktop: "/portfolio/galis-home/02.webp", mobile: "/portfolio/galis-home/02-m.webp", w: 1920, h: 612, mw: 1170, mh: 373 },
        { desktop: "/portfolio/galis-home/03.webp", mobile: "/portfolio/galis-home/03-m.webp", w: 1920, h: 924, mw: 1170, mh: 563 },
        { desktop: "/portfolio/galis-home/04.webp", mobile: "/portfolio/galis-home/04-m.webp", w: 1920, h: 1186, mw: 1170, mh: 723 },
        { desktop: "/portfolio/galis-home/05.webp", mobile: "/portfolio/galis-home/05-m.webp", w: 1920, h: 2659, mw: 1170, mh: 1620 },
        { desktop: "/portfolio/galis-home/06.webp", mobile: "/portfolio/galis-home/06-m.webp", w: 1920, h: 917, mw: 1170, mh: 559 },
        { desktop: "/portfolio/galis-home/07.webp", mobile: "/portfolio/galis-home/07-m.webp", w: 1920, h: 875, mw: 1170, mh: 533 },
        { desktop: "/portfolio/galis-home/08.webp", mobile: "/portfolio/galis-home/08-m.webp", w: 1920, h: 1745, mw: 1170, mh: 1063 },
      ],
    },
  },

   {
    slug: "buffloom",
    title: "Buffloom",
    items: [],
    longImage: {
      alt: "Buffloom brand identity case study",
      slices: [
        { desktop: "/portfolio/buffloom/01.webp", mobile: "/portfolio/buffloom/01-m.webp", w: 1920, h: 1164, mw: 1170, mh: 709 },
        { desktop: "/portfolio/buffloom/02.webp", mobile: "/portfolio/buffloom/02-m.webp", w: 1920, h: 559, mw: 1170, mh: 341 },
        { desktop: "/portfolio/buffloom/03.webp", mobile: "/portfolio/buffloom/03-m.webp", w: 1920, h: 1164, mw: 1170, mh: 709 },
        { desktop: "/portfolio/buffloom/04.webp", mobile: "/portfolio/buffloom/04-m.webp", w: 1920, h: 909, mw: 1170, mh: 554 },
        { desktop: "/portfolio/buffloom/05.webp", mobile: "/portfolio/buffloom/05-m.webp", w: 1920, h: 909, mw: 1170, mh: 554 },
        { desktop: "/portfolio/buffloom/06.webp", mobile: "/portfolio/buffloom/06-m.webp", w: 1920, h: 728, mw: 1170, mh: 444 },
        { desktop: "/portfolio/buffloom/07.webp", mobile: "/portfolio/buffloom/07-m.webp", w: 1920, h: 1295, mw: 1170, mh: 789 },
      ],
    },
  },

  {
    slug: "osoujiyasan",
    title: "Osoujiyasan",
    items: [],
    longImage: {
      alt: "Osoujiyasan brand identity case study",
      slices: [
        { desktop: "/portfolio/osoujiyasan/01.webp", mobile: "/portfolio/osoujiyasan/01-m.webp", w: 3840, h: 1331, mw: 1170, mh: 406 },
        { desktop: "/portfolio/osoujiyasan/02.webp", mobile: "/portfolio/osoujiyasan/02-m.webp", w: 3840, h: 1310, mw: 1170, mh: 399 },
        { desktop: "/portfolio/osoujiyasan/03.webp", mobile: "/portfolio/osoujiyasan/03-m.webp", w: 3840, h: 1296, mw: 1170, mh: 395 },
        { desktop: "/portfolio/osoujiyasan/04.webp", mobile: "/portfolio/osoujiyasan/04-m.webp", w: 3840, h: 1265, mw: 1170, mh: 385 },
        { desktop: "/portfolio/osoujiyasan/05.webp", mobile: "/portfolio/osoujiyasan/05-m.webp", w: 3840, h: 2096, mw: 1170, mh: 639 },
      ],
    },
  },

    {
    slug: "scent-of-sands",
    title: "Scent of Sands",
    items: [],
    longImage: {
      alt: "Scent of Sands brand identity case study",
      slices: [
        { desktop: "/portfolio/scent-of-sands/01.webp", mobile: "/portfolio/scent-of-sands/01-m.webp", w: 1920, h: 1169, mw: 1170, mh: 712 },
        { desktop: "/portfolio/scent-of-sands/02.webp", mobile: "/portfolio/scent-of-sands/02-m.webp", w: 1920, h: 1169, mw: 1170, mh: 712 },
        { desktop: "/portfolio/scent-of-sands/03.webp", mobile: "/portfolio/scent-of-sands/03-m.webp", w: 1920, h: 1169, mw: 1170, mh: 712 },
        { desktop: "/portfolio/scent-of-sands/04.webp", mobile: "/portfolio/scent-of-sands/04-m.webp", w: 1920, h: 1169, mw: 1170, mh: 712 },
      ],
    },
  },
{ slug: "hernandez", title: "Hernandez", items: [],
  longImage: { alt: "Hernandez professional tree services brand identity case study", slices: [
    { desktop: "/portfolio/hernandez/01.webp", mobile: "/portfolio/hernandez/01-m.webp", w: 4040, h: 3358, mw: 1170, mh: 972 },
    { desktop: "/portfolio/hernandez/02.webp", mobile: "/portfolio/hernandez/02-m.webp", w: 4040, h: 3186, mw: 1170, mh: 923 },
    { desktop: "/portfolio/hernandez/03.webp", mobile: "/portfolio/hernandez/03-m.webp", w: 4040, h: 3294, mw: 1170, mh: 954 },
    { desktop: "/portfolio/hernandez/04.webp", mobile: "/portfolio/hernandez/04-m.webp", w: 4040, h: 4324, mw: 1170, mh: 1252 } ] } },

     { slug: "gem-and-glam", title: "Gem & Glam", items: [],
  longImage: { alt: "Gem & Glam jewelry and makeup brand identity case study", slices: [
    { desktop: "/portfolio/gem-and-glam/01.webp", mobile: "/portfolio/gem-and-glam/01-m.webp", w: 3840, h: 1443, mw: 1170, mh: 440 },
    { desktop: "/portfolio/gem-and-glam/02.webp", mobile: "/portfolio/gem-and-glam/02-m.webp", w: 3840, h: 1539, mw: 1170, mh: 469 },
    { desktop: "/portfolio/gem-and-glam/03.webp", mobile: "/portfolio/gem-and-glam/03-m.webp", w: 3840, h: 1439, mw: 1170, mh: 438 },
    { desktop: "/portfolio/gem-and-glam/04.webp", mobile: "/portfolio/gem-and-glam/04-m.webp", w: 3840, h: 1445, mw: 1170, mh: 440 },
    { desktop: "/portfolio/gem-and-glam/05.webp", mobile: "/portfolio/gem-and-glam/05-m.webp", w: 3840, h: 2095, mw: 1170, mh: 638 },
    { desktop: "/portfolio/gem-and-glam/06.webp", mobile: "/portfolio/gem-and-glam/06-m.webp", w: 3840, h: 2095, mw: 1170, mh: 638 } ] } },
      {
    slug: "bra-balans",
    title: "Bra Balans",
    items: [],
    longImage: {
      alt: "Bra Balans brand identity case study",
      slices: [
        { desktop: "/portfolio/bra-balans/01.webp", mobile: "/portfolio/bra-balans/01-m.webp", w: 3840, h: 3387, mw: 1170, mh: 1032 },
        { desktop: "/portfolio/bra-balans/02.webp", mobile: "/portfolio/bra-balans/02-m.webp", w: 3840, h: 4953, mw: 1170, mh: 1509 },
        { desktop: "/portfolio/bra-balans/03.webp", mobile: "/portfolio/bra-balans/03-m.webp", w: 3840, h: 5665, mw: 1170, mh: 1726 },
        { desktop: "/portfolio/bra-balans/04.webp", mobile: "/portfolio/bra-balans/04-m.webp", w: 3840, h: 2675, mw: 1170, mh: 815 },
        { desktop: "/portfolio/bra-balans/05.webp", mobile: "/portfolio/bra-balans/05-m.webp", w: 3840, h: 4170, mw: 1170, mh: 1271 },
        { desktop: "/portfolio/bra-balans/06.webp", mobile: "/portfolio/bra-balans/06-m.webp", w: 3840, h: 4170, mw: 1170, mh: 1271 },
        { desktop: "/portfolio/bra-balans/07.webp", mobile: "/portfolio/bra-balans/07-m.webp", w: 3840, h: 3734, mw: 1170, mh: 1137 },
        { desktop: "/portfolio/bra-balans/08.webp", mobile: "/portfolio/bra-balans/08-m.webp", w: 3840, h: 4600, mw: 1170, mh: 1402 },
      ],
    },
  },
  { slug: "hernandez", title: "Hernandez", items: [],
  longImage: { alt: "Hernandez professional tree services brand identity case study", slices: [
    { desktop: "/portfolio/hernandez/01.webp", mobile: "/portfolio/hernandez/01-m.webp", w: 2020, h: 1679, mw: 1170, mh: 972 },
    { desktop: "/portfolio/hernandez/02.webp", mobile: "/portfolio/hernandez/02-m.webp", w: 2020, h: 1593, mw: 1170, mh: 923 },
    { desktop: "/portfolio/hernandez/03.webp", mobile: "/portfolio/hernandez/03-m.webp", w: 2020, h: 1647, mw: 1170, mh: 954 },
    { desktop: "/portfolio/hernandez/04.webp", mobile: "/portfolio/hernandez/04-m.webp", w: 2020, h: 2162, mw: 1170, mh: 1252 } ] } },
  { slug: "gem-and-glam", title: "Gem & Glam", items: [],
  longImage: { alt: "Gem & Glam jewelry and makeup brand identity case study", slices: [
    { desktop: "/portfolio/gem-and-glam/01.webp", mobile: "/portfolio/gem-and-glam/01-m.webp", w: 3840, h: 1443, mw: 1170, mh: 440 },
    { desktop: "/portfolio/gem-and-glam/02.webp", mobile: "/portfolio/gem-and-glam/02-m.webp", w: 3840, h: 1539, mw: 1170, mh: 469 },
    { desktop: "/portfolio/gem-and-glam/03.webp", mobile: "/portfolio/gem-and-glam/03-m.webp", w: 3840, h: 1439, mw: 1170, mh: 438 },
    { desktop: "/portfolio/gem-and-glam/04.webp", mobile: "/portfolio/gem-and-glam/04-m.webp", w: 3840, h: 1445, mw: 1170, mh: 440 },
    { desktop: "/portfolio/gem-and-glam/05.webp", mobile: "/portfolio/gem-and-glam/05-m.webp", w: 3840, h: 2095, mw: 1170, mh: 638 },
    { desktop: "/portfolio/gem-and-glam/06.webp", mobile: "/portfolio/gem-and-glam/06-m.webp", w: 3840, h: 2095, mw: 1170, mh: 638 } ] } },
  { slug: "brabalans", title: "Bra Balans", items: [],
  longImage: { alt: "Bra Balans Foretagshalsa brand identity and website case study", slices: [
    { desktop: "/portfolio/brabalans/01.webp", mobile: "/portfolio/brabalans/01-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/02.webp", mobile: "/portfolio/brabalans/02-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/03.webp", mobile: "/portfolio/brabalans/03-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/04.webp", mobile: "/portfolio/brabalans/04-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/05.webp", mobile: "/portfolio/brabalans/05-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/06.webp", mobile: "/portfolio/brabalans/06-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/07.webp", mobile: "/portfolio/brabalans/07-m.webp", w: 3840, h: 2172, mw: 1170, mh: 662 },
    { desktop: "/portfolio/brabalans/08.webp", mobile: "/portfolio/brabalans/08-m.webp", w: 3840, h: 2468, mw: 1170, mh: 752 },
    { desktop: "/portfolio/brabalans/09.webp", mobile: "/portfolio/brabalans/09-m.webp", w: 3840, h: 2127, mw: 1170, mh: 648 },
    { desktop: "/portfolio/brabalans/10.webp", mobile: "/portfolio/brabalans/10-m.webp", w: 3840, h: 2254, mw: 1170, mh: 687 },
    { desktop: "/portfolio/brabalans/11.webp", mobile: "/portfolio/brabalans/11-m.webp", w: 3840, h: 2133, mw: 1170, mh: 650 },
    { desktop: "/portfolio/brabalans/12.webp", mobile: "/portfolio/brabalans/12-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/13.webp", mobile: "/portfolio/brabalans/13-m.webp", w: 3840, h: 2000, mw: 1170, mh: 609 },
    { desktop: "/portfolio/brabalans/14.webp", mobile: "/portfolio/brabalans/14-m.webp", w: 3840, h: 1534, mw: 1170, mh: 467 },
    { desktop: "/portfolio/brabalans/15.webp", mobile: "/portfolio/brabalans/15-m.webp", w: 3840, h: 2292, mw: 1170, mh: 698 },
    { desktop: "/portfolio/brabalans/16.webp", mobile: "/portfolio/brabalans/16-m.webp", w: 3840, h: 2374, mw: 1170, mh: 723 } ] } },
  { slug: "highland-manor", title: "Highland Manor", items: [],
  longImage: { alt: "Highland Manor Qaziabad brand identity case study", slices: [
    { desktop: "/portfolio/highland-manor/01.webp", mobile: "/portfolio/highland-manor/01-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/02.webp", mobile: "/portfolio/highland-manor/02-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/03.webp", mobile: "/portfolio/highland-manor/03-m.webp", w: 1920, h: 1080, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/04.webp", mobile: "/portfolio/highland-manor/04-m.webp", w: 3837, h: 2158, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/05.webp", mobile: "/portfolio/highland-manor/05-m.webp", w: 3838, h: 2436, mw: 1170, mh: 743 },
    { desktop: "/portfolio/highland-manor/06.webp", mobile: "/portfolio/highland-manor/06-m.webp", w: 3838, h: 1514, mw: 1170, mh: 462 },
    { desktop: "/portfolio/highland-manor/07.webp", mobile: "/portfolio/highland-manor/07-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/08.webp", mobile: "/portfolio/highland-manor/08-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/09.webp", mobile: "/portfolio/highland-manor/09-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/10.webp", mobile: "/portfolio/highland-manor/10-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/11.webp", mobile: "/portfolio/highland-manor/11-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/12.webp", mobile: "/portfolio/highland-manor/12-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/13.webp", mobile: "/portfolio/highland-manor/13-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/14.webp", mobile: "/portfolio/highland-manor/14-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/15.webp", mobile: "/portfolio/highland-manor/15-m.webp", w: 3836, h: 2330, mw: 1170, mh: 711 },
    { desktop: "/portfolio/highland-manor/16.webp", mobile: "/portfolio/highland-manor/16-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/17.webp", mobile: "/portfolio/highland-manor/17-m.webp", w: 3840, h: 2160, mw: 1170, mh: 658 },
    { desktop: "/portfolio/highland-manor/18.webp", mobile: "/portfolio/highland-manor/18-m.webp", w: 3840, h: 1500, mw: 1170, mh: 457 },
    { desktop: "/portfolio/highland-manor/19.webp", mobile: "/portfolio/highland-manor/19-m.webp", w: 3844, h: 2146, mw: 1170, mh: 653 } ] } },
  { slug: "bnu-bestival-social-media", title: "BNU (Bestival Edition) Social Media", items: [],
  longImage: { alt: "BNU Bestival Edition social media design case study", slices: [
    { desktop: "/portfolio/bnu-bestival-social-media/01.webp", mobile: "/portfolio/bnu-bestival-social-media/01-m.webp", w: 3840, h: 2430, mw: 1170, mh: 740 },
    { desktop: "/portfolio/bnu-bestival-social-media/02.webp", mobile: "/portfolio/bnu-bestival-social-media/02-m.webp", w: 3708, h: 2294, mw: 1170, mh: 724 },
    { desktop: "/portfolio/bnu-bestival-social-media/03.webp", mobile: "/portfolio/bnu-bestival-social-media/03-m.webp", w: 1854, h: 1147, mw: 1170, mh: 724 },
    { desktop: "/portfolio/bnu-bestival-social-media/04.webp", mobile: "/portfolio/bnu-bestival-social-media/04-m.webp", w: 3840, h: 2430, mw: 1170, mh: 740 },
    { desktop: "/portfolio/bnu-bestival-social-media/05.webp", mobile: "/portfolio/bnu-bestival-social-media/05-m.webp", w: 3840, h: 2430, mw: 1170, mh: 740 },
    { desktop: "/portfolio/bnu-bestival-social-media/06.webp", mobile: "/portfolio/bnu-bestival-social-media/06-m.webp", w: 3840, h: 3604, mw: 1170, mh: 1098 } ] } },
  { slug: "brainforce-digital", title: "Brainforce Digital", items: [],
  longImage: { alt: "Brainforce Digital social media design case study", slices: [
    { desktop: "/portfolio/brainforce-digital/01.webp", mobile: "/portfolio/brainforce-digital/01-m.webp", w: 5913, h: 4447, mw: 1170, mh: 880 },
    { desktop: "/portfolio/brainforce-digital/02.webp", mobile: "/portfolio/brainforce-digital/02-m.webp", w: 2957, h: 3709, mw: 1170, mh: 1468 },
    { desktop: "/portfolio/brainforce-digital/03.webp", mobile: "/portfolio/brainforce-digital/03-m.webp", w: 2957, h: 2223, mw: 1170, mh: 880 } ] } },
  { slug: "leafrooms", title: "Leafrooms", items: [],
  longImage: { alt: "Leafrooms social media design case study", slices: [
    { desktop: "/portfolio/leafrooms/01.webp", mobile: "/portfolio/leafrooms/01-m.webp", w: 2956, h: 2217, mw: 1170, mh: 878 },
    { desktop: "/portfolio/leafrooms/02.webp", mobile: "/portfolio/leafrooms/02-m.webp", w: 2956, h: 2217, mw: 1170, mh: 878 },
    { desktop: "/portfolio/leafrooms/03.webp", mobile: "/portfolio/leafrooms/03-m.webp", w: 2956, h: 2217, mw: 1170, mh: 878 },
    { desktop: "/portfolio/leafrooms/04.webp", mobile: "/portfolio/leafrooms/04-m.webp", w: 2955, h: 1915, mw: 1170, mh: 758 } ] } },
  { slug: "swiftmount-solutions", title: "Swiftmount Solutions", items: [],
  longImage: { alt: "Swiftmount Solutions social media design case study", slices: [
    { desktop: "/portfolio/swiftmount-solutions/01.webp", mobile: "/portfolio/swiftmount-solutions/01-m.webp", w: 2956, h: 2010, mw: 1170, mh: 796 },
    { desktop: "/portfolio/swiftmount-solutions/02.webp", mobile: "/portfolio/swiftmount-solutions/02-m.webp", w: 2957, h: 2225, mw: 1170, mh: 880 },
    { desktop: "/portfolio/swiftmount-solutions/03.webp", mobile: "/portfolio/swiftmount-solutions/03-m.webp", w: 2957, h: 2221, mw: 1170, mh: 879 } ] } },
  { slug: "highland-manor-social-media", title: "Highland Manor Social Media", items: [],
  longImage: { alt: "Highland Manor Qaziabad social media design case study", slices: [
    { desktop: "/portfolio/highland-manor-social-media/01.webp", mobile: "/portfolio/highland-manor-social-media/01-m.webp", w: 2912, h: 3628, mw: 1170, mh: 2404 } ] } },
  { slug: "pixelette-technologies-social-media", title: "Pixelette Technologies Social Media", items: [],
  longImage: { alt: "Pixelette Technologies social media design case study", slices: [
    { desktop: "/portfolio/pixelette-technologies-social-media/01.webp", mobile: "/portfolio/pixelette-technologies-social-media/01-m.webp", w: 2949, h: 1639, mw: 990, mh: 3240 } ] } },
  { slug: "pixelette-marketing-social-media", title: "Pixelette Marketing Social Media", items: [],
  longImage: { alt: "Pixelette Marketing social media design case study", slices: [
    { desktop: "/portfolio/pixelette-marketing-social-media/01.webp", mobile: "/portfolio/pixelette-marketing-social-media/01-m.webp", w: 2979, h: 1644, mw: 990, mh: 2142 } ] } },
  { slug: "pixelette-holdings-social-media", title: "Pixelette Holdings Social Media", items: [],
  longImage: { alt: "Pixelette Holdings social media design case study", slices: [
    { desktop: "/portfolio/pixelette-holdings-social-media/01.webp", mobile: "/portfolio/pixelette-holdings-social-media/01-m.webp", w: 3011, h: 1644, mw: 990, mh: 2672 } ] } },
  { slug: "pix-certified", title: "Pix Certified", items: [],
  longImage: { alt: "Pix Certified social media design case study", slices: [
    { desktop: "/portfolio/pix-certified/01.webp", mobile: "/portfolio/pix-certified/01-m.webp", w: 2979, h: 1642, mw: 990, mh: 2138 } ] } },
  { slug: "fusio-blockguard", title: "Fusio Blockguard", items: [],
  longImage: { alt: "Fusio Blockguard social media design case study", slices: [
    { desktop: "/portfolio/fusio-blockguard/01.webp", mobile: "/portfolio/fusio-blockguard/01-m.webp", w: 2979, h: 1636, mw: 990, mh: 2700 } ] } },
  { slug: "akashic-knowing", title: "Akashic Knowing", items: [],
  longImage: { alt: "Akashic Knowing social media design case study", slices: [
    { desktop: "/portfolio/akashic-knowing/01.webp", mobile: "/portfolio/akashic-knowing/01-m.webp", w: 3009, h: 2432, mw: 990, mh: 2655 } ] } },
];


export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);