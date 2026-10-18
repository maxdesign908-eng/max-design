/**
 * Portfolio data.
 * Nayi image add karni ho to: image ko /public/portfolio/<category>/ me (webp) rakho
 * aur neeche us category ke `items` me ek object add kar do.
 *
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
        crop: { width: 917.85546875, height: 1379.0262451171875, left: -129.98, top: -126.21 },
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
      },
    ],
  },
  { id: "social-media", label: "Social Media", items: [] },
  { id: "ui-ux", label: "UI/UX", items: [] },
  { id: "ai-ad-creatives", label: "AI-powered ad creatives", items: [] },
  { id: "website", label: "Website Design & Development", items: [] },
  { id: "video", label: "Video Production & Editing", items: [] },
];
