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

export type PortfolioItem = {
  id: string;
  title: string;
  image: string;
  /** Agar image ke andar naam pehle se likha ho to true (label dobara nahi likha jata) */
  labelInImage?: boolean;
  /** Optional: Figma ki image width/height/left/top (card 560 x 721 ke hisab se) */
  crop?: FigmaCrop;
};

export type PortfolioCategory = {
  id: string;
  label: string;
  /** Page ki badi heading (na do to DEFAULT_HEADING) */
  heading?: string;
  /** Figma: heading ki max width (default 850). Lambi heading ke liye badhao */
  headingW?: number;
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
        labelInImage: true,
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
      },
      {
        id: "pixelette-technologies",
        title: "Pixelette Technologies",
        image: "/portfolio/branding/pixelette-technologies.webp",
      },
      {
        id: "software-capital-llc",
        title: "Software Capital LLC",
        image: "/portfolio/branding/software-capital-llc.webp",
        labelInImage: true,
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
      },
      {
        id: "highland-manor",
        title: "Highland Manor",
        image: "/portfolio/branding/highland-manor.webp",
      },
      {
        id: "galis-home",
        title: "Gali’s Home",
        image: "/portfolio/branding/galis-home.webp",
      },
      {
        id: "osoujiyasan",
        title: "Osoujiyasan",
        image: "/portfolio/branding/osoujiyasan.webp",
      },
      {
        id: "hernandez",
        title: "Hernandez",
        image: "/portfolio/branding/hernandez.webp",
      },
      {
        id: "gem-and-glam",
        title: "Gem & Glam",
        image: "/portfolio/branding/gem-and-glam.webp",
      },
      {
        id: "brabalans",
        title: "Brabalans",
        image: "/portfolio/branding/brabalans.webp",
      },
      {
        id: "buffloom",
        title: "Buffloom",
        image: "/portfolio/branding/buffloom.webp",
      },
      {
        id: "scent-of-sands",
        title: "Scent of Sands",
        image: "/portfolio/branding/scent-of-sands.webp",
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
      },
      {
        id: "leafrooms",
        title: "Leafrooms",
        image: "/portfolio/social-media/leafrooms.webp",
      },
      {
        id: "swiftmount-solutions",
        title: "Swiftmount Solutions",
        image: "/portfolio/social-media/swiftmount-solutions.webp",
      },
      {
        id: "highland-manor",
        title: "Highland Manor",
        image: "/portfolio/social-media/highland-manor.webp",
      },
      {
        id: "pixelette-technologies",
        title: "Pixelette Technologies",
        image: "/portfolio/social-media/pixelette-technologies.webp",
      },
      {
        id: "pixelette-marketing",
        title: "Pixelette Marketing",
        image: "/portfolio/social-media/pixelette-marketing.webp",
      },
      {
        id: "pixelette-holdings",
        title: "Pixelette Holdings",
        image: "/portfolio/social-media/pixelette-holdings.webp",
      },
      {
        id: "pixelette-marketing-2",
        title: "Pixelette Marketing",
        image: "/portfolio/social-media/pixelette-marketing-2.webp",
      },
      {
        id: "carmentis",
        title: "Carmentis",
        image: "/portfolio/social-media/carmentis.webp",
      },
      {
        id: "fusio-block-guard",
        title: "Fusio Block Guard",
        image: "/portfolio/social-media/fusio-block-guard.webp",
      },
      {
        id: "akashic-knowing",
        title: "Akashic Knowing",
        image: "/portfolio/social-media/akashic-knowing.webp",
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
      },
      {
        id: "pixelette-technologies",
        title: "Pixelette Technologies",
        image: "/portfolio/ui-ux/pixelette-technologies.webp",
      },
      {
        id: "smart-contractor",
        title: "Smart Contractor",
        image: "/portfolio/ui-ux/smart-contractor.webp",
      },
      {
        id: "legal-mind-ai",
        title: "Legal Mind AI",
        image: "/portfolio/ui-ux/legal-mind-ai.webp",
      },
      {
        id: "chain-legal",
        title: "Chain Legal",
        image: "/portfolio/ui-ux/chain-legal.webp",
      },
      {
        id: "transact-secure",
        title: "Transact Secure",
        image: "/portfolio/ui-ux/transact-secure.webp",
      },
      {
        id: "health-predictor",
        title: "Health Predictor",
        image: "/portfolio/ui-ux/health-predictor.webp",
      },
      {
        id: "health-chain",
        title: "Health Chain",
        image: "/portfolio/ui-ux/health-chain.webp",
      },
      {
        id: "credit-smart-ai",
        title: "Credit Smart AI",
        image: "/portfolio/ui-ux/credit-smart-ai.webp",
      },
      {
        id: "law-ledger",
        title: "Law Ledger",
        image: "/portfolio/ui-ux/law-ledger.webp",
      },
      {
        id: "itmis",
        title: "ITMIS",
        image: "/portfolio/ui-ux/itmis.webp",
      },
    ],
  },
  { id: "ai-ad-creatives", label: "AI Ad Creatives", items: [] },
  { id: "video", label: "Video Editing", items: [] },
  { id: "website", label: "Web Development", items: [] },
];