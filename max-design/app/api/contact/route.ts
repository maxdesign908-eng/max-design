// app/api/contact/route.ts : receives BOTH forms and sends TWO emails each time:
//   1) to you (the team)      : the full request, "Reply" answers the visitor
//   2) to the visitor         : a professional confirmation with a copy of what they sent
//
//   - the contact block ("Send Your Query")      sends one `service`        -> treated as a QUERY
//   - the "Start your Project" page              sends a list `services`    -> treated as a PROJECT
//     (or send { kind: "project" | "query" } yourself to force it)
//
// Needs these environment variables (in .env.local on your computer, and in Vercel for the live site):
//   RESEND_API_KEY=re_xxxxxxxxx
//   CONTACT_TO_EMAIL=you@yourmail.com
//   CONTACT_FROM_EMAIL=Max Design <hello@yourdomain.com>      (no quote marks in Vercel)
// Optional:
//   CONTACT_RESPONSE_TIME=within 1 business day               (shown to the visitor in the email)

import { NextResponse } from "next/server";
import { SITE, emailLayout } from "@/lib/emailTemplate";

export const runtime = "nodejs";

/** what we promise the visitor. Change it here or with CONTACT_RESPONSE_TIME */
const RESPONSE_TIME = process.env.CONTACT_RESPONSE_TIME || "within 1 business day";

type Body = {
  kind?: "project" | "query";
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
/** one line only: stops a visitor from putting line breaks into an email subject */
const oneLine = (s: string, max = 120) => s.replace(/[\r\n\t]+/g, " ").trim().slice(0, max);

async function sendMail(m: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Max Design Website <onboarding@resend.dev>",
      to: [m.to],
      reply_to: m.replyTo,
      subject: m.subject,
      html: m.html,
      text: m.text,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

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

  const kind: "project" | "query" =
    body.kind === "project" || body.kind === "query" ? body.kind : Array.isArray(body.services) ? "project" : "query";
  const isProject = kind === "project";

  const who = oneLine(name || company || email, 80);
  const first = oneLine((name || company || "").split(/\s+/)[0] || "there", 40);
  const servicesText = services.join(", ");

  /* ───────── 1) the email to YOU ───────── */
  const ownerRows: [string, string][] = [
    ["Name", name],
    ["Company", company],
    ["Email", email],
    ["Phone", phone],
    [services.length > 1 ? "Services" : "Service", servicesText],
    ["Budget", budget],
    ["Heard about us", source],
    [isProject ? "Project details" : "Message", details],
  ];

  const ownerText = ownerRows
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  try {
    await sendMail({
      to,
      replyTo: email, // pressing "Reply" in your mailbox answers the visitor
      subject: oneLine(
        isProject
          ? `New project request: ${who}${servicesText ? ` · ${servicesText}` : ""}`
          : `New query from ${who}${servicesText ? ` · ${servicesText}` : ""}`,
      ),
      text: ownerText,
      html: emailLayout({
        eyebrow: isProject ? "Project request" : "New query",
        preheader: `${who}${servicesText ? ` · ${servicesText}` : ""}${budget ? ` · ${budget}` : ""}`,
        heading: isProject ? "New project request" : "New query",
        intro: `${who} sent this from the ${isProject ? "Start a Project page" : "contact form"} on your website.`,
        rows: ownerRows,
        cta: { label: `Reply to ${first === "there" ? "visitor" : first}`, href: `mailto:${email}` },
      }),
    });
  } catch (err) {
    console.error("[contact] owner email failed", err);
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }

  /* ───────── 2) the confirmation to the VISITOR ─────────
     If this one fails the request still counts (you already have it), so we only log it.
     It is awaited: on Vercel the function stops as soon as the answer is sent, so an email
     that is not awaited can be cut off before it leaves. */
  const visitorRows: [string, string][] = [
    ["Name", name],
    ["Company", company],
    [services.length > 1 ? "Services" : "Service", servicesText],
    ["Budget", budget],
    [isProject ? "Project details" : "Your message", details],
  ];

  const visitorText = [
    `Hi ${first},`,
    "",
    isProject
      ? "Thank you for sending us your project request. It is in the right hands now."
      : "Thank you for getting in touch. Your query has been received.",
    "",
    `A member of the MAX design team will contact you at ${email} ${RESPONSE_TIME}.`,
    "",
    "Here is a copy of what you sent us:",
    ...visitorRows.filter(([, v]) => v).map(([k, v]) => `- ${k}: ${v}`),
    "",
    `Prefer to talk right away? Book a call: ${SITE}/book-a-call`,
    "You can also just reply to this email if you want to add something.",
    "",
    "Warm regards,",
    "Team MAX design",
  ].join("\n");

  try {
    await sendMail({
      to: email,
      replyTo: to, // if the visitor replies, it lands in your team's inbox
      subject: isProject
        ? "We received your project request | MAX design"
        : "We received your query | MAX design",
      text: visitorText,
      html: emailLayout({
        eyebrow: isProject ? "Project request" : "Your query",
        preheader: isProject
          ? `Thank you ${first}, our team will contact you ${RESPONSE_TIME}.`
          : `Thank you ${first}, we will get back to you ${RESPONSE_TIME}.`,
        heading: isProject ? `Thank you, ${first}. Your project request is in.` : `Thank you, ${first}. We received your query.`,
        intro: isProject
          ? "We are excited to learn more about your project. Our team has your request and will review it with care. Below is a copy of what you sent us."
          : "Thank you for getting in touch with MAX design. Our team has your message and will review it with care. Below is a copy of what you sent us.",
        summary: "Your request",
        rows: visitorRows,
        stepsTitle: "What happens next",
        steps: [
          {
            title: "We review your request",
            text: isProject
              ? "Our team goes through your services, budget and project details."
              : "Our team reads your message and finds the right person to answer it.",
          },
          {
            title: "We get in touch",
            text: `A member of our team will contact you at ${email} ${RESPONSE_TIME}.`,
          },
          {
            title: isProject ? "We shape the plan together" : "We find the best way to help",
            text: isProject
              ? "We agree on scope, timeline and the next steps, and then we get to work."
              : "We talk through your needs and suggest the best next step.",
          },
        ],
        cta: { label: "Prefer to talk now? Book a call", href: `${SITE}/book-a-call` },
        note: "Want to add something? Just reply to this email and it will reach our team directly.",
        signoff: true,
        footerNote: "You are receiving this email because you sent a request through our website.",
      }),
    });
  } catch (err) {
    console.error("[contact] visitor email failed", err);
  }

  return NextResponse.json({ ok: true });
}