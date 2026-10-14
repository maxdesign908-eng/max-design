import { NextResponse } from "next/server";
import { BOOKING, fmtDate, fmtTime, generateSlots, isValidTimeZone, tzLabel } from "@/lib/booking";
import { addBooking, removeBooking, takenBetween } from "@/lib/bookingStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/* ───────── GET: which times are already taken (the pop-up hides them) ───────── */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const from = Number(sp.get("from"));
  const to = Math.min(Number(sp.get("to")), from + 120 * 86_400_000);
  if (!Number.isFinite(from) || !Number.isFinite(to)) return NextResponse.json({ taken: [] });
  return NextResponse.json({ taken: await takenBetween(from, to) }, { headers: { "Cache-Control": "no-store" } });
}

/* ───────── email (Resend, plain fetch, no package needed) ───────── */
async function sendMail(m: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.BOOKING_FROM_EMAIL || process.env.CONTACT_FROM_EMAIL || "MAX design <onboarding@resend.dev>",
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      reply_to: m.replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

/* ───────── POST: book a call ───────── */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const start = Number(body.start);
  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const notes = String(body.notes ?? "").trim().slice(0, 1000);
  const tz = typeof body.tz === "string" && isValidTimeZone(body.tz) ? body.tz : BOOKING.timezone;

  if (!name || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter your name and a valid email." }, { status: 400 });
  }
  // the time must really be one of YOUR open times (rules in lib/booking.ts)
  if (!Number.isFinite(start) || !generateSlots(Date.now()).includes(start)) {
    return NextResponse.json({ error: "That time is no longer available. Please pick another one." }, { status: 409 });
  }

  const saved = await addBooking({ start, tz, name, email, notes, createdAt: Date.now() });
  if (saved === "taken") {
    return NextResponse.json({ error: "That time was just taken. Please pick another one." }, { status: 409 });
  }

  /* the email to you */
  const owner = process.env.BOOKING_TO_EMAIL || process.env.CONTACT_TO_EMAIL; // same inbox as the contact form
  const mine = `${fmtDate(start, BOOKING.timezone)}, ${fmtTime(start, BOOKING.timezone)} – ${fmtTime(start + BOOKING.lengthMin * 60_000, BOOKING.timezone)} (${tzLabel(BOOKING.timezone, start)})`;
  const theirs = `${fmtDate(start, tz)}, ${fmtTime(start, tz)} – ${fmtTime(start + BOOKING.lengthMin * 60_000, tz)} (${tzLabel(tz, start)})`;

  if (!process.env.RESEND_API_KEY || !owner) {
    if (process.env.NODE_ENV === "production") {
      await removeBooking(start);
      return NextResponse.json({ error: "Booking is not set up yet. Please use the contact form." }, { status: 500 });
    }
    console.log(`[book] (no email set up, saved only) ${name} <${email}> ${mine}\n${notes}`);
    return NextResponse.json({ ok: true });
  }

  try {
    await sendMail({
      to: owner,
      replyTo: email,
      subject: `New call booked: ${name} · ${fmtDate(start, BOOKING.timezone)} ${fmtTime(start, BOOKING.timezone)}`,
      text: `${BOOKING.title}\n\nWhen (your time): ${mine}\nWhen (their time): ${theirs}\n\nName: ${name}\nEmail: ${email}\nNotes: ${notes || "-"}`,
      html: `<h2>${esc(BOOKING.title)}</h2>
<p><b>When (your time):</b> ${esc(mine)}<br><b>When (their time):</b> ${esc(theirs)}</p>
<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Notes:</b> ${esc(notes || "-")}</p>`,
    });
  } catch (err) {
    console.error("[book] email failed", err);
    await removeBooking(start); // free the time again so the visitor can retry
    return NextResponse.json({ error: "We could not send your booking. Please try again." }, { status: 502 });
  }

  /* a confirmation to the visitor (if this one fails the booking still stands) */
  sendMail({
    to: email,
    subject: `Your call with MAX design is booked`,
    text: `Hi ${name},\n\nYour ${BOOKING.lengthMin} minute call is booked:\n${theirs}\n\nWe will contact you before the call.\n\nMAX design`,
    html: `<p>Hi ${esc(name)},</p><p>Your ${BOOKING.lengthMin} minute call is booked:<br><b>${esc(theirs)}</b></p><p>We will contact you before the call.</p><p>MAX design</p>`,
  }).catch((e) => console.error("[book] visitor email failed", e));

  return NextResponse.json({ ok: true });
}
