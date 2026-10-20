/**
 * Portfolio data.
 * Nayi image add karni ho to: image ko /public/portfolio/<category>/ me (webp) rakho
 * aur neeche us category ke `items` me ek object add kar do.
 *
 * Images 1400px wide webp hain (card ke ratio 560x721 ke hisab se).
 * `crop` OPTIONAL hai. Figma ki image properties (width, height, left, top)
 * seedha paste kar sakte ho (card = 560 x 721 ke hisab se). Na do to image
 * card me `object-cover` se fit hogi.
 */
export const CARD_W = 560;
export const CARD_H = 721;

export type FigmaCrop = { width: number; height: number; left: number; top: number };

export type PortfolioItem = {
  id: string;
  title: string;
  image: string;
  /** Agar image ke andar naam pehle se likha ho to true karo (label bar chhup jayegi) */
  labelInImage?: boolean;
  crop?: FigmaCrop;
};

export type PortfolioCategory = {
  id: string;
  label: string;
  items: PortfolioItem[];
};

export const portfolioCategories: PortfolioCategory[] = [
  {
    id: "branding",
    label: "Branding",
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
  { id: "social-media", label: "Social Media", items: [] },
  { id: "ui-ux", label: "UI/UX", items: [] },
  { id: "ai-ad-creatives", label: "AI Ad Creatives", items: [] },
  { id: "video", label: "Video Editing", items: [] },
  { id: "website", label: "Web Development", items: [] },
  ,
];
