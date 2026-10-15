/*
  Booking rules + time-zone helpers.
  This file is used by BOTH the pop-up (browser) and the API route (server), so the server
  can check that the time a visitor picked is really one of your open times.

  EDIT THE RULES HERE:
*/
export const BOOKING = {
  /** your time zone: the hours below are in THIS zone (visitors see their own zone) */
  timezone: "Asia/Karachi",
  /** days you take calls: 0 = Sunday ... 6 = Saturday */
  days: [0, 1, 2, 3, 4, 5, 6], // every day is open now. Weekends off? use [1, 2, 3, 4, 5]
  /** first call can start at this hour and the last call must END before endHour (24h clock) */
  startHour: 11,
  endHour: 19,
  /** length of one call, in minutes */
  lengthMin: 30,
  /** a new call can start every N minutes (15, 30, 60 ...) */
  stepMin: 30,
  /** people can't book less than this many hours from now */
  minNoticeHours: 6,
  /** how far ahead people can book */
  maxDaysAhead: 365, // a full year ahead: visitors can open any month (Oct, Nov, Dec, ...)
  title: "Intro call with MAX design",
};

/* ------------------------------------------------------------------ time zones */

/* building an Intl.DateTimeFormat is slow: make each one once and reuse it (the pop-up asks for thousands of them) */
const fmtCache = new Map<string, Intl.DateTimeFormat>();
function cachedFmt(key: string, make: () => Intl.DateTimeFormat): Intl.DateTimeFormat {
  let f = fmtCache.get(key);
  if (!f) {
    f = make();
    fmtCache.set(key, f);
  }
  return f;
}

/** minutes to add to UTC to get the wall-clock time in `tz` at instant `ms` (e.g. Karachi = 300) */
export function tzOffsetMinutes(ms: number, tz: string): number {
  const dtf = cachedFmt(`off|${tz}`, () =>
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  );
  const p = dtf.formatToParts(new Date(ms));
  const n = (t: string) => Number(p.find((x) => x.type === t)?.value);
  const asUtc = Date.UTC(n("year"), n("month") - 1, n("day"), n("hour") % 24, n("minute"), n("second"));
  return Math.round((asUtc - Math.floor(ms / 1000) * 1000) / 60000);
}

/** the instant (ms since 1970, UTC) when the wall clock in `tz` shows y-m-d hh:mm */
export function zonedToUtc(y: number, m: number, d: number, hh: number, mm: number, tz: string): number {
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const off1 = tzOffsetMinutes(guess, tz);
  let utc = guess - off1 * 60000;
  const off2 = tzOffsetMinutes(utc, tz);
  if (off2 !== off1) utc = guess - off2 * 60000;
  return utc;
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------------ slots */

/** every open call start time (as UTC ms), from now until maxDaysAhead */
export function generateSlots(nowMs: number = Date.now()): number[] {
  const tz = BOOKING.timezone;
  const first = nowMs + BOOKING.minNoticeHours * 3600_000;
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(nowMs));
  const num = (t: string) => Number(p.find((x) => x.type === t)?.value);
  const y = num("year"), m = num("month"), d = num("day");

  const out: number[] = [];
  for (let i = 0; i <= BOOKING.maxDaysAhead; i++) {
    const day = new Date(Date.UTC(y, m - 1, d + i));
    if (!BOOKING.days.includes(day.getUTCDay())) continue;
    for (let t = BOOKING.startHour * 60; t + BOOKING.lengthMin <= BOOKING.endHour * 60; t += BOOKING.stepMin) {
      const ms = zonedToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), Math.floor(t / 60), t % 60, tz);
      if (ms >= first) out.push(ms);
    }
  }
  return out;
}

/* ------------------------------------------------------------------ formatting */

/** "2026-08-04" : the calendar date of instant `ms` as seen in `tz` */
export function dateKey(ms: number, tz: string): string {
  const p = cachedFmt(`day|${tz}`, () => new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" })).formatToParts(new Date(ms));
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? "";
  return `${g("year")}-${g("month")}-${g("day")}`;
}

/** "11:30 AM" */
export function fmtTime(ms: number, tz: string): string {
  return cachedFmt(`time|${tz}`, () => new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" })).format(new Date(ms));
}

/** "Tuesday, August 4, 2026" */
export function fmtDate(ms: number, tz: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(new Date(ms));
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** "(+05:00) Karachi" */
export function tzLabel(tz: string, atMs: number = Date.now()): string {
  const off = tzOffsetMinutes(atMs, tz);
  const sign = off < 0 ? "-" : "+";
  const a = Math.abs(off);
  const hh = String(Math.floor(a / 60)).padStart(2, "0");
  const mm = String(a % 60).padStart(2, "0");
  const city = (tz.split("/").pop() ?? tz).replace(/_/g, " ");
  return `(${sign}${hh}:${mm}) ${city}`;
}

const FALLBACK_ZONES = [
  "Pacific/Honolulu", "America/Anchorage", "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
  "America/Toronto", "America/Sao_Paulo", "Atlantic/Reykjavik", "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Istanbul",
  "Africa/Cairo", "Africa/Lagos", "Africa/Johannesburg", "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok",
  "Asia/Singapore", "Asia/Hong_Kong", "Asia/Tokyo", "Australia/Sydney", "Pacific/Auckland",
];

/** every time zone the browser knows, sorted west to east */
export function listTimeZones(extra?: string): string[] {
  const all: string[] =
    typeof (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf === "function"
      ? (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf("timeZone")
      : FALLBACK_ZONES;
  const set = new Set(all);
  if (extra) set.add(extra);
  set.add(BOOKING.timezone);
  const now = Date.now();
  return Array.from(set).sort((a, b) => tzOffsetMinutes(now, a) - tzOffsetMinutes(now, b) || a.localeCompare(b));
}