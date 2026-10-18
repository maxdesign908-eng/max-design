// app/api/contact/route.ts : receives the contact form and emails it to you (Resend)
//
// Needs these environment variables (in .env.local on your computer, and in Vercel for the live site):
//   RESEND_API_KEY=re_xxxxxxxxx
//   CONTACT_TO_EMAIL=you@yourmail.com
//   CONTACT_FROM_EMAIL=Max Design <hello@yourdomain.com>      (no quote marks in Vercel)

import { NextResponse } from "next/server";
import { emailLayout } from "@/lib/emailTemplate";

export const runtime = "nodejs";

type Body = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  service?: string;
  services?: string[];
  budget?: string | null;
  details?: string;
};

const clean = (s: unknown, max = 3000) => String(s ?? "").trim().slice(0, max);

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "Email is not configured" }, { status: 500 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const company = clean(body.company, 200);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 60);
  const source = clean(body.source, 300);
  const budget = clean(body.budget, 100);
  const details = clean(body.details);
  const services = (Array.isArray(body.services) ? body.services : [body.service])
    .map((s) => clean(s, 100))
    .filter(Boolean);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone],
    ["Services", services.join(", ")],
    ["Budget", budget],
    ["Heard about us", source],
    ["Details", details],
  ];

  const html = emailLayout({ heading: "New project query", rows });

  const text = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Max Design Website <onboarding@resend.dev>",
      to: [to],
      reply_to: email, // pressing "Reply" in your mailbox answers the visitor
      subject: `New query from ${name || company || email}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}