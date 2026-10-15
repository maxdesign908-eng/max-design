"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
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
  "Book A Call" page. Same theme as your Hero / About / Contact blocks:
  black, the red-glass background from the Contact block, Poppins, tracking -4%, red #E71117,
  the spinning chrome shape and the heading row with a divider line.

  IMPORTANT: your Tailwind spacing scale is 1 unit = 1px, so classes like p-6, gap-2 or h-10 give
  tiny sizes. That is why the old version looked squashed. This page therefore uses its own
  CSS (the CSS string below) with real px / --u sizes and no spacing classes.

  SIZES (same system as the other blocks)
  - Desktop: the Figma layout, scaled. --u = 1 Figma px (1920 wide), capped at 1920.
  - <= 1239px: the times list goes under the calendar.   <= 999px: the info panel goes on top.
  - <= 899px (phone / tablet): one column, fluid sizes. Nothing is absolutely positioned there.

  Open days / hours / call length / how far ahead people can book: lib/booking.ts
*/

type Props = {
  defaultName?: string;
  defaultEmail?: string;
  endpoint?: string;
};

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

/* ───────── animation helpers (same as your About / service pages) ───────── */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

function Words({
  text,
  mode = "mask",
  delay = 0,
  step = 70,
}: {
  text: string;
  mode?: "mask" | "fade";
  delay?: number;
  step?: number;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.2);
  const words = text.split(" ");
  return (
    <span ref={ref} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          {mode === "mask" ? (
            <span
              aria-hidden="true"
              className="-mt-[0.14em] -mr-[0.2em] -mb-[0.16em] -ml-[0.1em] inline-block overflow-hidden pt-[0.14em] pr-[0.2em] pb-[0.16em] pl-[0.1em] align-top"
            >
              <span
                style={{ transitionDelay: inView ? `${delay + i * step}ms` : "0ms" }}
                className={`inline-block origin-bottom-left transition-[translate,rotate] duration-[1300ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  inView ? "translate-y-0 rotate-0" : "translate-y-[125%] rotate-[5deg]"
                }`}
              >
                {w}
              </span>
            </span>
          ) : (
            <span
              aria-hidden="true"
              style={{ transitionDelay: inView ? `${delay + i * step}ms` : "0ms" }}
              className={`inline-block transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                inView ? "translate-y-0 opacity-100" : "translate-y-[0.6em] opacity-0"
              }`}
            >
              {w}
            </span>
          )}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/* ───────── all sizes and looks of this page ───────── */
const CSS = `
  .bk {
    --u: calc(min(100cqw, 1920px) / 1920);
    --bu: var(--u);
    --pad: calc(97 * var(--u));
    --cell: max(44px, calc(72 * var(--u)));
    --red: #E71117;
    --red2: #ff1e2d;
    position: relative; isolation: isolate; overflow: hidden; width: 100%;
    background: #000; color: #fff; letter-spacing: -0.04em;
    padding-bottom: max(72px, calc(120 * var(--u)));
  }
  @media (max-width: 899px) {
    .bk { --bu: calc(var(--u) * 2.4); --pad: clamp(16px, 5cqw, 48px); }
  }
  .bk button, .bk input, .bk textarea, .bk select { font-family: inherit; letter-spacing: inherit; }
  .bk button:focus-visible, .bk a:focus-visible, .bk select:focus-visible {
    outline: 2px solid var(--red); outline-offset: 3px;
  }

  /* red glass background: exactly the one from your Contact block */
  .bk-bgwrap { position: absolute; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
  .bk-glass {
    position: absolute; top: calc(-718.17 * var(--bu)); left: calc(-998 * var(--bu));
    width: calc(3817 * var(--bu)); height: calc(2147 * var(--bu));
    transform: rotate(180deg); filter: blur(calc(12 * var(--bu)));
  }

  .bk-in { position: relative; width: 100%; max-width: 1920px; margin: 0 auto; padding: 0 var(--pad); }

  /* heading row (same as the service pages) */
  .bk-head { margin-top: max(36px, calc(110 * var(--u))); }
  .bk-headrow {
    position: relative; display: flex; align-items: flex-start;
    min-height: calc(121 * var(--u)); border-bottom: 1px solid rgba(255,255,255,.26);
  }
  .bk-h1 {
    margin: 0; width: calc(1136 * var(--u)); font-weight: 500;
    font-size: max(40px, calc(80 * var(--u))); line-height: .96; letter-spacing: -0.08em;
  }
  .bk-chrome {
    position: absolute; top: calc(-14 * var(--u)); left: calc(1620.5 * var(--u));
    width: calc(106.6 * var(--u)); height: calc(106.2 * var(--u));
    animation: bkSpin 12s linear infinite; will-change: transform;
  }
  .bk-lead {
    margin: max(16px, calc(28 * var(--u))) 0 0; max-width: calc(1000 * var(--u)); min-width: min(100%, 560px);
    font-size: max(16px, calc(24 * var(--u))); line-height: 1.6; color: rgba(255,255,255,.62);
  }
  @media (max-width: 899px) {
    .bk-head { margin-top: 32px; }
    .bk-headrow { min-height: 0; align-items: center; justify-content: space-between; gap: 16px; padding-bottom: 22px; }
    .bk-h1 { width: auto; font-size: clamp(34px, 9.5cqw, 60px); line-height: 1.08; }
    .bk-chrome { position: static; flex: none; width: clamp(52px, 12cqw, 96px); height: clamp(52px, 12cqw, 96px); }
    .bk-lead { max-width: none; min-width: 0; font-size: 16px; }
  }

  /* progress */
  .bk-steps {
    display: flex; align-items: center; gap: 14px; list-style: none; margin: max(26px, calc(48 * var(--u))) 0 max(18px, calc(28 * var(--u))); padding: 0;
    animation: bkFade .7s cubic-bezier(.16,1,.3,1) both .1s;
  }
  .bk-step { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,.4); font-size: max(13px, calc(16 * var(--u))); white-space: nowrap; transition: color .4s; }
  .bk-step[data-s="active"], .bk-step[data-s="done"] { color: #fff; }
  .bk-dot {
    flex: none; display: grid; place-items: center; width: max(30px, calc(36 * var(--u))); height: max(30px, calc(36 * var(--u)));
    border-radius: 50%; border: 1px solid rgba(255,255,255,.25); font-size: 13px; font-weight: 500; transition: all .4s;
  }
  .bk-dot svg { width: 14px; height: 14px; }
  .bk-step[data-s="active"] .bk-dot { background: var(--red); border-color: var(--red); box-shadow: 0 0 0 6px rgba(231,17,23,.2); }
  .bk-step[data-s="done"] .bk-dot { background: rgba(231,17,23,.2); border-color: var(--red); }
  .bk-line { position: relative; flex: 0 1 calc(120 * var(--u)); min-width: 24px; height: 1px; background: rgba(255,255,255,.18); overflow: hidden; }
  .bk-line::after { content: ""; position: absolute; inset: 0; background: var(--red); transform: scaleX(0); transform-origin: left; transition: transform .7s cubic-bezier(.16,1,.3,1); }
  .bk-line[data-on="true"]::after { transform: scaleX(1); }
  @media (max-width: 599px) {
    .bk-steps { gap: 10px; }
    .bk-step[data-s="idle"] .bk-lbl2, .bk-step[data-s="done"] .bk-lbl2 { display: none; }
    .bk-line { flex: 1 1 0; }
  }

  /* the card */
  .bk-card {
    position: relative; display: grid; grid-template-columns: clamp(300px, calc(420 * var(--u)), 420px) minmax(0, 1fr);
    border-radius: 20px; background: rgba(8,8,8,.82); -webkit-backdrop-filter: blur(22px); backdrop-filter: blur(22px);
    box-shadow: inset 0 -6px 10px -6px rgba(255,255,255,.08), 0 40px 100px -40px rgba(231,17,23,.35);
    animation: bkRise .8s cubic-bezier(.16,1,.3,1) both .2s; scroll-margin-top: 16px;
  }
  .bk-card::before {
    content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
    border: 1px solid rgba(255,255,255,.16); border-top-color: rgba(255,255,255,.3);
  }
  @media (max-width: 999px) { .bk-card { grid-template-columns: minmax(0, 1fr); } }
  @media (max-width: 899px) { .bk-card { border-radius: 16px; } }

  /* left info panel */
  .bk-aside {
    display: flex; flex-direction: column; gap: max(18px, calc(28 * var(--u)));
    padding: max(24px, calc(56 * var(--u))) max(22px, calc(48 * var(--u)));
    border-right: 1px solid rgba(255,255,255,.1); min-width: 0;
  }
  @media (max-width: 999px) { .bk-aside { border-right: 0; border-bottom: 1px solid rgba(255,255,255,.1); } }
  @media (max-width: 899px) { .bk-aside { padding: 22px 18px; gap: 16px; } }
  .bk-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--red); }
  .bk-eyebrow::before { content: ""; width: 8px; height: 8px; border-radius: 50%; background: var(--red); animation: bkPulse 1.8s ease-out infinite; }
  .bk-title { margin: 0; font-weight: 500; line-height: 1.12; font-size: max(26px, calc(40 * var(--u))); }
  .bk-desc { margin: 0; line-height: 1.65; font-size: max(14px, calc(17 * var(--u))); color: rgba(255,255,255,.55); }
  .bk-facts { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
  .bk-fact { display: flex; align-items: center; gap: 14px; min-width: 0; font-size: max(14px, calc(17 * var(--u))); color: rgba(255,255,255,.88); line-height: 1.4; }
  .bk-fact[data-top="true"] { align-items: flex-start; }
  .bk-ico { flex: none; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,.06); color: var(--red); }
  .bk-ico svg { width: 18px; height: 18px; }
  .bk-sub { display: block; margin-top: 2px; font-size: 13px; color: rgba(255,255,255,.5); }
  .bk-sel { position: relative; flex: 1 1 0; min-width: 0; }
  .bk-sel select {
    width: 100%; height: 40px; appearance: none; -webkit-appearance: none; border-radius: 12px; cursor: pointer;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); color: #fff; font-size: 14px;
    padding: 0 38px 0 14px; color-scheme: dark; text-overflow: ellipsis; transition: border-color .3s, background .3s;
  }
  .bk-sel select:hover { border-color: rgba(255,255,255,.28); background: rgba(255,255,255,.09); }
  .bk-sel svg { position: absolute; top: 50%; right: 13px; width: 16px; height: 16px; margin-top: -8px; color: rgba(255,255,255,.5); pointer-events: none; }
  .bk-cover { margin-top: auto; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.1); }
  .bk-cover h4 { margin: 0 0 14px; font-size: 13px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.45); }
  .bk-cover ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
  .bk-cover li { display: flex; gap: 12px; align-items: flex-start; font-size: max(14px, calc(16 * var(--u))); line-height: 1.45; color: rgba(255,255,255,.75); }
  .bk-cover svg { flex: none; width: 18px; height: 18px; margin-top: 1px; color: var(--red); }
  @media (max-width: 899px) { .bk-desc, .bk-cover { display: none; } }
  .bk-back { align-self: flex-start; display: inline-flex; align-items: center; gap: 8px; background: none; border: 0; padding: 4px 0; font-size: 14px; color: rgba(255,255,255,.55); cursor: pointer; transition: color .3s; }
  .bk-back:hover { color: var(--red); }
  .bk-back svg { width: 16px; height: 16px; }

  /* right area */
  .bk-main { min-width: 0; padding: max(20px, calc(56 * var(--u))); }
  @media (max-width: 899px) { .bk-main { padding: 22px 16px 26px; } }
  .bk-panel { animation: bkFade .5s cubic-bezier(.16,1,.3,1) both; }
  .bk-alert { margin: 0 0 22px; padding: 14px 16px; border-radius: 12px; background: rgba(231,17,23,.1); border: 1px solid rgba(231,17,23,.35); color: #ff9095; font-size: 14px; line-height: 1.5; }

  .bk-pick { display: grid; grid-template-columns: minmax(0, 1fr) clamp(210px, calc(300 * var(--u)), 300px); gap: max(20px, calc(32 * var(--u))); }
  @media (max-width: 1239px) { .bk-pick { grid-template-columns: minmax(0, 1fr); gap: 28px; } }

  .bk-mh { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
  .bk-month { margin: 0; font-weight: 500; font-size: max(20px, calc(30 * var(--u))); }
  .bk-arrows { display: flex; gap: 8px; }
  .bk-arrow {
    display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; cursor: pointer;
    border: 1px solid rgba(255,255,255,.18); background: transparent; color: #fff; transition: all .25s;
  }
  .bk-arrow svg { width: 16px; height: 16px; }
  .bk-arrow:hover:not(:disabled) { background: var(--red); border-color: var(--red); box-shadow: 0 8px 24px -8px rgba(231,17,23,.8); }
  .bk-arrow:disabled { opacity: .25; cursor: default; }

  .bk-months { display: flex; gap: 8px; overflow-x: auto; margin: 0 0 18px; padding: 2px 2px 6px; scrollbar-width: none; }
  .bk-months::-webkit-scrollbar { display: none; }
  .bk-chip {
    flex: none; height: 36px; padding: 0 16px; border-radius: 999px; cursor: pointer; white-space: nowrap; font-size: 13px;
    border: 1px solid rgba(255,255,255,.14); background: transparent; color: rgba(255,255,255,.65); transition: all .25s;
  }
  .bk-chip:hover { color: #fff; border-color: rgba(255,255,255,.4); }
  .bk-chip[aria-current="true"] { background: var(--red); border-color: var(--red); color: #fff; box-shadow: 0 6px 22px -6px rgba(231,17,23,.7); }
  .bk-chip small { font-size: inherit; opacity: .55; }

  .bk-dow, .bk-days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 8px; }
  @media (max-width: 599px) { .bk-dow, .bk-days { gap: 5px; } }
  .bk-dow { margin-bottom: 8px; text-align: center; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: rgba(255,255,255,.4); }
  .bk-days { align-content: start; min-height: calc(var(--cell) * 6 + 40px); animation: bkFade .4s cubic-bezier(.16,1,.3,1) both; }
  @media (max-width: 899px) { .bk-days { min-height: 0; } }
  .bk-day {
    position: relative; height: var(--cell); border-radius: 14px; border: 1px solid transparent; cursor: pointer;
    background: rgba(255,255,255,.06); color: #fff; font-size: max(14px, calc(18 * var(--u))); font-weight: 500;
    transition: transform .2s, background .25s, border-color .25s, box-shadow .25s;
  }
  .bk-day[data-s="past"] { background: transparent; color: rgba(255,255,255,.2); cursor: default; }
  .bk-day[data-s="none"] { background: rgba(255,255,255,.02); color: rgba(255,255,255,.35); }
  .bk-day[data-s="none"]:hover { background: rgba(255,255,255,.05); }
  .bk-day[data-s="free"]:hover { transform: translateY(-2px); background: rgba(231,17,23,.22); border-color: rgba(231,17,23,.6); }
  .bk-day[data-sel="true"] { background: var(--red); border-color: var(--red); box-shadow: 0 12px 30px -10px rgba(231,17,23,.85); transform: none; }
  .bk-day[data-today="true"]::after { content: ""; position: absolute; bottom: 8px; left: 50%; width: 5px; height: 5px; margin-left: -2.5px; border-radius: 50%; background: var(--red); }
  .bk-day[data-sel="true"][data-today="true"]::after { background: #fff; }
  .bk-legend { display: flex; flex-wrap: wrap; gap: 8px 20px; margin: 16px 0 0; padding: 0; list-style: none; font-size: 12px; color: rgba(255,255,255,.45); }
  .bk-legend li { display: flex; align-items: center; gap: 8px; }
  .bk-legend i { width: 10px; height: 10px; border-radius: 3px; background: rgba(255,255,255,.14); }
  .bk-legend i.r { background: var(--red); }

  .bk-times { min-width: 0; padding-left: max(20px, calc(32 * var(--u))); border-left: 1px solid rgba(255,255,255,.1); }
  @media (max-width: 1239px) { .bk-times { padding: 24px 0 0; border-left: 0; border-top: 1px solid rgba(255,255,255,.1); } }
  .bk-th { margin: 0 0 4px; font-weight: 500; font-size: max(18px, calc(24 * var(--u))); }
  .bk-ts { margin: 0 0 16px; font-size: 13px; color: rgba(255,255,255,.45); }
  .bk-tlist {
    list-style: none; margin: 0; padding: 0 6px 0 0; display: grid; gap: 10px; align-content: start;
    max-height: calc(var(--cell) * 6 + 20px); overflow-y: auto; scrollbar-width: thin; scrollbar-color: var(--red) transparent;
  }
  .bk-tlist::-webkit-scrollbar { width: 5px; }
  .bk-tlist::-webkit-scrollbar-thumb { background: var(--red); border-radius: 5px; }
  @media (max-width: 1239px) { .bk-tlist { grid-template-columns: repeat(4, minmax(0, 1fr)); max-height: none; padding: 0; } }
  @media (max-width: 599px) { .bk-tlist { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; } }
  @media (max-width: 359px) { .bk-tlist { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  .bk-time {
    width: 100%; height: max(46px, calc(52 * var(--u))); border-radius: 12px; cursor: pointer; white-space: nowrap; font-size: 15px; color: #fff;
    border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04);
    transition: transform .2s, background .25s, border-color .25s, box-shadow .25s;
    animation: bkFade .45s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--i) * 28ms);
  }
  .bk-time:hover, .bk-time:focus-visible { background: var(--red); border-color: var(--red); box-shadow: 0 10px 26px -10px rgba(231,17,23,.85); transform: translateX(3px); }
  @media (max-width: 1239px) { .bk-time:hover, .bk-time:focus-visible { transform: translateY(-2px); } }
  .bk-empty { margin: 0; padding: 16px 18px; border-radius: 12px; border: 1px dashed rgba(255,255,255,.18); color: rgba(255,255,255,.5); font-size: 14px; line-height: 1.55; }

  /* details form (same look as the Contact form: label on top, underline field) */
  .bk-form { max-width: 640px; }
  .bk-h3 { margin: 0 0 max(8px, calc(12 * var(--u))); font-weight: 500; font-size: max(24px, calc(36 * var(--u))); line-height: 1.15; }
  .bk-note { margin: 0 0 max(18px, calc(30 * var(--u))); font-size: max(14px, calc(17 * var(--u))); color: rgba(255,255,255,.5); line-height: 1.55; }
  .bk-group { margin-top: max(20px, calc(34 * var(--u))); }
  .bk-lbl { display: block; font-size: max(15px, calc(19 * var(--u))); line-height: 1.5; color: #fff; }
  .bk-opt { color: rgba(255,255,255,.4); }
  .bk-fld { margin-top: 6px; border-bottom: 1px solid #4A4A4A; transition: border-color .3s; }
  .bk-fld:focus-within { border-color: rgba(255,255,255,.75); }
  .bk-input {
    display: block; width: 100%; min-width: 0; background: transparent; border: 0; outline: 0; border-radius: 0; color: #fff;
    height: max(46px, calc(56 * var(--u))); padding: 0; font-size: max(15px, calc(17 * var(--u))); line-height: 1.4;
  }
  textarea.bk-input { height: auto; min-height: 96px; padding: 12px 0; resize: none; }
  .bk-input::placeholder { color: rgba(255,255,255,.4); }
  .bk-input:-webkit-autofill { -webkit-text-fill-color: #fff; caret-color: #fff; transition: background-color 99999s ease-out; }
  .bk-btn {
    display: flex; align-items: center; justify-content: center; width: 100%; margin-top: max(26px, calc(44 * var(--u)));
    height: max(52px, calc(60 * var(--u))); border: 0; border-radius: 999px; cursor: pointer; background: var(--red); color: #fff;
    font-size: max(15px, calc(17 * var(--u))); font-weight: 500; transition: background .3s, box-shadow .3s, transform .2s;
  }
  .bk-btn:hover:not(:disabled) { background: var(--red2); box-shadow: 0 14px 34px -10px rgba(231,17,23,.8); transform: translateY(-1px); }
  .bk-btn:disabled { cursor: wait; opacity: .75; }

  /* done */
  .bk-done { display: grid; place-items: center; min-height: max(340px, calc(520 * var(--u))); text-align: center; }
  .bk-done > div { max-width: 480px; }
  .bk-check {
    position: relative; display: grid; place-items: center; width: 84px; height: 84px; margin: 0 auto 26px; border-radius: 50%; color: #fff;
    background: var(--red); box-shadow: 0 18px 50px -12px rgba(231,17,23,.9); animation: bkPop .8s cubic-bezier(.34,1.56,.64,1) both;
  }
  .bk-check::after { content: ""; position: absolute; inset: 0; border-radius: 50%; animation: bkPulse 2s ease-out .6s infinite; }
  .bk-check svg { width: 38px; height: 38px; }
  .bk-done h3 { margin: 0; font-weight: 500; font-size: max(28px, calc(48 * var(--u))); line-height: 1.1; }
  .bk-done p { margin: 14px 0 0; line-height: 1.6; color: rgba(255,255,255,.7); font-size: max(15px, calc(18 * var(--u))); }
  .bk-done p b { color: #fff; font-weight: 500; }
  .bk-done p.s { font-size: 13px; color: rgba(255,255,255,.45); margin-top: 4px; }
  .bk-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 30px; }
  .bk-link {
    display: inline-flex; align-items: center; justify-content: center; height: 50px; padding: 0 30px; border-radius: 999px; font-size: 15px; font-weight: 500;
    color: #fff; text-decoration: none; cursor: pointer; border: 1px solid rgba(255,255,255,.25); background: transparent; transition: all .3s;
  }
  .bk-link:hover { border-color: var(--red); background: rgba(231,17,23,.15); }
  .bk-link[data-p="true"] { background: var(--red); border-color: var(--red); }
  .bk-link[data-p="true"]:hover { background: var(--red2); box-shadow: 0 12px 30px -10px rgba(231,17,23,.8); }

  @keyframes bkRise  { from { opacity: 0; transform: translateY(44px); } to { opacity: 1; transform: none; } }
  @keyframes bkFade  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
  @keyframes bkPop   { from { opacity: 0; transform: scale(.4); } to { opacity: 1; transform: none; } }
  @keyframes bkPulse { from { box-shadow: 0 0 0 0 rgba(231,17,23,.55); } to { box-shadow: 0 0 0 16px rgba(231,17,23,0); } }
  @keyframes bkSpin  { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .bk *, .bk *::before, .bk *::after { animation: none !important; transition: none !important; }
  }
`;

function Icon({ d, className }: { d: string; className?: string }) {
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

const COVER = ["Your brand, goals and audience", "The services and approach that fit", "Timeline, budget and next steps"];

function buildIcs(start: number, lengthMin: number, title: string, description: string) {
  const f = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MAX design//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${start}@maxdesign`,
    `DTSTAMP:${f(Date.now())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(start + lengthMin * 60_000)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

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
  const cardRef = useRef<HTMLDivElement>(null);
  const timesRef = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  /* first render in the browser: visitor's time zone + all free times */
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

  /* times somebody else already booked */
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

  /* free month navigation: from this month to the last bookable month */
  const ready = month.y > 0;
  const todayKey = useMemo(() => (ready ? dateKey(Date.now(), tz) : ""), [tz, ready]);
  const winMin = todayKey ? monthIndexOf(todayKey) : 0;
  const winMax = base.length ? Math.max(winMin, monthIndexOf(dateKey(base[base.length - 1], tz))) : winMin;
  const cur = month.y * 12 + month.m;
  const canPrev = ready && cur > winMin;
  const canNext = ready && cur < winMax;
  const months = useMemo(
    () => (ready ? Array.from({ length: winMax - winMin + 1 }, (_, i) => winMin + i) : []),
    [ready, winMin, winMax],
  );

  const goTo = (index: number) => {
    if (index < winMin || index > winMax) return;
    const y = Math.floor(index / 12), m = ((index % 12) + 12) % 12;
    setMonth({ y, m });
    const prefix = `${y}-${pad(m + 1)}-`;
    if (day.startsWith(prefix)) return;
    const free = dayKeys.find((k) => k.startsWith(prefix));
    setDay(free ?? (index === winMin ? todayKey : `${prefix}01`));
    setSlot(null);
  };

  // keep the active month chip visible inside the strip (scrolls only the strip, never the page)
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

  function toCard() {
    window.setTimeout(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

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
    if (window.matchMedia("(max-width: 1239px)").matches) {
      window.setTimeout(() => timesRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    }
  }

  function pickTime(t: number) {
    setSlot(t);
    setStep("details");
    setStatus("idle");
    setMessage("");
    toCard();
  }

  function backToPick() {
    setStep("pick");
    setMessage("");
    setStatus("idle");
    toCard();
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
        toCard();
        return;
      }
      if (!res.ok) throw new Error(j.error || "failed");
      setStatus("idle");
      setStep("done");
      toCard();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error && err.message !== "failed" ? err.message : "Something went wrong. Please try again.");
    }
  }

  const stepState = (n: 1 | 2 | 3) => {
    const at = step === "pick" ? 1 : step === "details" ? 2 : 3;
    return n < at || (n === 3 && at === 3) ? "done" : n === at ? "active" : "idle";
  };

  const icsHref =
    slot != null
      ? "data:text/calendar;charset=utf-8," +
        encodeURIComponent(buildIcs(slot, BOOKING.lengthMin, BOOKING.title, "Call booked on the MAX design website."))
      : "#";

  return (
    <main className="@container w-full bg-black text-white">
      <style>{CSS}</style>

      <div className="bk">
        {/* red glass, same as the Contact block */}
        <div className="bk-bgwrap" aria-hidden="true">
          <div className="bk-glass">
            <Image src="/images/bg-glass.webp" alt="" fill unoptimized sizes="100vw" className="object-cover" />
          </div>
        </div>

        <div className="bk-in">
          {/* ───────── heading row ───────── */}
          <header className="bk-head">
            <div className="bk-headrow">
              <h1 className="bk-h1">
                <Words text="Book A Call" delay={150} step={110} />
              </h1>
              <Image src="/images/services/chrome-shape.webp" alt="" width={260} height={259} unoptimized priority className="bk-chrome" />
            </div>
            <p className="bk-lead">
              <Words
                mode="fade"
                step={24}
                delay={300}
                text="Pick a day and a time that suits you. We will talk about your brand, your goals and the best way to work together."
              />
            </p>
          </header>

          {/* ───────── progress ───────── */}
          <ol className="bk-steps" aria-label="Booking progress">
            {(
              [
                [1, "Choose a time"],
                [2, "Your details"],
                [3, "Confirmed"],
              ] as const
            ).map(([n, label], i) => (
              <Fragment key={n}>
                {i > 0 && <li aria-hidden="true" className="bk-line" data-on={stepState(n) !== "idle" ? "true" : "false"} />}
                <li className="bk-step" data-s={stepState(n)} aria-current={stepState(n) === "active" ? "step" : undefined}>
                  <span className="bk-dot">
                    {stepState(n) === "done" ? <Icon d={ICON.check} /> : n}
                  </span>
                  <span className="bk-lbl2">{label}</span>
                </li>
              </Fragment>
            ))}
          </ol>

          {/* ───────── the booking card ───────── */}
          <div ref={cardRef} className="bk-card">
            {/* left: what this call is */}
            <aside className="bk-aside">
              <span className="bk-eyebrow">Intro call</span>
              <h2 className="bk-title">{BOOKING.title}</h2>
              <p className="bk-desc">A relaxed one-on-one call to talk through your brand, your goals and the right way for us to work together.</p>

              <ul className="bk-facts">
                <li className="bk-fact">
                  <span className="bk-ico">
                    <Icon d={ICON.clock} />
                  </span>
                  {BOOKING.lengthMin} minute call
                </li>

                {step === "pick" || slot == null ? (
                  <li className="bk-fact">
                    <span className="bk-ico">
                      <Icon d={ICON.globe} />
                    </span>
                    <label className="bk-sel">
                      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Time zone</span>
                      <select value={tz} onChange={(e) => changeZone(e.target.value)}>
                        {zones.map((z) => (
                          <option key={z} value={z} style={{ background: "#111", color: "#fff" }}>
                            {tzLabel(z)} {z.includes("/") ? `· ${z.split("/")[0]}` : ""}
                          </option>
                        ))}
                      </select>
                      <Icon d={ICON.down} />
                    </label>
                  </li>
                ) : (
                  <>
                    <li className="bk-fact" data-top="true">
                      <span className="bk-ico">
                        <Icon d={ICON.cal} />
                      </span>
                      <span>
                        {fmtDate(slot, tz)}
                        <span className="bk-sub" style={{ color: "#fff", fontSize: "inherit", fontWeight: 500 }}>
                          {fmtTime(slot, tz)} – {fmtTime(slot + BOOKING.lengthMin * 60_000, tz)}
                        </span>
                      </span>
                    </li>
                    <li className="bk-fact" data-top="true">
                      <span className="bk-ico">
                        <Icon d={ICON.globe} />
                      </span>
                      <span className="bk-sub" style={{ marginTop: 0, alignSelf: "center" }}>
                        {tzLabel(tz, slot)}
                      </span>
                    </li>
                  </>
                )}
              </ul>

              {step === "details" && (
                <button type="button" className="bk-back" onClick={backToPick}>
                  <Icon d={ICON.left} />
                  Choose another time
                </button>
              )}

              {step === "pick" && (
                <div className="bk-cover">
                  <h4>What we will cover</h4>
                  <ul>
                    {COVER.map((c) => (
                      <li key={c}>
                        <Icon d={ICON.check} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>

            {/* right: the steps */}
            <section className="bk-main" aria-live="polite">
              {message && step === "pick" && (
                <p role="alert" className="bk-alert">
                  {message}
                </p>
              )}

              {/* step 1 */}
              {step === "pick" && (
                <div key="pick" className="bk-panel bk-pick">
                  <div style={{ minWidth: 0 }}>
                    <div className="bk-mh">
                      <h3 className="bk-month">{ready ? MONTH.format(Date.UTC(month.y, month.m, 1)) : "\u00A0"}</h3>
                      <div className="bk-arrows">
                        <button type="button" className="bk-arrow" onClick={() => goTo(cur - 1)} disabled={!canPrev} aria-label="Previous month">
                          <Icon d={ICON.left} />
                        </button>
                        <button type="button" className="bk-arrow" onClick={() => goTo(cur + 1)} disabled={!canNext} aria-label="Next month">
                          <Icon d={ICON.right} />
                        </button>
                      </div>
                    </div>

                    <div ref={strip} className="bk-months" role="group" aria-label="Choose a month">
                      {months.map((idx) => {
                        const y = Math.floor(idx / 12), m = ((idx % 12) + 12) % 12;
                        const t = Date.UTC(y, m, 1);
                        const showYear = y !== Math.floor(winMin / 12);
                        return (
                          <button key={idx} type="button" className="bk-chip" onClick={() => goTo(idx)} aria-current={idx === cur ? "true" : undefined}>
                            {MONTH_SHORT.format(t)}
                            {showYear ? <small> {String(y).slice(2)}</small> : null}
                          </button>
                        );
                      })}
                    </div>

                    <div className="bk-dow" aria-hidden="true">
                      {DOW.map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>

                    {ready && (
                      <div key={cur} className="bk-days">
                        {cells.map((c) => {
                          if (!c.inMonth) return <span key={c.key} aria-hidden="true" />;
                          const past = c.key < todayKey;
                          const free = byDay.has(c.key);
                          const selected = !past && c.key === day;
                          return (
                            <button
                              key={c.key}
                              type="button"
                              className="bk-day"
                              data-s={past ? "past" : free ? "free" : "none"}
                              data-sel={selected ? "true" : undefined}
                              data-today={c.key === todayKey ? "true" : undefined}
                              disabled={past}
                              onClick={() => pickDay(c.key)}
                              aria-pressed={selected}
                              aria-label={`${c.key}${past ? ", already passed" : free ? `, ${byDay.get(c.key)?.length} times open` : ", no times left"}`}
                            >
                              {c.n}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <ul className="bk-legend" aria-hidden="true">
                      <li>
                        <i className="r" /> Selected day
                      </li>
                      <li>
                        <i /> Open day
                      </li>
                    </ul>
                  </div>

                  <div ref={timesRef} className="bk-times">
                    <h3 className="bk-th">{dayTitle || "Pick a day"}</h3>
                    <p className="bk-ts">
                      {times.length ? `${times.length} open times · ${tzLabel(tz).replace(/^\(([^)]+)\).*$/, "UTC$1")}` : day ? " " : "Choose a date first"}
                    </p>

                    {times.length > 0 && (
                      <ul key={day} className="bk-tlist" aria-label="Open times">
                        {times.map((t, i) => (
                          <li key={t} style={{ margin: 0, padding: 0 }}>
                            <button type="button" className="bk-time" style={{ ["--i" as string]: i } as React.CSSProperties} onClick={() => pickTime(t)}>
                              {fmtTime(t, tz)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {day && ready && times.length === 0 && (
                      <p className="bk-empty">{day < todayKey ? "This date has already passed." : "No times left on this day. Please pick another day."}</p>
                    )}
                  </div>
                </div>
              )}

              {/* step 2 */}
              {step === "details" && slot != null && (
                <form key="details" className="bk-panel bk-form" onSubmit={submit} noValidate aria-label="Your details">
                  <h3 className="bk-h3">Your details</h3>
                  <p className="bk-note">Tell us who is joining and we will send the confirmation to your email.</p>

                  <div className="bk-group" style={{ marginTop: 0 }}>
                    <label className="bk-lbl" htmlFor="bk-name">
                      Full Name*
                    </label>
                    <div className="bk-fld">
                      <input id="bk-name" className="bk-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your Name" autoFocus />
                    </div>
                  </div>

                  <div className="bk-group">
                    <label className="bk-lbl" htmlFor="bk-email">
                      Email*
                    </label>
                    <div className="bk-fld">
                      <input id="bk-email" className="bk-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" placeholder="You@Example.Com" />
                    </div>
                  </div>

                  <div className="bk-group">
                    <label className="bk-lbl" htmlFor="bk-notes">
                      Anything we should know? <span className="bk-opt">(optional)</span>
                    </label>
                    <div className="bk-fld">
                      <textarea id="bk-notes" className="bk-input" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Tell Us More About Your Idea" />
                    </div>
                  </div>

                  {message && (
                    <p role="alert" className="bk-alert" style={{ margin: "22px 0 0" }}>
                      {message}
                    </p>
                  )}

                  <button type="submit" className="bk-btn" disabled={status === "sending"}>
                    {status === "sending" ? "Booking..." : "Confirm Booking"}
                  </button>
                </form>
              )}

              {/* step 3 */}
              {step === "done" && slot != null && (
                <div key="done" className="bk-panel bk-done" role="status">
                  <div>
                    <span className="bk-check">
                      <Icon d={ICON.check} />
                    </span>
                    <h3>You’re booked!</h3>
                    <p>
                      {fmtDate(slot, tz)}
                      <br />
                      <b>
                        {fmtTime(slot, tz)} – {fmtTime(slot + BOOKING.lengthMin * 60_000, tz)}
                      </b>
                    </p>
                    <p className="s">{tzLabel(tz, slot)}</p>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,.55)" }}>
                      We have your booking and will email the details to <b>{email}</b>.
                    </p>
                    <div className="bk-actions">
                      <a className="bk-link" href={icsHref} download="call-with-max-design.ics">
                        Add to calendar
                      </a>
                      <Link className="bk-link" data-p="true" href="/">
                        Back to home
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}