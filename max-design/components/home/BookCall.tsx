"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  BOOKING,
  dateKey,
  fmtDate,
  fmtTime,
  generateSlots,
  isValidTimeZone,
  listTimeZones,
  ordinal,
  tzLabel,
} from "@/lib/booking";

/*
  "Book A Call Directly" pop-up (dark theme: black + red #E71117).
  Pick a day + time (shown in the visitor's own time zone), type name + email, confirm.
  The booking is sent to /api/book, which emails it to you.

  Your open days / hours / call length / how far ahead people can book live in  lib/booking.ts

  Months: the visitor can move freely between this month and the last month you allow
  (BOOKING.maxDaysAhead), even when a month has no free days.
*/

type Props = {
  open: boolean;
  onClose: () => void;
  /** pre-fill from the contact form, if the visitor already typed them there */
  defaultName?: string;
  defaultEmail?: string;
  endpoint?: string;
};

const RED = "#E71117";

const MONTH = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
const MONTH_SHORT = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "UTC" });
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const pad = (n: number) => String(n).padStart(2, "0");
const keyOf = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const monthIndexOf = (k: string) => {
  const [y, m] = k.split("-").map(Number);
  return y * 12 + (m - 1);
};

const CSS = `
  @keyframes bcIn   { from { opacity: 0; transform: translateY(18px) scale(.985); } to { opacity: 1; transform: none; } }
  @keyframes bcFade { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
  .bc-scroll { scrollbar-width: thin; scrollbar-color: ${RED} transparent; }
  .bc-scroll::-webkit-scrollbar { width: 6px; }
  .bc-scroll::-webkit-scrollbar-thumb { background: ${RED}; border-radius: 6px; }
  .bc input:-webkit-autofill,
  .bc textarea:-webkit-autofill { -webkit-text-fill-color: #fff; caret-color: #fff; transition: background-color 99999s ease-out; }
`;

function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d={d} />
    </svg>
  );
}

const ICON = {
  globe: "M12 21a9 9 0 100-18 9 9 0 000 18zM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  cal: "M7 3v3M17 3v3M4 9h16M5 5h14a1 1 0 011 1v13a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z",
  left: "M15 6l-6 6 6 6",
  right: "M9 6l6 6-6 6",
  down: "M6 9l6 6 6-6",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12.5l4.5 4.5L19 7.5",
};

export default function BookCall({ open, onClose, defaultName = "", defaultEmail = "", endpoint = "/api/book" }: Props) {
  const [tz, setTz] = useState(BOOKING.timezone);
  const [base, setBase] = useState<number[]>([]);
  const [taken, setTaken] = useState<Set<number>>(new Set());
  const [month, setMonth] = useState({ y: 0, m: 0 });
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState<number | null>(null);
  const [step, setStep] = useState<"pick" | "details" | "done">("pick");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const dialog = useRef<HTMLDivElement>(null);

  /* ---------- open / close housekeeping ---------- */
  useEffect(() => {
    if (!open) return;
    const before = document.activeElement as HTMLElement | null;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const z = isValidTimeZone(zone) ? zone : BOOKING.timezone;
    setTz(z);
    setBase(generateSlots(Date.now()));
    const [cy, cm] = dateKey(Date.now(), z).split("-").map(Number);
    setMonth({ y: cy, m: cm - 1 });
    setStep("pick");
    setSlot(null);
    setDay("");
    setStatus("idle");
    setMessage("");
    setName(defaultName);
    setEmail(defaultEmail);
    setNotes("");

    // times somebody else already booked
    const from = Date.now();
    const to = from + (BOOKING.maxDaysAhead + 1) * 86_400_000;
    const ctrl = new AbortController();
    fetch(`${endpoint}?from=${from}&to=${to}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j: { taken?: number[] }) => setTaken(new Set(j.taken ?? [])))
      .catch(() => {});

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus();
    return () => {
      ctrl.abort();
      document.body.style.overflow = prevOverflow;
      before?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ---------- open times, grouped by the visitor's calendar day ---------- */
  const byDay = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const s of base) {
      if (taken.has(s)) continue;
      const k = dateKey(s, tz);
      const arr = map.get(k);
      if (arr) arr.push(s);
      else map.set(k, [s]);
    }
    return map;
  }, [base, taken, tz]);
  const dayKeys = useMemo(() => Array.from(byDay.keys()).sort(), [byDay]);

  // choose the first open day (also when the time zone changes and the old day is gone)
  useEffect(() => {
    if (!open || (day && byDay.has(day))) return;
    const k = dayKeys[0];
    if (!k) return;
    const [y, m] = k.split("-").map(Number);
    setDay(k);
    setMonth({ y, m: m - 1 });
  }, [open, day, byDay, dayKeys]);

  /* ---------- free month navigation: from this month to the last bookable month ---------- */
  const todayKey = useMemo(() => dateKey(Date.now(), tz), [tz, open]); // eslint-disable-line react-hooks/exhaustive-deps
  const winMin = monthIndexOf(todayKey);
  const winMax = base.length ? Math.max(winMin, monthIndexOf(dateKey(base[base.length - 1], tz))) : winMin;
  const cur = month.y * 12 + month.m;
  const ready = month.y > 0;
  const canPrev = ready && cur > winMin;
  const canNext = ready && cur < winMax;

  const go = (delta: number) => {
    const i = cur + delta;
    const y = Math.floor(i / 12), m = ((i % 12) + 12) % 12;
    setMonth({ y, m });
    // jump to the first free day of that month (keep the chosen day if it is already in that month)
    const prefix = `${y}-${pad(m + 1)}-`;
    if (day.startsWith(prefix)) return;
    const first = dayKeys.find((k) => k.startsWith(prefix));
    if (first) {
      setDay(first);
      setSlot(null);
    }
  };

  const cells = useMemo(() => {
    const first = new Date(Date.UTC(month.y, month.m, 1)).getUTCDay();
    const dim = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
    const total = Math.ceil((first + dim) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(Date.UTC(month.y, month.m, 1 - first + i));
      const y = d.getUTCFullYear(), m = d.getUTCMonth(), n = d.getUTCDate();
      return { n, inMonth: m === month.m, key: keyOf(y, m, n) };
    });
  }, [month]);

  const times = byDay.get(day) ?? [];
  const zones = useMemo(() => listTimeZones(tz), [tz]);

  const dayTitle = (() => {
    if (!day) return "";
    const [y, m, d] = day.split("-").map(Number);
    const t = Date.UTC(y, m - 1, d);
    return `${WEEKDAY.format(t)}, ${MONTH_SHORT.format(t)} ${ordinal(d)}`;
  })();

  /* ---------- actions ---------- */
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending" || slot == null) return;
    if (!name.trim() || !EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter your name and a valid email.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: slot, tz, name: name.trim(), email: email.trim(), notes: notes.trim() }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.status === 409) {
        setTaken((c) => new Set(c).add(slot));
        setSlot(null);
        setStep("pick");
        setStatus("error");
        setMessage(j.error || "That time was just taken. Please pick another one.");
        return;
      }
      if (!res.ok) throw new Error(j.error || "failed");
      setStatus("idle");
      setStep("done");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error && err.message !== "failed" ? err.message : "Something went wrong. Please try again.");
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const items = Array.from(
      dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]), select, input, textarea, a[href], [tabindex]:not([tabindex="-1"])') ?? [],
    ).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  const field =
    "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] text-white outline-none transition-colors placeholder:text-white/35 hover:border-white/25 focus:border-[#E71117] focus:bg-white/[0.06]";
  const arrow =
    "grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-[#E71117] hover:bg-[#E71117] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] disabled:cursor-default disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:bg-transparent";

  return (
    <div className="fixed inset-0 z-[9990] flex items-end justify-center sm:items-center sm:p-6" onKeyDown={onKeyDown}>
      <style>{CSS}</style>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[3px]" onClick={onClose} aria-hidden="true" />

      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookcall-title"
        tabIndex={-1}
        className="bc relative flex max-h-[94dvh] w-full max-w-[1000px] animate-[bcIn_0.4s_cubic-bezier(0.22,1,0.36,1)_both] flex-col overflow-hidden rounded-t-[24px] border border-white/10 bg-[#0A0A0A] text-white shadow-[0_40px_120px_-20px_rgba(231,17,23,0.28),0_30px_80px_rgba(0,0,0,0.7)] outline-none motion-reduce:animate-none sm:rounded-[24px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/15 bg-black/40 text-white transition-colors hover:border-[#E71117] hover:bg-[#E71117] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117]"
        >
          <Icon d={ICON.close} className="h-4 w-4" />
        </button>

        <div className="bc-scroll grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* ───────── left: what this call is ───────── */}
          <aside className="border-b border-white/10 p-6 pr-16 sm:p-8 lg:border-r lg:border-b-0 lg:pr-8">
            <div className="mb-5 flex items-center gap-2.5">
              <span aria-hidden="true" className="h-3 w-3 rotate-45 rounded-[3px] bg-[#E71117]" />
              <span className="text-[13px] tracking-[0.08em] text-white/60 uppercase">MAX design</span>
            </div>

            <h2 id="bookcall-title" className="m-0 text-[26px] leading-[1.15] font-medium tracking-[-0.02em] lg:text-[30px]">
              {BOOKING.title}
            </h2>

            <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0 text-[15px] text-white/75">
              <li className="flex items-center gap-3">
                <Icon d={ICON.clock} className="h-[18px] w-[18px] shrink-0 text-[#E71117]" />
                {BOOKING.lengthMin} minute call
              </li>

              {step === "pick" ? (
                <li className="relative flex items-center gap-3">
                  <Icon d={ICON.globe} className="h-[18px] w-[18px] shrink-0 text-[#E71117]" />
                  <label className="relative min-w-0 flex-1">
                    <span className="sr-only">Time zone</span>
                    <select
                      value={tz}
                      onChange={(e) => {
                        setTz(e.target.value);
                        setSlot(null);
                      }}
                      className="w-full cursor-pointer appearance-none truncate rounded-lg border border-white/15 bg-white/[0.04] py-2 pr-9 pl-3 text-[14px] text-white [color-scheme:dark] outline-none transition-colors hover:border-white/25 focus:border-[#E71117]"
                    >
                      {zones.map((z) => (
                        <option key={z} value={z} className="bg-[#111] text-white">
                          {tzLabel(z)} {z.includes("/") ? `· ${z.split("/")[0]}` : ""}
                        </option>
                      ))}
                    </select>
                    <Icon d={ICON.down} className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-white/60" />
                  </label>
                </li>
              ) : (
                slot != null && (
                  <>
                    <li className="flex items-start gap-3">
                      <Icon d={ICON.cal} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#E71117]" />
                      <span className="leading-snug">
                        {fmtDate(slot, tz)}
                        <br />
                        <span className="text-white">
                          {fmtTime(slot, tz)} – {fmtTime(slot + BOOKING.lengthMin * 60_000, tz)}
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icon d={ICON.globe} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#E71117]" />
                      <span className="text-[14px] leading-snug text-white/60">{tzLabel(tz, slot)}</span>
                    </li>
                  </>
                )
              )}
            </ul>

            {step === "details" && (
              <button
                type="button"
                onClick={() => {
                  setStep("pick");
                  setMessage("");
                  setStatus("idle");
                }}
                className="mt-6 flex cursor-pointer items-center gap-1.5 text-[14px] text-white/60 transition-colors hover:text-[#E71117] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E71117]"
              >
                <Icon d={ICON.left} className="h-4 w-4" />
                Choose another time
              </button>
            )}
          </aside>

          {/* ───────── right: the steps ───────── */}
          <section className="min-w-0 p-5 sm:p-8">
            {message && step === "pick" && (
              <p role="alert" className="mb-5 rounded-xl border border-[#E71117]/35 bg-[#E71117]/10 px-4 py-3 text-[14px] text-[#ff9095]">
                {message}
              </p>
            )}

            {/* step 1: choose a day and a time */}
            {step === "pick" && (
              <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_210px]">
                <div className="min-w-0">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="m-0 text-[18px] font-medium tracking-[-0.01em]" aria-live="polite">
                      {ready ? MONTH.format(Date.UTC(month.y, month.m, 1)) : "\u00A0"}
                    </h3>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous month" className={arrow}>
                        <Icon d={ICON.left} className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => go(1)} disabled={!canNext} aria-label="Next month" className={arrow}>
                        <Icon d={ICON.right} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[12px] tracking-wide text-white/40 sm:gap-2">
                    {DOW.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  <div key={cur} className="grid animate-[bcFade_0.3s_ease-out_both] grid-cols-7 gap-1.5 motion-reduce:animate-none sm:gap-2">
                    {cells.map((c) => {
                      if (!c.inMonth) return <span key={c.key} aria-hidden="true" />;
                      const available = byDay.has(c.key);
                      const selected = available && c.key === day;
                      const isToday = c.key === todayKey;
                      return (
                        <button
                          key={c.key}
                          type="button"
                          disabled={!available}
                          onClick={() => {
                            setDay(c.key);
                            setSlot(null);
                          }}
                          aria-pressed={selected}
                          aria-label={available ? `${c.key}, ${byDay.get(c.key)?.length} times open` : `${c.key}, not available`}
                          className={`relative grid aspect-square w-full place-items-center rounded-xl text-[15px] transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] ${
                            selected
                              ? "cursor-pointer bg-[#E71117] font-medium text-white shadow-[0_10px_28px_-8px_rgba(231,17,23,0.8)]"
                              : available
                                ? "cursor-pointer bg-white/[0.06] font-medium text-white hover:-translate-y-0.5 hover:bg-[#E71117]/25"
                                : "cursor-default text-white/25"
                          }`}
                        >
                          {c.n}
                          {isToday && (
                            <span aria-hidden="true" className={`absolute bottom-1.5 h-1 w-1 rounded-full ${selected ? "bg-white" : "bg-[#E71117]"}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="min-w-0 sm:border-l sm:border-white/10 sm:pl-8">
                  <p className="m-0 mb-1 text-[16px] font-medium">{dayTitle || "Pick a day"}</p>
                  <p className="m-0 mb-4 text-[13px] text-white/45">{day ? "Choose a time" : base.length ? "Choose a free day" : "Loading…"}</p>
                  <ul className="bc-scroll m-0 flex max-h-[300px] list-none flex-col gap-2.5 overflow-y-auto p-0 pr-1 sm:max-h-[372px]" aria-label="Open times">
                    {times.map((t) => (
                      <li key={t} className="m-0 p-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSlot(t);
                            setStep("details");
                            setStatus("idle");
                            setMessage("");
                          }}
                          className="w-full cursor-pointer rounded-xl border border-white/15 py-3 text-center text-[15px] text-white transition-colors hover:border-[#E71117] hover:bg-[#E71117] focus-visible:border-[#E71117] focus-visible:bg-[#E71117] focus-visible:outline-none"
                        >
                          {fmtTime(t, tz)}
                        </button>
                      </li>
                    ))}
                    {day && times.length === 0 && <li className="py-2 text-[14px] text-white/45">No times left on this day.</li>}
                    {!day && base.length > 0 && <li className="py-2 text-[14px] text-white/45">No free days in this month.</li>}
                  </ul>
                </div>
              </div>
            )}

            {/* step 2: your details */}
            {step === "details" && slot != null && (
              <form onSubmit={submit} noValidate aria-label="Your details" className="mx-auto max-w-[520px] lg:mx-0">
                <h3 className="m-0 mb-6 text-[22px] font-medium tracking-[-0.01em]">Your details</h3>
                <div className="grid gap-5">
                  <label className="grid gap-2 text-[14px] text-white/75">
                    Full name*
                    <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" className={field} autoFocus />
                  </label>
                  <label className="grid gap-2 text-[14px] text-white/75">
                    Email*
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="you@example.com" className={field} />
                  </label>
                  <label className="grid gap-2 text-[14px] text-white/75">
                    <span>
                      Anything we should know? <span className="text-white/40">(optional)</span>
                    </span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="A few words about your project" className={`${field} resize-none`} />
                  </label>
                </div>

                {message && step === "details" && (
                  <p role="alert" className="mt-5 mb-0 rounded-xl border border-[#E71117]/35 bg-[#E71117]/10 px-4 py-3 text-[14px] text-[#ff9095]">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-7 flex h-[52px] w-full cursor-pointer items-center justify-center rounded-full bg-[#E71117] text-[16px] font-medium text-white transition-colors hover:bg-[#ff1e2d] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "sending" ? "Booking…" : "Confirm booking"}
                </button>
              </form>
            )}

            {/* step 3: done */}
            {step === "done" && slot != null && (
              <div className="mx-auto flex min-h-[320px] max-w-[440px] flex-col items-center justify-center py-6 text-center" role="status">
                <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#E71117] text-white shadow-[0_14px_40px_-10px_rgba(231,17,23,0.9)]">
                  <Icon d={ICON.check} className="h-8 w-8" />
                </span>
                <h3 className="m-0 text-[28px] font-medium tracking-[-0.02em]">You’re booked!</h3>
                <p className="mt-4 mb-0 text-[16px] leading-relaxed text-white/80">
                  {fmtDate(slot, tz)}
                  <br />
                  {fmtTime(slot, tz)} – {fmtTime(slot + BOOKING.lengthMin * 60_000, tz)}
                </p>
                <p className="mt-1 mb-0 text-[13px] text-white/45">{tzLabel(tz, slot)}</p>
                <p className="mt-5 mb-0 text-[14px] leading-relaxed text-white/55">We got your booking and will email the details to {email}.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-8 h-12 cursor-pointer rounded-full border border-white/20 px-9 text-[15px] font-medium text-white transition-colors hover:border-[#E71117] hover:bg-[#E71117] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#E71117]"
                >
                  Close
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}