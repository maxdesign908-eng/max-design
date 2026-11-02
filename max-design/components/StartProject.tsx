"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";

/*
  "Start your Project" page (Figma 1920 wide). Everything below the navbar.

  LAYOUT (rebuilt so nothing can overlap): the blocks are stacked one after another in normal flow.
  Nothing is placed with fixed top / left numbers any more, so when the page gets narrower the blocks
  push each other down instead of lying on top of each other. At 1920 it is the same picture as your Figma:
    heading row ....... 151 high, 1px divider at the bottom
    "What are you supposed to do?" 48px ... 43 under the divider      service pills ... 43 under it (30 high, gap 24)
    form grid ......... 119 under the pills, 1344 wide, 2 columns x 3 rows, gaps 62, every field 641 x 96.42
    "Your Budget" ..... 108 under the grid, 48px, 32 gap, then pills (30 high, gap 24)
    details field ..... 35 under the budget, fills the row and stops before the two buttons at the right end

  SIZES
  - 901px and wider: Figma sizes * var(--u) (1 --u = 1 Figma px, capped at 1920). Text never goes below
    12-14px, and the pill rows wrap to a second line instead of colliding when there is not enough room.
  - 561px - 900px: fluid sizes, the form grid keeps 2 columns.
  - 560px and narrower: one column, the two buttons share the full row width.

  BUTTONS: "Send on WhatsApp" and "Send Your Query" are built from the SAME component (CtaPill), so their padding,
  spacing, gaps, label and circle are always identical. Only the colour, the label and the icon differ.
  Send Your Query submits the form (ENDPOINT). Send on WhatsApp checks the required fields (Name, Email), then opens
  https://wa.me/<WHATSAPP_NUMBER>?text=<the form details> in a new tab.
  On EVERY screen size the two buttons sit side by side in one row: WhatsApp on the left, Send Your Query on the right.
  The row is centre-aligned and the "Thank you" message is absolutely positioned under the Send button,
  so the two buttons are always on one line.

  PILLS (services + budget): same hover as the CTA buttons - the red fill rises from the bottom. No transition-delay
  and the border never changes width, so a click reacts at once and the pill never jumps.
*/

const ENDPOINT = "/api/contact";

/* WhatsApp number in international format, digits only (no + or spaces) */
const WHATSAPP_NUMBER = "923394011842";

const SERVICES = [
  "Branding",
  "Social Media",
  "UI/UX Design",
  "AI Ad Creatives",
  "Video Editing",
  "Website Development",
  
];

const BUDGETS = [
  "$100-$500",
  "$500 - $1000",
  "$1000-$2000",
  "$2000-$3000",
  "$3000-$4000",
  "$4000-$5000",
  "More than $5000",
];

type Field = { name: string; label: string; type?: string; required?: boolean };

/* order is row by row: left, right, left, right ... */
const FIELDS: Field[] = [
  { name: "name", label: "Name*", required: true },
  { name: "email", label: "Email*", type: "email", required: true },
  { name: "company", label: "Company name*" },
  { name: "phone", label: "Phone Number*", type: "tel" },
  { name: "source", label: "How did you hear about us*" },
];

/* browser autofill paints inputs light blue with dark text: keep them black with white text */
const AUTOFILL_CSS = `
  .sp-in { color-scheme: dark; caret-color: #fff; }
  .sp-in:-webkit-autofill,
  .sp-in:-webkit-autofill:hover,
  .sp-in:-webkit-autofill:focus,
  .sp-in:-webkit-autofill:active {
    -webkit-text-fill-color: #fff;
    caret-color: #fff;
    -webkit-box-shadow: 0 0 0 1000px #000 inset;
    box-shadow: 0 0 0 1000px #000 inset;
    transition: background-color 99999s ease-in-out 0s;
  }
`;

/* side padding: 97 Figma px on desktop, fluid on phones */
const SIDE = "px-[calc(97*var(--u))] [@media(max-width:900px)]:px-[var(--pad)]";

/* ───────── animation helpers (all in this file) ─────────
   (the word "mask" has extra side padding with an equal negative margin: the headings use negative letter-spacing,
    so without it the last letter of every word, e.g. the "e" or the ".", was cut off by overflow-hidden) 
   useInView : true once the element has been scrolled into view (stays true).
   Words     : splits a text into words. "mask" = every word slides up out of a hidden strip,
               "fade" = every word fades up. Words come in one after another (step ms apart).
   Nothing moves when the visitor has "reduce motion" turned on. */
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

/* ───────── the two buttons ─────────
   CtaPill = ONE pill used by BOTH buttons. Figma values (all multiplied by var(--k), 1 --k = 1 Figma px):
     pill ..... height 56, radius 76.8, border 0.57 white, gap 10.
               Space from the outer edge: left 14.9 (padding-left 14.33 + border), right 10 (padding-right 9.43 + border),
               padding-top / bottom 3.44. The circle sits 10 from the right edge, the dot 14.9 from the left edge.
     dot ...... 5.73
     label .... Poppins Medium 16, line-height 100%, letter-spacing -4%
     circle ... 38 x 38, radius 19
   Width = 88.6 + label width:  "Send Your Query" (label 125) = 213,  "Send on WhatsApp" (label 145) = 233.
   Hover: the colour fill rises from the bottom, the dot and the circle turn white and the icon takes the button colour. */
type Tone = "red" | "green";

const TONE: Record<Tone, { fill: string; hoverIcon: string; outline: string }> = {
  red: {
    fill: "bg-[#E71117]",
    hoverIcon: "group-hover:text-[#E71117] group-focus-visible:text-[#E71117]",
    outline: "focus-visible:outline-[#E71117]",
  },
  green: {
    fill: "bg-[#40C451]",
    hoverIcon: "group-hover:text-[#40C451] group-focus-visible:text-[#40C451]",
    outline: "focus-visible:outline-[#40C451]",
  },
};

function CtaPill({
  label,
  width,
  tone,
  icon,
  type = "button",
  onClick,
  className,
}: {
  label: string;
  width: number;
  tone: Tone;
  icon: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <button
      type={type}
      onClick={onClick}
      className={`group isolate flex [contain:layout] h-[calc(56*var(--k,1px))] w-[calc(var(--w)*var(--k,1px))] flex-none cursor-pointer items-center gap-[calc(10*var(--k,1px))] overflow-hidden rounded-[calc(76.8*var(--k,1px))] border-[length:calc(0.57*var(--k,1px))] border-solid border-white bg-transparent pt-[calc(3.44*var(--k,1px))] pr-[calc(9.43*var(--k,1px))] pb-[calc(3.44*var(--k,1px))] pl-[calc(14.33*var(--k,1px))] text-white whitespace-nowrap outline-none focus-visible:outline-2 focus-visible:outline-offset-4 ${t.outline} ${className ?? ""}`}
      style={{ "--w": width } as CSSProperties}
    >
      {/* colour fill that rises from the bottom */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 z-0 h-[140%] w-full translate-y-[72%] rounded-[50%_50%_0_0/28%_28%_0_0] ${t.fill} transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-[28.6%] group-focus-visible:-translate-y-[28.6%] motion-reduce:transition-none`}
      />
      {/* dot */}
      <span
        aria-hidden="true"
        className={`relative z-10 h-[calc(5.73*var(--k,1px))] w-[calc(5.73*var(--k,1px))] flex-none rounded-[50%] ${t.fill} transition-colors duration-300 group-hover:bg-white group-focus-visible:bg-white`}
      />
      {/* label */}
      <span className="relative z-10 text-[length:calc(16*var(--k,1px))] leading-[1] font-medium tracking-[-0.04em]">
        {label}
      </span>
      {/* round icon: 38 x 38, radius 19 */}
      <span
        aria-hidden="true"
        className={`relative z-10 ml-auto h-[calc(38*var(--k,1px))] w-[calc(38*var(--k,1px))] flex-none rounded-[calc(19*var(--k,1px))] ${t.fill} text-white transition-colors duration-300 group-hover:bg-white group-focus-visible:bg-white ${t.hoverIcon}`}
      >
        {icon}
      </span>
    </button>
  );
}

/* Send Your Query arrow: 14 x 14 at top 11 / left 12.13 inside the circle (traced from the design, white via currentColor) */
function ArrowIcon() {
  return (
    <span className="absolute top-[calc(11*var(--k,1px))] left-[calc(12.13*var(--k,1px))] block h-[calc(14*var(--k,1px))] w-[calc(14*var(--k,1px))]">
      <svg viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" className="block h-full w-full">
        <path d="M0.80 13.99L0.41 13.92L0.06 13.51L0.01 13.12L0.21 12.71L3.06 9.86L4.70 8.03L7.51 5.29L8.08 4.63L8.23 4.31L8.18 4.11L7.95 3.98L5.32 3.72L3.46 3.01L2.66 2.51L2.24 2.09L2.17 1.69L2.40 1.27L2.73 1.04L3.13 1.00L4.25 1.61L5.12 1.96L6.18 2.18L7.77 2.25L9.16 1.98L10.29 1.63L11.42 1.04L12.94 0.03L13.34 0.03L13.67 0.22L13.97 0.65L13.97 1.04L13.01 2.59L12.33 3.91L11.91 5.29L11.71 6.72L11.72 7.70L12.00 8.81L12.89 10.90L12.88 11.36L12.68 11.70L12.35 11.90L11.95 11.85L11.47 11.42L11.01 10.77L10.55 9.73L10.35 9.01L10.12 7.70L10.03 6.00L9.89 5.79L9.63 5.74L9.10 6.06L7.64 7.43L1.67 13.40L1.20 13.79Z" />
      </svg>
    </span>
  );
}

/* WhatsApp logo: 22.27 x 22.27 at top 7.73 / left 7.76 inside the circle. The glyph is traced from the reference design
   (ring + tail + handset) and fills its whole 24 x 24 box. White via currentColor; even-odd makes the ring hollow. */
function WhatsAppIcon() {
  return (
    <span className="absolute top-[calc(7.73*var(--k,1px))] left-[calc(7.76*var(--k,1px))] block h-[calc(22.27*var(--k,1px))] w-[calc(22.27*var(--k,1px))]">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        aria-hidden="true"
        className="block h-full w-full"
      >
        <path d="M1.01 23.94L0.66 24.00L0.49 23.96L0.24 23.76L0.09 23.59L0.00 23.42L0.00 23.34L0.38 22.30L0.66 21.22L1.57 18.70L1.67 17.92L1.60 17.66L1.27 17.06L1.12 16.55L0.64 15.43L0.25 13.71L0.11 12.42L0.11 11.48L0.19 10.45L0.57 8.52L1.01 7.28L1.41 6.50L2.16 5.21L2.82 4.35L3.43 3.66L4.29 2.84L5.41 1.99L6.10 1.56L6.45 1.43L7.62 0.83L9.38 0.32L10.67 0.06L11.79 0.00L13.16 0.05L14.73 0.31L15.16 0.40L16.52 0.83L17.30 1.17L18.09 1.61L18.35 1.82L19.30 2.42L20.59 3.51L21.72 4.87L22.15 5.47L22.32 5.81L22.58 6.15L22.98 6.93L23.75 9.07L23.85 9.67L24.00 11.48L23.98 12.68L23.85 13.97L23.70 14.70L23.40 15.77L22.99 16.72L22.55 17.58L22.06 18.35L20.89 19.90L20.15 20.59L19.56 21.06L18.44 21.87L17.66 22.36L16.82 22.73L15.62 23.16L13.78 23.57L13.00 23.65L11.97 23.68L10.33 23.56L8.43 23.14L6.87 22.51L6.44 22.40L6.10 22.38L5.58 22.44L5.23 22.54L4.11 22.89L3.59 23.10L2.56 23.39ZM13.28 21.62L13.86 21.56L14.47 21.45L15.59 21.10L16.71 20.60L17.23 20.31L17.95 19.81L18.79 19.13L19.73 18.21L20.55 17.06L21.31 15.69L21.41 15.43L21.75 14.23L22.04 12.68L22.05 11.48L22.00 10.96L21.74 9.33L21.35 8.13L20.99 7.35L20.51 6.53L19.73 5.51L18.66 4.43L18.27 4.09L17.86 3.83L17.57 3.59L16.88 3.16L16.11 2.79L14.90 2.37L13.86 2.15L12.57 2.00L11.79 1.99L10.76 2.05L8.94 2.46L8.08 2.76L6.53 3.59L5.58 4.36L4.72 5.16L4.28 5.64L3.78 6.32L3.41 6.93L2.97 7.78L2.63 8.64L2.48 9.24L2.22 10.02L2.11 10.88L2.10 11.74L2.19 13.37L2.30 13.96L2.58 14.92L2.85 15.52L3.11 16.20L3.40 16.81L3.68 17.25L3.88 17.75L3.71 18.61L3.38 19.38L3.12 20.33L3.06 20.84L3.08 20.93L3.16 21.00L3.42 20.99L4.03 20.82L4.89 20.65L6.18 20.21L6.44 20.17L6.87 20.29L7.65 20.69L8.60 21.10L9.72 21.46L11.10 21.65L12.31 21.66ZM15.76 17.42L15.24 17.49L14.55 17.33L13.61 17.06L12.61 16.72L11.65 16.29L10.91 15.86L10.34 15.43L9.55 14.76L8.66 13.88L7.83 12.85L7.05 11.70L6.55 10.71L6.26 9.85L6.22 9.24L6.26 8.64L6.32 8.39L6.59 7.70L7.13 6.92L7.38 6.75L7.94 6.50L8.43 6.39L8.69 6.41L8.86 6.48L9.21 6.84L9.82 8.21L10.07 8.68L10.18 9.24L10.15 9.59L10.07 9.90L9.45 10.79L9.41 10.96L9.45 11.22L9.89 11.96L10.24 12.39L11.45 13.56L12.57 14.30L13.17 14.49L13.52 14.55L13.78 14.50L14.04 14.35L14.62 13.71L15.07 13.32L15.24 13.26L15.42 13.26L15.59 13.30L16.02 13.51L16.45 13.63L16.80 13.86L17.32 14.09L17.99 14.57L18.08 14.74L18.12 14.92L18.11 15.34L18.01 15.69L17.75 16.21L17.23 16.74L16.54 17.14Z" />
      </svg>
    </span>
  );
}

/* outlined pill (services + budget). Hover: the red fill rises from the bottom (same effect as the CTA buttons);
   the chosen pill stays red. The border is always 0.5px (only its colour changes), so the pill never changes size
   when it is clicked, and there is no transition-delay, so a click reacts at once. */
function Pill({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`group relative isolate m-0 flex min-h-[30px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-[67px] border-[0.5px] border-solid px-[13px] py-[3px] text-[length:clamp(13px,3.4vw,15px)] leading-[24px] font-normal tracking-[-0.02em] text-white transition-[border-color,transform] duration-300 ease-out outline-none hover:border-[#E71117] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] active:scale-95 min-[901px]:min-h-[max(26px,calc(30*var(--u)))] min-[901px]:px-[max(10px,calc(13*var(--u)))] min-[901px]:py-[calc(3*var(--u))] min-[901px]:text-[length:max(12px,calc(16*var(--u)))] min-[901px]:leading-[max(18px,calc(24*var(--u)))] min-[901px]:whitespace-nowrap ${
        on ? "border-[#E71117]" : "border-white/70"
      }`}
    >
      {/* red fill that rises from the bottom */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 z-0 h-[140%] w-full rounded-[50%_50%_0_0/28%_28%_0_0] bg-[#E71117] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none ${
          on
            ? "-translate-y-[28.6%]"
            : "translate-y-[72%] group-hover:-translate-y-[28.6%] group-focus-visible:-translate-y-[28.6%]"
        }`}
      />
      <span className="relative z-10">{label}</span>
    </button>
  );
}

/* a line field: label on top, the writing line (the bottom border) turns red while you type */
function Line({ field, tall }: { field: Field; tall?: boolean }) {
  const id = `sp-${field.name}`;
  const inputCls =
    "sp-in absolute bottom-0 left-0 m-0 h-[48px] w-full border-0 bg-transparent p-0 text-[length:16px] text-white outline-none min-[901px]:h-[max(28px,calc(47.89*var(--u)))] min-[901px]:text-[length:max(14px,calc(18*var(--u)))]";
  return (
    <div className="relative flex h-[88px] w-full flex-col border-b border-white/[0.26] transition-colors duration-300 focus-within:border-[#E71117] min-[901px]:h-[max(64px,calc(96.42*var(--u)))]">
      <label
        htmlFor={id}
        className="flex h-[24px] items-center text-[length:15px] leading-none font-normal tracking-[-0.04em] text-white min-[901px]:h-[max(18px,calc(24*var(--u)))] min-[901px]:text-[length:max(12px,calc(16*var(--u)))]"
      >
        {field.label}
      </label>
      {tall ? (
        <textarea id={id} name={field.name} rows={1} className={`${inputCls} resize-none leading-[1.4]`} />
      ) : (
        <input id={id} name={field.name} type={field.type ?? "text"} required={field.required} className={inputCls} />
      )}
    </div>
  );
}

export default function StartProject() {
  const [blockRef, blockIn] = useInView<HTMLDivElement>(0.1);
  const [services, setServices] = useState<string[]>(["Branding"]);
  const [budget, setBudget] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const toggleService = (s: string) =>
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, services, budget }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setServices([]);
      setBudget(null);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  // same "required" checks as the form (Name, Email), then open WhatsApp with the details as a ready message
  function whatsappClick() {
    const form = formRef.current;
    if (!form || !form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const get = (k: string) => String(data[k] ?? "").trim();

    const lines = [
      "Hi MAX Design, I would like to start a project.",
      "",
      `*Name:* ${get("name")}`,
      `*Email:* ${get("email")}`,
      ...(get("company") ? [`*Company:* ${get("company")}`] : []),
      ...(get("phone") ? [`*Phone:* ${get("phone")}`] : []),
      ...(services.length ? [`*Services:* ${services.join(", ")}`] : []),
      ...(budget ? [`*Budget:* ${budget}`] : []),
      ...(get("source") ? [`*Heard about us from:* ${get("source")}`] : []),
      ...(get("details") ? [`*Details:* ${get("details")}`] : []),
    ];

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const fade = (delay: number) => ({
    style: { transitionDelay: blockIn ? `${delay}ms` : "0ms" },
    className: `transition-[opacity,translate] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
      blockIn ? "translate-y-0 opacity-100" : "translate-y-[calc(30*var(--u))] opacity-0"
    }`,
  });

  /* the same scale for BOTH buttons: --k = 1 Figma px. Desktop: --u. Tablet: 1px. Phone (560px and narrower): the two pills
     (213 + 233 = 446) plus the 10px gap fill the row exactly, so both shrink together. */
  const BTN_SCALE =
    "[--k:var(--u)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:560px)]:[--k:calc((100cqw_-_2*clamp(16px,5vw,96px)_-_10px)_/_446)]!";

  return (
    <div className="@container w-full bg-black text-white">
      <style>{AUTOFILL_CSS}</style>
      <div className="mx-auto w-full max-w-[1920px] [--k:var(--u)] [--u:calc(min(100cqw,1920px)_/_1920)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:900px)]:[--pad:clamp(16px,5vw,96px)]">
        <main>
          <section
            className={`${SIDE} mt-[calc(81*var(--u))] pb-[calc(120*var(--u))] [@media(max-width:900px)]:mt-[32px] [@media(max-width:900px)]:pb-[32px]`}
          >
            <form ref={formRef} onSubmit={onSubmit} aria-label="Start your project">
              <div ref={blockRef} className="flex w-full flex-col">
                {/* heading row: 151 high, the divider is its bottom line */}
                <div className="flex items-start border-b border-white/[0.26] pb-[22px] min-[901px]:h-[calc(151*var(--u))] min-[901px]:pb-0">
                  <h1 className="m-0 text-[length:clamp(34px,9vw,64px)] leading-[1.12] font-medium tracking-[-0.04em] text-white min-[901px]:text-[length:calc(80*var(--u))]">
                    <Words text="Pick what you need. Select one or more." delay={150} step={110} />
                  </h1>
                </div>

                {/* what are you supposed to do */}
                <h2
                  style={fade(200).style}
                  className={`${fade(200).className} m-0 mt-[32px] text-[length:clamp(24px,6vw,40px)] leading-[1.2] font-normal tracking-[-0.04em] text-white min-[901px]:mt-[calc(43*var(--u))] min-[901px]:text-[length:calc(48*var(--u))] min-[901px]:leading-[calc(39*var(--u))]`}
                >
                  Pick what you need. Select one or more.
                </h2>
                <div
                  role="group"
                  aria-label="Services"
                  className="mt-[20px] flex flex-wrap gap-[12px] min-[901px]:mt-[calc(43*var(--u))] min-[901px]:gap-[max(10px,calc(24*var(--u)))]"
                >
                  {SERVICES.map((s) => (
                    <Pill key={s} label={s} on={services.includes(s)} onClick={() => toggleService(s)} />
                  ))}
                </div>

                {/* form grid: 1344 wide, 2 columns x 3 rows, gaps 62 */}
                <div
                  style={fade(350).style}
                  className={`${fade(350).className} mt-[40px] grid w-full grid-cols-1 gap-[24px] min-[561px]:grid-cols-2 min-[561px]:gap-x-[32px] min-[901px]:mt-[calc(119*var(--u))] min-[901px]:w-[calc(1344*var(--u))] min-[901px]:gap-x-[calc(62*var(--u))] min-[901px]:gap-y-[calc(62*var(--u))]`}
                >
                  {FIELDS.map((f) => (
                    <Line key={f.name} field={f} />
                  ))}
                </div>

                {/* budget */}
                <div className="mt-[48px] flex flex-col gap-[20px] min-[901px]:mt-[calc(107.75*var(--u))] min-[901px]:gap-[calc(32*var(--u))]">
                  <h2 className="m-0 text-[length:clamp(24px,6vw,40px)] leading-[1.2] font-normal tracking-[-0.08em] text-white min-[901px]:text-[length:calc(48*var(--u))] min-[901px]:leading-[calc(39*var(--u))]">
                    <Words text="Your Budget" step={120} />
                  </h2>
                  <div
                    role="group"
                    aria-label="Budget"
                    className="flex flex-wrap gap-[12px] min-[901px]:max-w-[calc(1033*var(--u))] min-[901px]:gap-[max(10px,calc(24*var(--u)))]"
                  >
                    {BUDGETS.map((b) => (
                      <Pill key={b} label={b} on={budget === b} onClick={() => setBudget((cur) => (cur === b ? null : b))} />
                    ))}
                  </div>
                </div>

                {/* details field (fills the row) with the two buttons at the right end of the same row on desktop; below it on tablet / phone */}
                <div className="mt-[40px] flex flex-col gap-[28px] min-[901px]:mt-[calc(34.6*var(--u))] min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between min-[901px]:gap-[24px]">
                  <div
                    style={fade(450).style}
                    className={`${fade(450).className} w-full min-[901px]:min-w-0 min-[901px]:flex-1`}
                  >
                    <Line field={{ name: "details", label: "Share details about your project" }} tall />
                  </div>

                  {/* the two buttons: ONE row on every screen size (WhatsApp left, Send right), centre-aligned so they are always
                      on the same line. Both are the same CtaPill, so padding / spacing / gaps are identical. */}
                  <div className="flex flex-none flex-row items-center justify-end gap-[10px] min-[901px]:gap-[calc(16*var(--u))] [@media(max-width:560px)]:w-full [@media(max-width:560px)]:justify-between">
                    <CtaPill
                      label="Send on WhatsApp"
                      width={233}
                      tone="green"
                      icon={<WhatsAppIcon />}
                      onClick={whatsappClick}
                      className={BTN_SCALE}
                    />

                    {/* the "Thank you" message is absolutely positioned under the Send button, so it never changes the row height */}
                    <div className="relative flex flex-none items-center">
                      <CtaPill
                        label={status === "sending" ? "Sending…" : "Send Your Query"}
                        width={213}
                        tone="red"
                        type="submit"
                        icon={<ArrowIcon />}
                        className={BTN_SCALE}
                      />
                      <p
                        role="status"
                        aria-live="polite"
                        className="pointer-events-none absolute top-full right-0 m-0 mt-[10px] w-max max-w-[calc(100cqw-2*clamp(16px,5vw,96px))] text-right text-[length:14px] leading-[1.4] text-white/70 min-[901px]:w-[calc(320*var(--u))] min-[901px]:max-w-none min-[901px]:text-[length:max(13px,calc(16*var(--u)))]"
                      >
                        {status === "sent" && "Thank you! We will get back to you soon."}
                        {status === "error" && "Something went wrong. Please try again."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}