import fs from "fs";
import path from "path";

export type Blog = { slug: string; title: string; date: string; body: string };

const dir = path.join(process.cwd(), "content", "blogs");

function parse(raw: string) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const meta: Record<string, string> = {};
  let body = raw;
  if (m) {
    body = m[2];
    for (const line of m[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return { meta, body };
}

export function getBlogs(): Blog[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const slug = f.replace(/\.mdx?$/, "");
      const { meta, body } = parse(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug,
        title: meta.title || slug,
        date: meta.date || new Date(fs.statSync(path.join(dir, f)).mtime).toISOString(),
        body,
      };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export const getBlog = (slug: string) => getBlogs().find((b) => b.slug === slug);