"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
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

type Props = {
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

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const CSS = `
  @keyframes bcFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes bcRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
  .bc-scroll { scrollbar-width: thin; scrollbar-color: ${RED} transparent; }
  .bc-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .bc-scroll::-webkit-scrollbar-thumb { background: ${RED}; border-radius: 6px; }
  .bc-noscroll { scrollbar-width: none; }
  .bc-noscroll::-webkit-scrollbar { display: none; }
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
  check: "M5 12.5l4.5 4.5L19 7.5",
};

export default function BookCallPage({ defaultName = "", defaultEmail = "", endpoint = "/api/book" }: Props) {
  const [tz, setTz] = useState(BOOKING.timezone);
  const [base, setBase] = useState<number[]>([]);
  const [taken, setTaken] = useState<Set<number>>(new Set());
  const [month, setMonth] = useState({ y: 0, m: 0 });
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState<number | null>(null);
  const [step, setStep] = useState<"pick" | "details" | "done">("pick");
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");
  const timesRef = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const now = Date.now();
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const z = isValidTimeZone(zone) ? zone : BOOKING.timezone;
    const slots = generateSlots(now);
    const first = slots.length ? dateKey(slots[0], z) : dateKey(now, z);
    const [fy, fm] = first.split("-").map(Number);
    setTz(z);
    setBase(slots);
    setMonth({ y: fy, m: fm - 1 });
    setDay(first);
  }, []);

  useEffect(() => {
    const from = Date.now();
    const to = from + (BOOKING.maxDaysAhead + 1) * 86_400_000;
    const ctrl = new AbortController();
    fetch(`${endpoint}?from=${from}&to=${to}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((j: { taken?: number[] }) => setTaken(new Set(j.taken ?? [])))
      .catch(() => {});
    return () => ctrl.abort();
  }, [endpoint]);

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

  const ready = month.y > 0;
  const todayKey = useMemo(() => (ready ? dateKey(Date.now(), tz) : ""), [tz, ready]);

  const winMin = todayKey ? monthIndexOf(todayKey) : 0;
  const winMax = base.length ? Math.max(winMin, monthIndexOf(dateKey(base[base.length - 1], tz))) : winMin;
  const cur = month.y * 12 + month.m;
  const canPrev = ready && cur > winMin;
  const canNext = ready && cur < winMax;
  const months = useMemo(() => (ready ? Array.from({ length: winMax - winMin + 1 }, (_, i) => winMin + i) : []), [ready, winMin, winMax]);

  const goTo = (index: number) => {
    if (index < winMin || index > winMax) return;
    const y = Math.floor(index / 12), m = ((index % 12) + 12) % 12;
    setMonth({ y, m });
    const prefix = `${y}-${pad(m + 1)}-`;
    if (day.startsWith(prefix)) return;
    const free = dayKeys.find((k) => k.startsWith(prefix));
    const fallback = index === winMin ? todayKey : `${prefix}01`;
    setDay(free ?? fallback);
    setSlot(null);
  };

  useEffect(() => {
    const box = strip.current;
    const chip = box?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!box || !chip) return;
    box.scrollTo({ left: chip.offsetLeft - (box.clientWidth - chip.offsetWidth) / 2, behavior: "smooth" });
  }, [cur, months.length]);

  const cells = useMemo(() => {
    if (!ready) return [];
    const first = new Date(Date.UTC(month.y, month.m, 1)).getUTCDay();
    const dim = new Date(Date.UTC(month.y, month.m + 1, 0)).getUTCDate();
    const total = Math.ceil((first + dim) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(Date.UTC(month.y, month.m, 1 - first + i));
      const y = d.getUTCFullYear(), m = d.getUTCMonth(), n = d.getUTCDate();
      return { n, inMonth: m === month.m, key: keyOf(y, m, n) };
    });
  }, [month, ready]);

  const times = byDay.get(day) ?? [];
  const zones = useMemo(() => (ready ? listTimeZones(tz) : [tz]), [tz, ready]);

  const dayTitle = (() => {
    if (!day) return "";
    const [y, m, d] = day.split("-").map(Number);
    const t = Date.UTC(y, m - 1, d);
    return `${WEEKDAY.format(t)}, ${MONTH_SHORT.format(t)} ${ordinal(d)}`;
  })();

  function changeZone(next: string) {
    setTz(next);
    setSlot(null);
    const k = base.find((s) => !taken.has(s));
    if (k != null) {
      const key = dateKey(k, next);
      const [y, m] = key.split("-").map(Number);
      setDay(key);
      setMonth({ y, m: m - 1 });
    }
  }

  function pickDay(key: string) {
    setDay(key);
    setSlot(null);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      window.setTimeout(() => timesRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
    }
  }

  function backToPick() {
    setStep("pick");
    setMessage("");
    setStatus("idle");
  }

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
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error && err.message !== "failed" ? err.message : "Something went wrong. Please try again.");
    }
  }

  const field =
    "w-full rounded-2xl bg-white/[0.04] px-5 py-4 text-[15px] text-white outline-none transition-all placeholder:text-white/30 hover:bg-white/[0.07] focus:bg-white/[0.08] focus:ring-2 focus:ring-[#E71117]";
  const arrow =
    "grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-full bg-white/[0.04] text-white transition-all hover:bg-[#E71117] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] disabled:cursor-default disabled:opacity-20 disabled:hover:bg-white/[0.04]";

  return (
    <main className="bc min-h-screen w-full bg-black font-[family-name:var(--font-poppins),Poppins,system-ui,sans-serif] tracking-[-0.03em] text-white antialiased selection:bg-[#E71117] selection:text-white">
      <style>{CSS}</style>

      {/* Hero Section Header */}
      <header className="mx-auto w-full max-w-[1600px] px-6 pt-16 pb-10 sm:px-12">
        <div className="max-w-3xl">
          <h1 className="m-0 text-[40px] leading-[1.08] font-semibold tracking-[-0.04em] sm:text-[56px] lg:text-[64px]">
            Schedule Your <span className="text-[#E71117]">Strategy Session</span>
          </h1>
          <p className="m-0 mt-4 text-[17px] leading-relaxed text-white/60 sm:text-[19px]">
            Pick a time that fits your schedule. We will explore your architecture needs, goals, and map out an execution blueprint.
          </p>
        </div>
      </header>

      {/* Main Full-Width Content Container */}
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-32 sm:px-12">
        <div className="grid animate-[bcRise_0.5s_cubic-bezier(0.16,1,0.3,1)_both] rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent p-6 sm:p-10 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-16 lg:p-14">
          
          {/* Left Info Panel */}
          <aside className="flex flex-col justify-between border-b border-white/[0.08] pb-10 lg:border-b-0 lg:border-r lg:border-white/[0.08] lg:pr-12 lg:pb-0">
            <div>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-[13px] font-semibold tracking-wider text-[#E71117] uppercase">Consultation</span>
              </div>

              <h2 className="m-0 text-[26px] leading-[1.2] font-medium tracking-[-0.03em] text-white/90">{BOOKING.title}</h2>
              <p className="m-0 mt-3 text-[15px] leading-relaxed text-white/50">
                A dedicated 1-on-1 meeting to analyze your tech stack requirements and discuss project delivery milestones.
              </p>

              <ul className="m-0 mt-8 flex list-none flex-col gap-5 p-0 text-[15px] text-white/80">
                <li className="flex items-center gap-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-[#E71117]">
                    <Icon d={ICON.clock} className="h-[18px] w-[18px]" />
                  </span>
                  {BOOKING.lengthMin} minute session
                </li>

                {step === "pick" ? (
                  <li className="relative flex items-center gap-3.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-[#E71117]">
                      <Icon d={ICON.globe} className="h-[18px] w-[18px]" />
                    </span>
                    <label className="relative min-w-0 flex-1">
                      <span className="sr-only">Time zone</span>
                      <select
                        value={tz}
                        onChange={(e) => changeZone(e.target.value)}
                        className="w-full cursor-pointer appearance-none truncate rounded-xl bg-white/[0.04] py-3 pr-9 pl-3.5 text-[14px] text-white [color-scheme:dark] outline-none transition-colors hover:bg-white/[0.07] focus:ring-2 focus:ring-[#E71117]"
                      >
                        {zones.map((z) => (
                          <option key={z} value={z} className="bg-[#111] text-white">
                            {tzLabel(z)} {z.includes("/") ? `· ${z.split("/")[0]}` : ""}
                          </option>
                        ))}
                      </select>
                      <Icon d={ICON.down} className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-white/40" />
                    </label>
                  </li>
                ) : (
                  slot != null && (
                    <>
                      <li className="flex items-start gap-3.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-[#E71117]">
                          <Icon d={ICON.cal} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="leading-snug">
                          {fmtDate(slot, tz)}
                          <br />
                          <span className="font-medium text-white">
                            {fmtTime(slot, tz)} – {fmtTime(slot + BOOKING.lengthMin * 60_000, tz)}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start gap-3.5">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-[#E71117]">
                          <Icon d={ICON.globe} className="h-[18px] w-[18px]" />
                        </span>
                        <span className="text-[14px] leading-snug text-white/50">{tzLabel(tz, slot)}</span>
                      </li>
                    </>
                  )
                )}
              </ul>
            </div>

            {step === "details" && (
              <button
                type="button"
                onClick={backToPick}
                className="mt-8 flex cursor-pointer items-center gap-2 text-[14px] text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E71117]"
              >
                <Icon d={ICON.left} className="h-4 w-4" />
                Choose another time slot
              </button>
            )}
          </aside>

          {/* Right Interactive Area */}
          <section className="min-w-0 pt-6 lg:pt-0" aria-live="polite">
            {message && step === "pick" && (
              <p role="alert" className="mb-6 rounded-2xl bg-[#E71117]/10 px-5 py-4 text-[14px] text-[#ff9095]">
                {message}
              </p>
            )}

            {/* Step 1: Calendar and Time Slot Picker */}
            {step === "pick" && (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                {/* Calendar Grid Container */}
                <div className="min-w-0">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h3 className="m-0 min-h-[32px] text-[20px] font-medium tracking-[-0.04em] sm:text-[22px]">
                      {ready ? MONTH.format(Date.UTC(month.y, month.m, 1)) : " "}
                    </h3>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => goTo(cur - 1)} disabled={!canPrev} aria-label="Previous month" className={arrow}>
                        <Icon d={ICON.left} className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => goTo(cur + 1)} disabled={!canNext} aria-label="Next month" className={arrow}>
                        <Icon d={ICON.right} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Month Selector Strip */}
                  <div ref={strip} role="group" aria-label="Choose a month" className="bc-noscroll relative -mx-1 mb-6 flex min-h-[44px] gap-2 overflow-x-auto px-1 py-1">
                    {months.map((idx) => {
                      const y = Math.floor(idx / 12), m = ((idx % 12) + 12) % 12;
                      const t = Date.UTC(y, m, 1);
                      const active = idx === cur;
                      const showYear = y !== Math.floor(winMin / 12);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => goTo(idx)}
                          aria-current={active ? "true" : undefined}
                          className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-[13px] whitespace-nowrap transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] ${
                            active
                              ? "bg-[#E71117] font-medium text-white shadow-[0_4px_20px_rgba(231,17,23,0.4)]"
                              : "bg-white/[0.04] text-white/60 hover:bg-white/[0.08] hover:text-white"
                          }`}
                        >
                          {MONTH_SHORT.format(t)}
                          {showYear ? <span className={active ? "text-white/80" : "text-white/35"}> {String(y).slice(2)}</span> : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[12px] font-medium tracking-wider text-white/30 uppercase">
                    {DOW.map((d) => (
                      <span key={d}>{d}</span>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="min-h-[320px] sm:min-h-[380px]">
                    {ready && (
                      <div key={cur} className="grid animate-[bcFade_0.3s_ease-out_both] grid-cols-7 gap-2">
                        {cells.map((c) => {
                          if (!c.inMonth) return <span key={c.key} aria-hidden="true" />;
                          const past = c.key < todayKey;
                          const free = byDay.has(c.key);
                          const selected = !past && c.key === day;
                          const isToday = c.key === todayKey;
                          return (
                            <button
                              key={c.key}
                              type="button"
                              disabled={past}
                              onClick={() => pickDay(c.key)}
                              aria-pressed={selected}
                              aria-label={`${c.key}${past ? ", already passed" : free ? `, ${byDay.get(c.key)?.length} times open` : ", no times left"}`}
                              className={`relative grid aspect-square w-full place-items-center rounded-2xl text-[14px] transition-all duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] sm:text-[15px] ${
                                selected
                                  ? "cursor-pointer bg-[#E71117] font-medium text-white shadow-[0_8px_25px_-6px_rgba(231,17,23,0.7)]"
                                  : past
                                  ? "cursor-default text-white/20"
                                  : free
                                  ? "cursor-pointer bg-white/[0.06] font-medium text-white hover:-translate-y-0.5 hover:bg-[#E71117]/30"
                                  : "cursor-pointer bg-white/[0.02] text-white/40 hover:bg-white/[0.05]"
                              }`}
                            >
                              {c.n}
                              {isToday && <span aria-hidden="true" className={`absolute bottom-2 h-1.5 w-1.5 rounded-full ${selected ? "bg-white" : "bg-[#E71117]"}`} />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Times Column */}
                <div ref={timesRef} className="min-w-0 pt-6 lg:pt-0">
                  <p className="m-0 mb-1 text-[16px] font-medium">{dayTitle || "Pick a day"}</p>
                  <p className="m-0 mb-4 text-[13px] text-white/40">{times.length ? "Select a time slot" : day ? "" : "Choose a date first"}</p>
                  
                  <ul className="bc-scroll m-0 grid max-h-[300px] list-none grid-cols-3 gap-2 overflow-y-auto p-0 pr-1 lg:max-h-[440px] lg:grid-cols-1 lg:gap-2.5" aria-label="Open times">
                    {times.map((t) => (
                      <li key={t} className="m-0 p-0">
                        <button
                          type="button"
                          onClick={() => {
                            setSlot(t);
                            setStep("details");
                            setStatus("idle");
                            setMessage("");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="w-full cursor-pointer rounded-xl bg-white/[0.05] py-3 text-center text-[14px] whitespace-nowrap text-white transition-all hover:bg-[#E71117] hover:shadow-[0_4px_20px_rgba(231,17,23,0.4)] focus-visible:bg-[#E71117] focus-visible:outline-none sm:text-[15px]"
                        >
                          {fmtTime(t, tz)}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {day && ready && times.length === 0 && (
                    <p className="m-0 rounded-2xl bg-white/[0.03] px-5 py-4 text-[14px] leading-relaxed text-white/50">
                      {day < todayKey ? "This date has already passed." : "No available times left on this date. Please pick another day."}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: User Contact Details Form */}
            {step === "details" && slot != null && (
              <form onSubmit={submit} noValidate aria-label="Your details" className="mx-auto max-w-[560px] lg:mx-0">
                <h3 className="m-0 mb-6 text-[22px] font-medium tracking-[-0.04em]">Your details</h3>
                <div className="grid gap-5">
                  <label className="grid gap-2 text-[14px] text-white/70">
                    Full name*
                    <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="John Doe" className={field} autoFocus />
                  </label>
                  <label className="grid gap-2 text-[14px] text-white/70">
                    Email address*
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="john@example.com" className={field} />
                  </label>
                  <label className="grid gap-2 text-[14px] text-white/70">
                    <span>
                      Project overview or notes <span className="text-white/30">(optional)</span>
                    </span>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Briefly describe what you'd like to discuss..." className={`${field} resize-none`} />
                  </label>
                </div>

                {message && step === "details" && (
                  <p role="alert" className="mt-5 mb-0 rounded-2xl bg-[#E71117]/10 px-5 py-4 text-[14px] text-[#ff9095]">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="mt-8 flex h-[54px] w-full cursor-pointer items-center justify-center rounded-full bg-[#E71117] text-[16px] font-medium text-white transition-all hover:bg-[#ff1e2d] hover:shadow-[0_8px_30px_rgba(231,17,23,0.6)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white disabled:cursor-wait disabled:opacity-75"
                >
                  {status === "sending" ? "Confirming booking..." : "Confirm booking"}
                </button>
              </form>
            )}

            {/* Step 3: Success Confirmation State */}
            {step === "done" && slot != null && (
              <div className="mx-auto flex min-h-[400px] max-w-[460px] flex-col items-center justify-center py-6 text-center" role="status">
                <span className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-[#E71117] text-white shadow-[0_12px_35px_rgba(231,17,23,0.8)]">
                  <Icon d={ICON.check} className="h-8 w-8" />
                </span>
                <h3 className="m-0 text-[30px] font-semibold tracking-[-0.04em]">You’re booked!</h3>
                <p className="mt-4 mb-0 text-[16px] leading-relaxed text-white/90">
                  {fmtDate(slot, tz)}
                  <br />
                  <span className="font-semibold text-white">
                    {fmtTime(slot, tz)} – {fmtTime(slot + BOOKING.lengthMin * 60_000, tz)}
                  </span>
                </p>
                <p className="mt-1.5 mb-0 text-[13px] text-white/45">{tzLabel(tz, slot)}</p>
                <p className="mt-6 mb-0 text-[14px] leading-relaxed text-white/60">We have confirmed your booking and emailed the meeting details to <span className="text-white">{email}</span>.</p>
                <Link
                  href="/"
                  className="mt-8 grid h-12 place-items-center rounded-full bg-white/[0.06] px-9 text-[15px] font-medium text-white transition-all hover:bg-[#E71117] hover:shadow-[0_6px_25px_rgba(231,17,23,0.5)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#E71117]"
                >
                  Back to home
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}