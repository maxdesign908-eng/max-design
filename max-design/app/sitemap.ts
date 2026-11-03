import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.maxdesign.agency.com";
  return [
    { url: base, lastModified: new Date() },
    // add your other pages, e.g. `${base}/start-your-project`
  ];
}