/**
 * Portfolio data.
 *
 * Nayi image add karni ho to: webp file ko /public/portfolio/<category-folder>/ me rakho
 * aur neeche us category ke `items` me ek object add kar do.
 *
 * Har category ke apne Figma naap ho sakte hain (heading, label ki jagah, card ki height).
 */

/** Figma card: 560 x 721 (Branding). Label: height 36, top 660. Bar (line se neeche): 94 */
export const CARD_W = 560;
export const CARD_H = 721;
export const LABEL_H = 36;
export const LABEL_TOP = 660;
export const BAR_H = 94;

export const DEFAULT_HEADING = "Built to Be Remembered.";

export type FigmaCrop = { width: number; height: number; left: number; top: number };

/** AI Ad Creatives ke bento layout ke card size: small 560x709.86, half 852x1080, wide 1728x1080 */
export type CardVariant = "small" | "half" | "wide" | "vtall" | "vsmall" | "vwide" | "csmall";

export type PortfolioItem = {
  id: string;
  title: string;
  image: string;
  /** Agar image ke andar naam pehle se likha ho to true (label dobara nahi likha jata) */
  labelInImage?: boolean;
  /** Optional: Figma ki image width/height/left/top (card 560 x 721 ke hisab se) */
  crop?: FigmaCrop;
  /** Sirf bento layout me: card ka size (grid me kitni jagah ghere) */
  variant?: CardVariant;
  /** Sirf video cards: video (.webm) aur poster (.webp, video load hone se pehle) */
  video?: string;
  poster?: string;
  /** Click par pop-up me chalne wali video (AI Ads: image card hai, video pop-up me). Video cards me `video` hi use hoti hai */
  modalVideo?: string;
  /** Click par is page par jao (pop-up ke bajaye). Jaise "/portfolio/jams-wheel" */
  href?: string;
  /** Pop-up me video ke UPAR se kitna hissa chhupana hai (0 se 1, jaise 0.0165 = 1.65%). Kaali patti wali videos ke liye */
  modalCropTop?: number;
};

export type PortfolioCategory = {
  id: string;
  label: string;
  /** Page ki badi heading (na do to DEFAULT_HEADING) */
  heading?: string;
  /** Figma: heading ki max width (default 850). Lambi heading ke liye badhao */
  headingW?: number;
  /** "bento" = 6 column grid jisme small/half/wide cards mix hote hain */
  layout?: "bento" | "video";
  /** Figma: grid ka left offset (px, 1920 frame par). Video Editing me -11 */
  gridOffset?: number;
  /** Video layout: rows ke beech ka gap (px, 1920 frame par). Figma me 24. 0 karo to cards chipak jate hain */
  rowGap?: number;
  /** Figma: card ki height (default 721) */
  cardH?: number;
  /** Figma: label ka top (default 660) */
  labelTop?: number;
  items: PortfolioItem[];
};

export const portfolioCategories: PortfolioCategory[] = [
  {
    id: "branding",
    label: "Branding",
    heading: "Built to Be Remembered.",
    items: [
      {
        id: "roche-melgar",
        title: "Roche Melgar",
        image: "/portfolio/branding/roche-melgar.webp",
        href: "/portfolio/roche-melgar",
      },
      {
        id: "jamswheel-on-deals",
        title: "Jamswheel on Deals",
        image: "/portfolio/branding/jamswheel-on-deals.webp",
      },
      {
        id: "oh-belly",
        title: "Oh Belly",
        image: "/portfolio/branding/oh-belly.webp",
        href: "/portfolio/oh-belly",
      },
      {
        id: "brainforce-digital",
        title: "Brainforce Digital",
        image: "/portfolio/branding/brainforce-digital.webp",
      },
      {
        id: "leafrooms",
        title: "Leafrooms",
        image: "/portfolio/branding/leafrooms.webp",
        
      },
      {
        id: "bnu-bestival-edition",
        title: "BNU (Bestival Edition)",
        image: "/portfolio/branding/bnu-bestival-edition.webp",
        href: "/portfolio/bnu-bestival-edition",
      },
      {
        id: "pixelette-technologies",
        title: "Pixelette Technologies",
        image: "/portfolio/branding/pixelette-technologies.webp",
        href: "/portfolio/pixelette-brand-guidelines",
      },
      {
        id: "software-capital-llc",
        title: "Software Capital LLC",
        image: "/portfolio/branding/software-capital-llc.webp",
         href: "/portfolio/software-capital-llc",
      },
      {
        id: "carmentis",
        title: "Carmentis",
        image: "/portfolio/branding/carmentis.webp",
      },
      {
        id: "jazzba",
        title: "Jazzba",
        image: "/portfolio/branding/jazzba.webp",
        href: "/portfolio/jazbba",
      },
      {
        id: "highland-manor",
        title: "Highland Manor",
        image: "/portfolio/branding/highland-manor.webp",
         href: "/portfolio/highland-manor",
      },
      {
        id: "galis-home",
        title: "Gali’s Home",
        image: "/portfolio/branding/galis-home.webp",
         href: "/portfolio/galis-home",
      },
      {
        id: "osoujiyasan",
        title: "Osoujiyasan",
        image: "/portfolio/branding/osoujiyasan.webp",
        href: "/portfolio/osoujiyasan",
      },
      {
        id: "hernandez",
        title: "Hernandez",
        image: "/portfolio/branding/hernandez.webp",
        href: "/portfolio/hernandez",
      },
      {
        id: "gem-and-glam",
        title: "Gem & Glam",
        image: "/portfolio/branding/gem-and-glam.webp",
        href: "/portfolio/gem-and-glam",
      },
      {
        id: "brabalans",
        title: "Brabalans",
        image: "/portfolio/branding/brabalans.webp",
        href: "/portfolio/bra-balans",
      },
      {
        id: "buffloom",
        title: "Buffloom",
        image: "/portfolio/branding/buffloom.webp",
         href: "/portfolio/buffloom",
      },
      {
        id: "scent-of-sands",
        title: "Scent of Sands",
        image: "/portfolio/branding/scent-of-sands.webp",
         href: "/portfolio/scent-of-sands",
      },
    ],
  },
  {
    id: "social-media",
    label: "Social Media",
    heading: "Content That Connects.",
    cardH: 721.2,
    labelTop: 657,
    items: [
      {
        id: "bnu-bestival-edition",
        title: "BNU (Bestival Edition)",
        image: "/portfolio/social-media/bnu-bestival-edition.webp",
        href: "/portfolio/bnu-bestival-social-media",
      },
      {
        id: "jamswheel-on-deals",
        title: "Jamswheel on Deals",
        image: "/portfolio/social-media/jamswheel-on-deals.webp",
      },
      {
        id: "brainforce-digital",
        title: "Brainforce Digital",
        image: "/portfolio/social-media/brainforce-digital.webp",
        href: "/portfolio/brainforce-digital",
      },
      {
        id: "leafrooms",
        title: "Leafrooms",
        image: "/portfolio/social-media/leafrooms.webp",
        href: "/portfolio/leafrooms",
      },
      {
        id: "swiftmount-solutions",
        title: "Swiftmount Solutions",
        image: "/portfolio/social-media/swiftmount-solutions.webp",
        href: "/portfolio/swiftmount-solutions",
      },
      {
        id: "highland-manor",
        title: "Highland Manor",
        image: "/portfolio/social-media/highland-manor.webp",
        href: "/portfolio/highland-manor-social-media",
      },
      {
        id: "pixelette-technologies",
        title: "Pixelette Technologies",
        image: "/portfolio/social-media/pixelette-technologies.webp",
        href: "/portfolio/pixelette-technologies-social-media",
      },
      {
        id: "pixelette-marketing",
        title: "Pixelette Marketing",
        image: "/portfolio/social-media/pixelette-marketing.webp",
        href: "/portfolio/pixelette-marketing-social-media",
      },
      {
        id: "pixelette-holdings",
        title: "Pixelette Holdings",
        image: "/portfolio/social-media/pixelette-holdings.webp",
        href: "/portfolio/pixelette-holdings-social-media",
      },
      {
        id: "pixelette-marketing-2",
        title: "Pixelette Marketing",
        image: "/portfolio/social-media/pixelette-marketing-2.webp",
        href: "/portfolio/pix-certified",
      },
      {
        id: "carmentis",
        title: "Carmentis",
        image: "/portfolio/social-media/carmentis.webp",
      },
      {
        id: "fusio-block-guard",
        title: "Fusio Block Guard",
        image: "/portfolio/social-media/fusio-blockguard.webp",
        href: "/portfolio/fusio-blockguard",
      },
      {
        id: "akashic-knowing",
        title: "Akashic Knowing",
        image: "/portfolio/social-media/akashic-knowing.webp",
        href: "/portfolio/akashic-knowing",
      },
    ],
  },
  {
    id: "ui-ux",
    label: "UI/UX",
    heading: "Designed Around How People Think.",
    headingW: 1300,
    labelTop: 657,
    items: [
      {
        id: "belsio-crm",
        title: "Belsio CRM",
        image: "/portfolio/ui-ux/belsio-crm.webp",
        href: "/portfolio/belsio-crm",
      },
      {
        id: "pixelette-technologies",
        title: "Pixelette Technologies",
        image: "/portfolio/ui-ux/pixelette-technologies.webp",
        href: "/portfolio/pixelette-technologies",
      },
      {
        id: "smart-contractor",
        title: "Smart Contractor",
        image: "/portfolio/ui-ux/smart-contractor.webp",
        href: "/portfolio/smart-contractor",
      },
      {
        id: "legal-mind-ai",
        title: "Legal Mind AI",
        image: "/portfolio/ui-ux/legal-mind-ai.webp",
        href: "/portfolio/legalmind-ai",
      },
      {
        id: "chain-legal",
        title: "Chain Legal",
        image: "/portfolio/ui-ux/chain-legal.webp",
        href: "/portfolio/chain-legal",
      },
      {
        id: "transact-secure",
        title: "Transact Secure",
        image: "/portfolio/ui-ux/transact-secure.webp",
        href: "/portfolio/transact-secure",
      },
      {
        id: "health-predictor",
        title: "Health Predictor",
        image: "/portfolio/ui-ux/health-predictor.webp",
        href: "/portfolio/health-predictor",
      },
      {
        id: "health-chain",
        title: "Health Chain",
        image: "/portfolio/ui-ux/health-chain.webp",
        href: "/portfolio/health-chain",
      },
      {
        id: "credit-smart-ai",
        title: "Credit Smart AI",
        image: "/portfolio/ui-ux/credit-smart-ai.webp",
        href: "/portfolio/credit-smart-ai",
      },
      {
        id: "law-ledger",
        title: "Law Ledger",
        image: "/portfolio/ui-ux/law-ledger.webp",
        href: "/portfolio/law-ledger",
      },

      {
        id: "itmis",
        title: "ITMIS",
        image: "/portfolio/ui-ux/itmis.webp",
        href: "/portfolio/itmis",
      },
    ],
  },
  {
    id: "ai-ad-creatives",
    label: "AI Ad Creatives",
    heading: "Creative Ads, Powered by AI",
    headingW: 1100,
    layout: "bento",
    items: [
      {
        id: "roche-melgar",
        title: "Roche Melgar",
        image: "/portfolio/ai-ad-creatives/roche-melgar.webp",
        modalVideo: "/portfolio/ai-ad-creatives/roche-melgar.webm",
        variant: "small",
      },
      {
        id: "rolex",
        title: "Rolex",
        image: "/portfolio/ai-ad-creatives/rolex.webp",
        modalVideo: "/portfolio/ai-ad-creatives/rolex.webm",
        variant: "small",
      },
      {
        id: "jazzba",
        title: "Jazzba",
        image: "/portfolio/ai-ad-creatives/jazzba.webp",
        modalVideo: "/portfolio/ai-ad-creatives/jazzba.webm",
        variant: "small",
      },
      {
        id: "pixelette-technologies",
        title: "Pixelette Technologies",
        image: "/portfolio/ai-ad-creatives/pixelette-technologies.webp",
        modalVideo: "/portfolio/ai-ad-creatives/pixelette-technologies.webm",
        variant: "wide",
      },
      {
        id: "rosor-exploration",
        title: "Rosor Eploration",
        image: "/portfolio/ai-ad-creatives/rosor-exploration.webp",
        modalVideo: "/portfolio/ai-ad-creatives/rosor-exploration.webm",
        variant: "half",
      },
      {
        id: "oh-belly",
        title: "Oh Belly",
        image: "/portfolio/ai-ad-creatives/oh-belly.webp",
        modalVideo: "/portfolio/ai-ad-creatives/oh-belly.webm",
        variant: "half",
      },
      {
        id: "jams-wheels-on-deals",
        title: "Jams Wheeels on Deals",
        image: "/portfolio/ai-ad-creatives/jams-wheels-on-deals.webp",
        href: "/portfolio/jams-wheel",
        variant: "wide",
      },
    ],
  },
  {
    id: "video",
    label: "Video Editing",
    heading: "Visual Stories That Keep People Watching",
    headingW: 1560,
    layout: "video",
    gridOffset: -11,
    rowGap: 24,
    items: [
      // ---- PEHLI 2 ROWS (3 + 3, variant "vtall") ----
      {
        id: "jamswheels-social-reel",
        title: "Jamswheels on Deals",
        image: "/portfolio/video-editing/jamswheels-social-reel.webp",
        video: "/portfolio/video-editing/jamswheels-social-reel.webm",
        poster: "/portfolio/video-editing/jamswheels-social-reel.webp",
        variant: "vtall",
      },
      {
        id: "jamswheels-dealers",
        title: "Jamswheels on Deals",
        image: "/portfolio/video-editing/jamswheels-dealers.webp",
        video: "/portfolio/video-editing/jamswheels-dealers.webm",
        poster: "/portfolio/video-editing/jamswheels-dealers.webp",
        variant: "vtall",
      },
      {
        id: "jamswheels-buyer",
        title: "Jamswheels on Deals",
        image: "/portfolio/video-editing/jamswheels-buyer.webp",
        video: "/portfolio/video-editing/jamswheels-buyer.webm",
        poster: "/portfolio/video-editing/jamswheels-buyer.webp",
        variant: "vtall",
      },
      {
        id: "leafrooms-overwhelmed",
        title: "Leafrooms",
        image: "/portfolio/video-editing/leafrooms-overwhelmed.webp",
        video: "/portfolio/video-editing/leafrooms-overwhelmed.webm",
        poster: "/portfolio/video-editing/leafrooms-overwhelmed.webp",
        modalCropTop: 0.0165, // is video ke shuru me upar 20px ki kaali patti hai
        variant: "vtall",
      },
      {
        id: "leafrooms-muree",
        title: "Leafrooms",
        image: "/portfolio/video-editing/leafrooms-muree.webp",
        video: "/portfolio/video-editing/leafrooms-muree.webm",
        poster: "/portfolio/video-editing/leafrooms-muree.webp",
        variant: "vtall",
      },
      {
        id: "leafrooms-escape",
        title: "Leafrooms",
        image: "/portfolio/video-editing/leafrooms-escape.webp",
        video: "/portfolio/video-editing/leafrooms-escape.webm",
        poster: "/portfolio/video-editing/leafrooms-escape.webp",
        variant: "vtall",
      },
      // ---- 4 CARDS KI ROW (variant "vsmall") ----
      {
        id: "leafrooms-avenair",
        title: "Leafrooms",
        image: "/portfolio/video-editing/leafrooms-avenair.webp",
        video: "/portfolio/video-editing/leafrooms-avenair.webm",
        poster: "/portfolio/video-editing/leafrooms-avenair.webp",
        variant: "vsmall",
      },
      {
        id: "leafrooms-clients",
        title: "Leafrooms",
        image: "/portfolio/video-editing/leafrooms-clients.webp",
        video: "/portfolio/video-editing/leafrooms-clients.webm",
        poster: "/portfolio/video-editing/leafrooms-clients.webp",
        variant: "vsmall",
      },
      {
        id: "leafrooms-window",
        title: "Leafrooms",
        image: "/portfolio/video-editing/leafrooms-window.webp",
        video: "/portfolio/video-editing/leafrooms-window.webm",
        poster: "/portfolio/video-editing/leafrooms-window.webp",
        variant: "vsmall",
      },
      {
        id: "highland-manor",
        title: "Highland Manor",
        image: "/portfolio/video-editing/highland-manor.webp",
        video: "/portfolio/video-editing/highland-manor.webm",
        poster: "/portfolio/video-editing/highland-manor.webp",
        variant: "vsmall",
      },
      {
        id: "synavos-field",
        title: "Synavos",
        image: "/portfolio/video-editing/synavos-field.webp",
        video: "/portfolio/video-editing/synavos-field.webm",
        poster: "/portfolio/video-editing/synavos-field.webp",
        variant: "vwide",
      },
      {
        id: "synavos-tcl",
        title: "Synavos",
        image: "/portfolio/video-editing/synavos-tcl.webp",
        video: "/portfolio/video-editing/synavos-tcl.webm",
        poster: "/portfolio/video-editing/synavos-tcl.webp",
        variant: "vwide",
      },
    ],
  },
  { id: "website", label: "Web Development", items: [] },
];