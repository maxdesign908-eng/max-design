/*
  Saves the booked calls (server only).
  Bookings go into data/bookings.json (change the place with BOOKINGS_FILE in .env.local).
  Works on your own computer and on a normal server / VPS.
  On Vercel and similar hosts the disk is temporary: use a database there (ask me and I will switch it).
*/
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { BOOKING } from "./booking";

export type Booking = {
  start: number; // UTC ms when the call starts
  tz: string; // visitor's time zone
  name: string;
  email: string;
  notes: string;
  createdAt: number;
};

const primary = process.env.BOOKINGS_FILE || path.join(process.cwd(), "data", "bookings.json");
const fallback = path.join(os.tmpdir(), "max-design-bookings.json");
const LEN = BOOKING.lengthMin * 60_000;

// one write at a time, so two people can never take the same time
let queue: Promise<unknown> = Promise.resolve();
function locked<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

async function readAll(): Promise<Booking[]> {
  for (const file of [primary, fallback]) {
    try {
      const list = JSON.parse(await fs.readFile(file, "utf8"));
      if (Array.isArray(list)) return list as Booking[];
    } catch {
      /* file missing or unreadable: try the next one */
    }
  }
  return [];
}

async function writeAll(list: Booking[]) {
  const json = JSON.stringify(list, null, 2);
  try {
    await fs.mkdir(path.dirname(primary), { recursive: true });
    await fs.writeFile(primary, json);
  } catch {
    await fs.writeFile(fallback, json); // read-only disk: keep it in the temp folder
  }
}

/** start times already booked between `from` and `to` (only numbers, no personal data) */
export async function takenBetween(from: number, to: number): Promise<number[]> {
  return (await readAll()).map((b) => b.start).filter((s) => s >= from && s <= to);
}

/** "taken" if that time (or one that overlaps it) is already booked */
export function addBooking(b: Booking): Promise<"ok" | "taken"> {
  return locked(async () => {
    const list = await readAll();
    if (list.some((x) => Math.abs(x.start - b.start) < LEN)) return "taken";
    list.push(b);
    await writeAll(list);
    return "ok";
  });
}

/** undo a booking (used when the notification email could not be sent) */
export function removeBooking(start: number): Promise<void> {
  return locked(async () => {
    await writeAll((await readAll()).filter((x) => x.start !== start));
  });
}
