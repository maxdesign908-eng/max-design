"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import CtaButton from "./home/CtaButton";

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

  The send button is the shared CtaButton (same red-fill hover). Change ENDPOINT to where the form should be sent.

  "Send on WhatsApp": checks the required fields (Name, Email), then opens
  https://wa.me/<WHATSAPP_NUMBER>?text=<the form details> in a new tab.
  On EVERY screen size the two buttons sit side by side in one row: WhatsApp on the left, Send Your Query on the right.
  The row is centre-aligned and both wrappers are exactly as tall as their button (the "Thank you" message is
  absolutely positioned under the Send button on every screen size), so the two buttons are always on one line.

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
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "company", label: "Company name" },
  { name: "phone", label: "Phone Number", type: "tel" },
  { name: "source", label: "How did you hear about us" },
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

/* WhatsApp logo glyph: the glyph fills its whole 24 x 24 box (the old one filled only ~81% of it),
   so when it is shown at 22.27 x 22.27 it is exactly that size. White via currentColor. */
function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="block h-full w-full"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/* "Send on WhatsApp": same pill as the shared CtaButton, in WhatsApp green with the WhatsApp icon in the round part.
   Figma values used (all multiplied by var(--k), 1 --k = 1 Figma px):
     pill ..... height 56, radius 76.8, border 0.57 white, padding 3.44 / 14.9, gap 10
     label .... Poppins Medium 16, line-height 100%, letter-spacing -4%
     circle ... 38 x 38, radius 19, background #40C451
     logo ..... 22.27 x 22.27, white, top 7.73 / left 7.76 inside the circle
   Width: Send Your Query is 218 wide (its label box is 130). "Send on WhatsApp" is 20 longer at the same 16px size,
   so this pill is 240 wide so the whole label fits. CtaButton itself is not changed. */
function WhatsAppCta({
  label,
  width,
  onClick,
  className,
}: {
  label: string;
  width: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group isolate flex [contain:layout] h-[calc(56*var(--k,1px))] w-[calc(var(--w)*var(--k,1px))] flex-none cursor-pointer items-center gap-[calc(10*var(--k,1px))] overflow-hidden rounded-[calc(76.8*var(--k,1px))] border-[length:calc(0.57*var(--k,1px))] border-solid border-white bg-transparent px-[calc(14.9*var(--k,1px))] py-[calc(3.44*var(--k,1px))] text-white whitespace-nowrap transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] ${className ?? ""}`}
      style={{ "--w": width } as CSSProperties}
    >
      {/* green fill that rises from the bottom */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 h-[140%] w-full translate-y-[72%] rounded-[50%_50%_0_0/28%_28%_0_0] bg-[#25D366] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-[28.6%] group-focus-visible:-translate-y-[28.6%] motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className="relative z-10 h-[calc(5.73*var(--k,1px))] w-[calc(5.73*var(--k,1px))] flex-none rounded-[50%] bg-[#25D366] transition-colors duration-300 group-hover:bg-white group-focus-visible:bg-white"
      />
      <span className="relative z-10 text-[length:calc(16*var(--k,1px))] leading-[1] font-medium tracking-[-0.04em]">
        {label}
      </span>
      {/* the round logo: 38 x 38, radius 19, #40C451; the white glyph is 22.27 x 22.27 at top 7.73 / left 7.76 */}
      <span
        aria-hidden="true"
        className="relative z-10 ml-auto h-[calc(38*var(--k,1px))] w-[calc(38*var(--k,1px))] flex-none rounded-[calc(19*var(--k,1px))] bg-[#40C451] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#40C451] group-focus-visible:bg-white group-focus-visible:text-[#40C451]"
      >
        <span className="absolute top-[calc(7.73*var(--k,1px))] left-[calc(7.76*var(--k,1px))] block h-[calc(22.27*var(--k,1px))] w-[calc(22.27*var(--k,1px))]">
          <WhatsAppIcon />
        </span>
      </span>
    </button>
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

  // the shared CtaButton is a link: a click on it sends the form (with the browser's own "required" checks)
  function sendClick(e: React.MouseEvent) {
    e.preventDefault();
    formRef.current?.requestSubmit();
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
                      on the same line. On a phone the row is exactly as wide as the screen and both buttons shrink together. */}
                  <div className="flex flex-none flex-row items-center justify-end gap-[10px] min-[901px]:gap-[calc(16*var(--u))] [@media(max-width:560px)]:w-full [@media(max-width:560px)]:justify-between">
                    {/* WhatsApp button: same look as Send Your Query, in WhatsApp green (240 wide so the 16px label fits) */}
                    <WhatsAppCta
                      label="Send on WhatsApp"
                      width={240}
                      onClick={whatsappClick}
                      className="order-1 [--k:var(--u)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:560px)]:[--k:calc((100cqw_-_2*clamp(16px,5vw,96px)_-_10px)_/_458)]!"
                    />

                    {/* shared CtaButton, 218 x 56 (a click on it sends the form). The wrapper is a flex box that is exactly as tall as the
                        button; the "Thank you" message below is absolutely positioned, so it never changes the row height. */}
                    <div
                      onClickCapture={sendClick}
                      className="relative order-2 flex flex-none items-center"
                    >
                      <CtaButton
                        href="#start-project"
                        label={status === "sending" ? "Sending…" : "Send Your Query"}
                        width={218}
                        className="[--k:var(--u)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:560px)]:[--k:calc((100cqw_-_2*clamp(16px,5vw,96px)_-_10px)_/_458)]!"
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