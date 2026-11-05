import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/caseStudies";
import { blogs } from "@/data/blogs";

const base = "https://www.maxdesign.agency";

// har page ki apni date: content badle to yeh date badlein
const pages = [
  { path: "", date: "2026-11-05", priority: 1 },
  { path: "/about", date: "2026-11-05", priority: 0.8 },
  { path: "/services", date: "2026-11-05", priority: 0.8 },
  { path: "/brand-design", date: "2026-11-05", priority: 0.8 },
  { path: "/ui-ux-design", date: "2026-11-05", priority: 0.8 },
  { path: "/web-development", date: "2026-11-05", priority: 0.8 },
  { path: "/video-editing", date: "2026-11-05", priority: 0.8 },
  { path: "/ai-ad-creatives", date: "2026-11-05", priority: 0.8 },
  { path: "/social-media", date: "2026-11-05", priority: 0.8 },
  { path: "/portfolio", date: "2026-11-05", priority: 0.8 },
  { path: "/blogs", date: "2026-11-05", priority: 0.8 },
  { path: "/contact", date: "2026-11-05", priority: 0.7 },
  { path: "/book-a-call", date: "2026-11-05", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = pages.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: new Date(p.date),
    priority: p.priority,
  }));

  const caseStudyPages = caseStudies.map((c) => ({
    url: `${base}/portfolio/${c.slug}`,
    lastModified: new Date("2026-11-05"),
    priority: 0.6,
  }));

  const blogPages = blogs.map((b) => ({
    url: `${base}/blogs/${b.slug}`,
    lastModified: new Date(b.date), // blog ki apni publish date + time
    priority: 0.7,
  }));

  // blogs list ke upar /blogs ka page bhi naye blog ki date le sakta hai
  return [...staticPages, ...caseStudyPages, ...blogPages];
}