import fs from "fs";
import path from "path";
import { caseStudies } from "@/data/caseStudies";
import { getBlogs } from "@/lib/blogs";

export const dynamic = "force-static"; // build ke waqt scan hota hai, har deploy par naya list

const base = "https://www.maxdesign.agency";
const EXCLUDE = new Set(["/hi"]); // test / private pages yahan likhein

const appDir = fs.existsSync(path.join(process.cwd(), "src", "app"))
  ? path.join(process.cwd(), "src", "app")
  : path.join(process.cwd(), "app");

const PAGE_FILES = ["page.tsx", "page.jsx", "page.ts", "page.js", "page.mdx"];

function pageFile(dir: string) {
  return PAGE_FILES.map((f) => path.join(dir, f)).find((f) => fs.existsSync(f));
}

function scan(dir: string, route = ""): { route: string; date: Date }[] {
  const out: { route: string; date: Date }[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const n = e.name;
    // api, private (_), parallel (@) aur dynamic ([slug]) folders alag handle hote hain
    if (n === "api" || n.startsWith("_") || n.startsWith("@") || n.startsWith("[")) continue;
    const next = n.startsWith("(") ? route : `${route}/${n}`;
    const full = path.join(dir, n);
    const file = pageFile(full);
    if (file) out.push({ route: next, date: fs.statSync(file).mtime });
    out.push(...scan(full, next));
  }
  return out;
}

export function GET() {
  const home = pageFile(appDir);
  const found = [
    ...(home ? [{ route: "", date: fs.statSync(home).mtime }] : []),
    ...scan(appDir),
  ].filter((p) => !EXCLUDE.has(p.route));

  const seen = new Set<string>();
  const urls: { loc: string; date: Date }[] = [];
  for (const p of found) {
    if (seen.has(p.route)) continue;
    seen.add(p.route);
    urls.push({ loc: `${base}${p.route}`, date: p.date });
  }

  // portfolio/[slug]: data/caseStudies.ts se
  for (const c of caseStudies) urls.push({ loc: `${base}/portfolio/${c.slug}`, date: new Date() });

  // blogs/[slug]: content/blogs/*.md se, blog ki apni date ke saath
  for (const b of getBlogs()) urls.push({ loc: `${base}/blogs/${b.slug}`, date: new Date(b.date) });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.date.toISOString()}</lastmod></url>`).join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}