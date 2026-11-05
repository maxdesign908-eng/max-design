import { caseStudies } from "@/data/caseStudies";
import { blogs } from "@/data/blogs";

export const revalidate = 3600;

const base = "https://www.maxdesign.agency";

// har page ki apni date: content badle to yeh date badlein
const pages: [string, string][] = [
  ["", "2026-11-05"],
  ["/about", "2026-11-05"],
  ["/services", "2026-11-05"],
  ["/brand-design", "2026-11-05"],
  ["/ui-ux-design", "2026-11-05"],
  ["/web-development", "2026-11-05"],
  ["/video-editing", "2026-11-05"],
  ["/ai-ad-creatives", "2026-11-05"],
  ["/social-media", "2026-11-05"],
  ["/portfolio", "2026-11-05"],
  ["/blogs", "2026-11-05"],
  ["/contact", "2026-11-05"],
  ["/book-a-call", "2026-11-05"],
];

export function GET() {
  const urls = [
    ...pages.map(([p, d]) => ({ loc: `${base}${p}`, date: d })),
    ...caseStudies.map((c) => ({ loc: `${base}/portfolio/${c.slug}`, date: "2026-11-05" })),
    ...blogs.map((b) => ({ loc: `${base}/blogs/${b.slug}`, date: b.date })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${new Date(u.date).toISOString()}</lastmod></url>`)
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}