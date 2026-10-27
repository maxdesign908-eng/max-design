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
    details field ..... 35 under the budget, 1344 wide, with the "Send Your Query" button (211 x 56) at the right end

  SIZES
  - 901px and wider: Figma sizes * var(--u) (1 --u = 1 Figma px, capped at 1920). Text never goes below
    12-14px, and the pill rows wrap to a second line instead of colliding when there is not enough room.
  - 561px - 900px: fluid sizes, the form grid keeps 2 columns.
  - 560px and narrower: one column, the button is full width.

  The send button is the shared CtaButton (same red-fill hover). Change ENDPOINT to where the form should be sent.

  "Send on WhatsApp": checks the required fields (Name, Email), then opens
  https://wa.me/<WHATSAPP_NUMBER>?text=<the form details> in a new tab.
  Desktop: it sits right above "Send Your Query" (the send button keeps its Figma position).
  Phone / tablet: it sits right below "Send Your Query".
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

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className="block h-full w-full"
    >
      <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.6 28.3 13.8 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.7c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1 1.1-3.9-.3-.4C5.7 19.9 5.3 18 5.3 16 5.3 9.9 10.1 5.3 16 5.3S26.7 10.1 26.7 16 21.9 26.7 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
    </svg>
  );
}

/* "Send on WhatsApp": same pill as the shared CtaButton (same size, white outline, dot, label, round icon on the right,
   fill rises on hover) but in WhatsApp green and with the WhatsApp icon in the round part. CtaButton itself is not changed.
   Desktop (901px and wider): width = `width`, label 14.5.
   Phone / tablet (900px and narrower): width = `mobileWidth`, label 16 (same size as "Send Your Query"; the longer
   label needs the little extra width so it does not run under the round icon). */
function WhatsAppCta({
  label,
  width,
  mobileWidth,
  onClick,
  className,
}: {
  label: string;
  width: number;
  mobileWidth?: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group isolate flex [contain:layout] h-[calc(56*var(--k,1px))] w-[calc(var(--w)*var(--k,1px))] [@media(max-width:900px)]:w-[calc(var(--wm)*var(--k,1px))] flex-none cursor-pointer items-center overflow-hidden rounded-[999px] border-[length:calc(0.573*var(--k,1px))] border-solid border-white bg-transparent py-0 pr-[calc(10.46*var(--k,1px))] pl-[calc(14.33*var(--k,1px))] text-white whitespace-nowrap transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#25D366] ${className ?? ""}`}
      style={{ "--w": width, "--wm": mobileWidth ?? width } as CSSProperties}
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
      <span className="relative z-10 ml-[calc(9.17*var(--k,1px))] text-[length:calc(14.5*var(--k,1px))] [@media(max-width:900px)]:text-[length:calc(16*var(--k,1px))] leading-[normal] font-medium tracking-[-0.04em]">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="relative z-10 ml-auto grid h-[calc(38*var(--k,1px))] w-[calc(38*var(--k,1px))] flex-none place-items-center rounded-[50%] bg-[#25D366] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#25D366] group-focus-visible:bg-white group-focus-visible:text-[#25D366]"
      >
        <span className="block h-[calc(22*var(--k,1px))] w-[calc(22*var(--k,1px))]">
          <WhatsAppIcon />
        </span>
      </span>
    </button>
  );
}

/* outlined pill; the chosen one is filled red (#E71117) */
function Pill({ label, on, onClick, delay }: { label: string; on: boolean; onClick: () => void; delay: number }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      style={{ transitionDelay: `${delay}ms` }}
      className={`m-0 flex min-h-[30px] max-w-full cursor-pointer items-center justify-center rounded-[67px] border-solid px-[13px] py-[3px] text-[length:clamp(13px,3.4vw,15px)] leading-[24px] font-normal tracking-[-0.02em] text-white transition-[background-color,border-color,transform] duration-300 outline-none hover:border-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] active:scale-95 min-[901px]:min-h-[max(26px,calc(30*var(--u)))] min-[901px]:px-[max(10px,calc(13*var(--u)))] min-[901px]:py-[calc(3*var(--u))] min-[901px]:text-[length:max(12px,calc(16*var(--u)))] min-[901px]:leading-[max(18px,calc(24*var(--u)))] min-[901px]:whitespace-nowrap ${
        on ? "border-0 bg-[#E71117]" : "border-[0.5px] border-white/70 bg-transparent"
      }`}
    >
      {label}
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
                  {SERVICES.map((s, i) => (
                    <Pill key={s} label={s} on={services.includes(s)} onClick={() => toggleService(s)} delay={blockIn ? 300 + i * 70 : 0} />
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
                    {BUDGETS.map((b, i) => (
                      <Pill key={b} label={b} on={budget === b} onClick={() => setBudget((cur) => (cur === b ? null : b))} delay={blockIn ? 300 + i * 70 : 0} />
                    ))}
                  </div>
                </div>

                {/* details field (1344 wide) with the buttons at the right end of the same row */}
                <div className="mt-[40px] flex flex-col gap-[28px] min-[901px]:mt-[calc(34.6*var(--u))] min-[901px]:flex-row min-[901px]:items-end min-[901px]:justify-between min-[901px]:gap-[24px]">
                  <div
                    style={fade(450).style}
                    className={`${fade(450).className} w-full min-[901px]:w-[calc(1344*var(--u))] min-[901px]:flex-none`}
                  >
                    <Line field={{ name: "details", label: "Share details about your project" }} tall />
                  </div>

                  {/* buttons column: desktop = WhatsApp above Send (Send keeps its Figma spot), phone = Send above WhatsApp */}
                  <div className="flex flex-none flex-col items-end gap-[14px] min-[901px]:gap-[calc(16*var(--u))] [@media(max-width:560px)]:w-full [@media(max-width:560px)]:flex-row [@media(max-width:560px)]:items-start [@media(max-width:560px)]:justify-between [@media(max-width:560px)]:gap-[10px]">
                    {/* shared CtaButton, 211 x 56 (a click on it sends the form) */}
                    <div
                      onClickCapture={sendClick}
                      className="relative order-1 flex flex-none flex-col items-end min-[901px]:order-2 min-[901px]:block [@media(max-width:560px)]:order-2"
                    >
                      <CtaButton
                        href="#start-project"
                        label={status === "sending" ? "Sending…" : "Send Your Query"}
                        width={211}
                        className="[--k:var(--u)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:560px)]:[--k:calc((100cqw_-_2*clamp(16px,5vw,96px)_-_10px)_/_437)]!"
                      />
                      <p
                        role="status"
                        aria-live="polite"
                        className="m-0 mt-[10px] text-[length:14px] leading-[1.4] text-white/70 [@media(max-width:560px)]:absolute [@media(max-width:560px)]:top-full [@media(max-width:560px)]:right-0 [@media(max-width:560px)]:w-[calc(100cqw-2*clamp(16px,5vw,96px))] [@media(max-width:560px)]:text-right min-[901px]:absolute min-[901px]:top-full min-[901px]:right-0 min-[901px]:w-[calc(320*var(--u))] min-[901px]:text-right min-[901px]:text-[length:max(13px,calc(16*var(--u)))]"
                      >
                        {status === "sent" && "Thank you! We will get back to you soon."}
                        {status === "error" && "Something went wrong. Please try again."}
                      </p>
                    </div>

                    {/* WhatsApp button: same look as Send Your Query, in WhatsApp green (phone / tablet: label 16 like Send, 226 wide) */}
                    <WhatsAppCta
                      label="Send on WhatsApp"
                      width={211}
                      mobileWidth={226}
                      onClick={whatsappClick}
                      className="order-2 [--k:var(--u)] min-[901px]:order-1 [@media(max-width:900px)]:[--k:1px] [@media(max-width:560px)]:order-1 [@media(max-width:560px)]:[--k:calc((100cqw_-_2*clamp(16px,5vw,96px)_-_10px)_/_437)]!"
                    />
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