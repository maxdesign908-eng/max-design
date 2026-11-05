import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/caseStudies";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.maxdesign.agency";

  const pages = [
    "",
    "/about",
    "/services",
    "/brand-design",
    "/ui-ux-design",
    "/web-development",
    "/video-editing",
    "/ai-ad-creatives",
    "/social-media",
    "/portfolio",
    "/blogs",
    "/contact",
    "/book-a-call",
  ];

  const staticPages = pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const caseStudyPages = caseStudies.map((c) => ({
    url: `${base}/portfolio/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...caseStudyPages];
}