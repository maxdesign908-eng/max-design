"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

/*
  "Your Brand Has More to Say. Let's Shape It!" contact block.
  Figma frame: 1926 x 1034. The container is 1720 x 943.11, 45 from the top.

  HOW IT SCALES (same system as the other blocks)
  - Page 900px and wider: the Figma layout, scaled. Every size is N * var(--u),
    where 1 --u = 1 Figma px, so the block shrinks smoothly (and stops growing at 1920).
    Text and fields have a minimum size so they stay readable on tablets.
  - Page 899px and narrower: heading on top, form below. Under 600px the form is one column.
  - --u uses cqw (the width of the <section>) and not vw, so a scrollbar never causes sideways scroll.

  Numbers taken from your Figma values and measured on your 1:1 screenshot:
    heading ........ Poppins Medium 80 / 96, tracking -4%, 3 lines (288 high)
    form box ....... 788 wide, 1px border (white 30%), padding 53 left / 78 top
    label .......... Poppins Regular 20 / 37.29, tracking -4%
    field .......... 58.6 high, 1px underline (white 29%), placeholder Regular 16 (white 50%)
    rows ........... 159.67 apart; two columns of 307.27 with a 66.9 gap
    button ......... 681 x 56, full round, #E71117, text Medium 16
    popover ........ 300 wide, white, 7 padding, pills 46 high with 16 between

  Background: the red-glass picture, 3817 x 2147, turned 180deg, blur 12 (Figma 24), opacity 1.
  I fitted it on your screenshot (0.9998 match), so top / left are relative to this section.

  "Book A Call Directly": a next/link to /book-a-call (like the links in your Navbar), so the
  browser does not reload the page.
*/

const SERVICES = [
  "Brand Design",
  "UI/UX Design",
  "Website Design & Development",
  "Video Editing",
  "AI-Powered Ad Creatives",
  "Social Media",
];

const BUDGETS = [
  "100$-500$",
  "500$-1000$",
  "1000$-2000$",
  "2000$-3000$",
  "3000$-4000$",
  "4000$-5000$",
  "More Than $5000",
];

type Values = {
  name: string;
  company: string;
  email: string;
  service: string;
  budget: string;
  details: string;
};
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMPTY: Values = {
  name: "",
  company: "",
  email: "",
  service: "",
  budget: "",
  details: "",
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.company.trim()) e.company = "Please enter your company name";
  if (!v.email.trim()) e.email = "Please enter your email";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = "Please enter a valid email";
  if (!v.service) e.service = "Please choose a service";
  if (!v.budget) e.budget = "Please choose a budget";
  if (!v.details.trim()) e.details = "Please tell us about your project";
  return e;
}

/* All the sizes of this block live here, so the class names below stay short. */
const CSS = `
  .ct {
    --u: calc(min(100cqw, 1920px) / 1920);
    --bu: var(--u);                                  /* background scale */
    --hs: max(40px, calc(80 * var(--u)));            /* heading */
    --ls: max(16px, calc(20 * var(--u)));            /* field labels */
    --ps: max(14px, calc(16 * var(--u)));            /* placeholders, typed text, button */
    --cs: max(16px, calc(24 * var(--u)));            /* "Not interested..." */
    --ks: max(14px, calc(20 * var(--u)));            /* "Book a call" link */
    --lh: max(24px, calc(37.29 * var(--u)));         /* label line height */
    --fh: max(44px, calc(58.6 * var(--u)));          /* field height */
    --lg: max(6px, calc(17 * var(--u)));             /* label -> field */
    --rg: max(22px, calc(46.9 * var(--u)));          /* field -> next label */
    --bp: max(22px, calc(52.28 * var(--u)));         /* box side padding */
  }
  @media (max-width: 899px) {
    .ct {
      --bu: calc(var(--u) * 2.4);
      --hs: clamp(36px, 10.5cqw, 64px);
      --ls: 16px;
      --ps: 15px;
      --cs: 16px;
      --ks: 15px;
      --lh: 26px;
      --fh: 48px;
      --lg: 6px;
      --rg: 24px;
      --bp: clamp(20px, 5cqw, 32px);
    }
  }
  .ct .lbl { font-size: var(--ls); line-height: var(--lh); height: var(--lh); margin: 0; display: block;
             font-weight: 400; letter-spacing: -0.04em; color: #fff; white-space: nowrap; }
  .ct .fld { height: var(--fh); min-height: var(--fh); margin-top: var(--lg); box-sizing: border-box; }
  .ct .txt { font-size: var(--ps); line-height: 1.4; font-weight: 400; letter-spacing: -0.04em; }
  .ct .btn { font-size: var(--ps); font-weight: 500; letter-spacing: -0.04em; line-height: 1; }
  .ct input:-webkit-autofill,
  .ct textarea:-webkit-autofill {
    -webkit-text-fill-color: #fff;
    caret-color: #fff;
    transition: background-color 99999s ease-out;
  }
`;

function Chevron() {
  return (
    <svg
      viewBox="0 0 14 8"
      fill="none"
      aria-hidden="true"
      className="h-[max(6px,calc(8*var(--u)))] w-[max(10px,calc(14*var(--u)))] shrink-0"
    >
      <path
        d="M1 1l6 6 6-6"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Pencil() {
  return (
    <svg
      viewBox="0 0 20 19"
      fill="none"
      aria-hidden="true"
      className="h-[max(15px,calc(19*var(--u)))] w-[max(16px,calc(20*var(--u)))] shrink-0"
    >
      <path
        d="M13.4 1.6l4 4L6.2 16.8l-4.6.8.8-4.6L13.4 1.6z"
        stroke="white"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M9 18.2h10" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

/* label on top, field with underline below, small error text that never moves the layout */
function Field({
  id,
  label,
  error,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="lbl"
      >
        {label}
      </label>
      <div className="relative">
        <div
          className={`fld relative flex items-center border-b transition-colors duration-300 focus-within:border-white/70 ${
            error ? "border-[#ff4d57]" : "border-[#4A4A4A]"
          }`}
        >
          {children}
        </div>
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="absolute top-[calc(100%+4px)] left-0 m-0 text-[13px] leading-none text-[#ff6b73]"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

const INPUT =
  "txt w-full min-w-0 bg-transparent py-0 text-white outline-none placeholder:text-white/50";

/* custom drop-down: white panel with round pills (see the Figma crops) */
function Select({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  open,
  onOpenChange,
  error,
}: {
  id: string;
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  error?: string;
}) {
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);

  // when it opens, move focus to the chosen option (or the first one)
  useEffect(() => {
    if (!open) return;
    const items = list.current?.querySelectorAll<HTMLButtonElement>("button");
    const i = Math.max(0, options.indexOf(value));
    items?.[i]?.focus();
  }, [open, options, value]);

  function onListKey(e: KeyboardEvent<HTMLUListElement>) {
    const items = Array.from(
      list.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
    );
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(i + 1) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(i - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
      trigger.current?.focus();
    } else if (e.key === "Tab") {
      onOpenChange(false);
    }
  }

  return (
    <Field id={id} label={label} error={error}>
      <button
        ref={trigger}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => onOpenChange(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onOpenChange(true);
          }
        }}
        className={`txt flex h-full w-full cursor-pointer items-center justify-between gap-[8px] bg-transparent py-0 pr-[calc(6*var(--u))] text-left outline-none ${
          value ? "text-white" : "text-white/50"
        }`}
      >
        <span className="min-w-0 truncate">{value || placeholder}</span>
        <span
          className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <Chevron />
        </span>
      </button>

      {/* panel: 300 wide, 7 padding, pills 46 high, 16 apart */}
      <ul
        ref={list}
        id={`${id}-list`}
        role="listbox"
        aria-labelledby={`${id}-label`}
        onKeyDown={onListKey}
        className={`absolute top-[calc(100%+8px)] left-0 z-30 m-0 flex w-full list-none flex-col gap-[max(10px,calc(16*var(--u)))] rounded-[6px] bg-white p-[max(6px,calc(7*var(--u)))] shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-200 ease-out ${
          open
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-[6px] opacity-0"
        }`}
        aria-hidden={!open}
      >
        {options.map((opt) => {
          const selected = opt === value;
          return (
            <li key={opt} role="presentation" className="m-0 p-0">
              <button
                type="button"
                role="option"
                aria-selected={selected}
                tabIndex={open ? 0 : -1}
                onClick={() => {
                  onChange(opt);
                  onOpenChange(false);
                  trigger.current?.focus();
                }}
                className={`flex h-[max(40px,calc(46*var(--u)))] w-full cursor-pointer items-center rounded-full border border-black px-[max(14px,calc(16*var(--u)))] text-left text-[length:var(--ps)] leading-none font-medium tracking-[-0.04em] outline-none transition-colors duration-150 focus-visible:bg-black/[0.06] ${
                  selected
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-black/[0.06]"
                }`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
    </Field>
  );
}

export default function Contact({
  endpoint = "/api/contact",
  callHref = "/book-a-call",
}: {
  /** the form is sent here as JSON (POST). Change it to your own API route. */
  endpoint?: string;
  /** the booking page that "Book A Call Directly" opens (client-side navigation, no page reload) */
  callHref?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [openKey, setOpenKey] = useState<"service" | "budget" | null>(null);
  const [formKey, setFormKey] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  const id = (k: string) => `${uid}-${k}`;

  function set<K extends keyof Values>(k: K, v: Values[K]) {
    setValues((cur) => ({ ...cur, [k]: v }));
    setErrors((cur) => (cur[k] ? { ...cur, [k]: undefined } : cur));
    if (status !== "idle") setStatus("idle");
  }

  // close the open drop-down when clicking anywhere else
  useEffect(() => {
    if (!openKey) return;
    const close = (e: PointerEvent) => {
      const el = document.getElementById(id(openKey));
      const list = document.getElementById(`${id(openKey)}-list`);
      const t = e.target as Node;
      if (!el?.contains(t) && !list?.contains(t)) setOpenKey(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setValues(EMPTY);
      setFormKey((k) => k + 1); // fresh, empty form
    } catch {
      setStatus("error");
    }
  }

  const buttonText =
    status === "sending"
      ? "Sending..."
      : status === "sent"
        ? "Sent! We will get back to you soon"
        : status === "error"
          ? "Something went wrong, please try again"
          : "Send Your Query";

  return (
    <section id="contact" className="@container w-full bg-black text-white">
      <style>{CSS}</style>

      {/* empty space above the block (108 Figma px, scales with the page) */}
      <div
        aria-hidden="true"
        className="h-[calc(50*min(100cqw,1920px)/1920)] max-[899px]:h-[42px]"
      />

      <div className="ct relative isolate w-full overflow-hidden">
        {/* ───────── background: red glass, turned 180deg, blurred ───────── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute top-[calc(-718.17*var(--bu))] left-[calc(-998*var(--bu))] h-[calc(2147*var(--bu))] w-[calc(3817*var(--bu))] rotate-180 blur-[calc(12*var(--bu))]">
            <Image
              src="/images/bg-glass.webp"
              alt=""
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* ───────── content: left text + right form (space-between) ───────── */}
        <div className="mx-auto flex min-h-[calc(943.11*var(--u))] w-full max-w-[1920px] justify-between pt-[calc(45*var(--u))] pr-[calc(98*var(--u))] pb-[calc(45.9*var(--u))] pl-[calc(102*var(--u))] max-[899px]:min-h-0 max-[899px]:flex-col max-[899px]:gap-[40px] max-[899px]:px-[clamp(16px,5cqw,48px)] max-[899px]:pt-[56px] max-[899px]:pb-0">
          {/* heading: the 288px text block sits 325 from the container top */}
          <div className="w-[calc(727*var(--u))] shrink-0 pt-[calc(324.8*var(--u))] max-[899px]:w-full max-[899px]:pt-0">
            <h2 className="m-0 text-[length:var(--hs)] leading-[1.2] font-medium tracking-[-0.04em] text-white">
              <span className="block">Your Brand Has</span>
              <span className="block">More to Say.</span>
              <span className="block">Let’s Shape It!</span>
            </h2>
          </div>

          {/* form column: 788 wide, 32 between the box and the call link */}
          <div className="flex w-[calc(788*var(--u))] shrink-0 flex-col gap-[max(16px,calc(32*var(--u)))] max-[899px]:w-full max-[899px]:gap-[40px]">
            <form
              key={formKey}
              ref={formRef}
              noValidate
              onSubmit={onSubmit}
              aria-label="Contact form"
              className="bg-black bg-clip-padding px-[var(--bp)] pt-[max(28px,calc(78*var(--u)))] pb-[max(28px,calc(77.4*var(--u)))] shadow-none outline-none [border:1px_solid_#4A4A4A]"
            >
              <div className="grid grid-cols-2 gap-x-[calc(66.9*var(--u))] gap-y-[var(--rg)] max-[899px]:gap-x-[24px] max-[599px]:grid-cols-1">
                <Field
                  id={id("name")}
                  label="Full Name"
                  className="col-span-2 max-[599px]:col-span-1"
                >
                  <input
                    id={id("name")}
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your Name"
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field id={id("company")} label="Company Name*" error={errors.company}>
                  <input
                    id={id("company")}
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your Company"
                    required
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? `${id("company")}-error` : undefined}
                    value={values.company}
                    onChange={(e) => set("company", e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Field id={id("email")} label="Email*" error={errors.email}>
                  <input
                    id={id("email")}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="You@Example.Com"
                    required
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? `${id("email")}-error` : undefined}
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={INPUT}
                  />
                </Field>

                <Select
                  id={id("service")}
                  label="Service Required*"
                  placeholder="Select Your Service"
                  options={SERVICES}
                  value={values.service}
                  onChange={(v) => set("service", v)}
                  open={openKey === "service"}
                  onOpenChange={(o) => setOpenKey(o ? "service" : null)}
                  error={errors.service}
                />

                <Select
                  id={id("budget")}
                  label="Project Budget*"
                  placeholder="Select Your Range"
                  options={BUDGETS}
                  value={values.budget}
                  onChange={(v) => set("budget", v)}
                  open={openKey === "budget"}
                  onOpenChange={(o) => setOpenKey(o ? "budget" : null)}
                  error={errors.budget}
                />

                <Field
                  id={id("details")}
                  label="Project Details*"
                  error={errors.details}
                  className="col-span-2 max-[599px]:col-span-1"
                >
                  <textarea
                    id={id("details")}
                    name="details"
                    rows={1}
                    placeholder="Tell Us More About Your Idea"
                    required
                    aria-invalid={!!errors.details}
                    aria-describedby={errors.details ? `${id("details")}-error` : undefined}
                    value={values.details}
                    onChange={(e) => set("details", e.target.value)}
                    className={`${INPUT} h-full resize-none overflow-hidden pt-[calc(14*var(--u))] pr-[calc(34*var(--u))] max-[899px]:pr-[34px]`}
                  />
                  <span className="pointer-events-none absolute top-1/2 right-[calc(3*var(--u))] -translate-y-1/2">
                    <Pencil />
                  </span>
                </Field>
              </div>

              {/* send button: 681 x 56, 59 under the last field */}
              <button
                type="submit"
                disabled={status === "sending"}
                className={`btn mt-[max(32px,calc(59*var(--u)))] flex h-[max(48px,calc(56*var(--u)))] w-full cursor-pointer items-center justify-center rounded-full px-[16px] text-center text-white transition-colors duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white disabled:cursor-wait disabled:opacity-80 ${
                  status === "error"
                    ? "bg-[#9d0d12]"
                    : "bg-[#E71117] hover:bg-[#ff1e2d]"
                }`}
              >
                {buttonText}
              </button>

              <p className="sr-only" role="status" aria-live="polite">
                {status === "sent"
                  ? "Your message was sent."
                  : status === "error"
                    ? "Your message could not be sent."
                    : ""}
              </p>
            </form>

            <div className="flex min-h-[calc(48.6*var(--u))] items-center justify-between gap-[16px] max-[599px]:flex-col max-[599px]:items-start">
              <p className="m-0 text-[length:var(--cs)] leading-[1.3] font-normal tracking-[-0.04em] text-white">
                Not Interested in Submitting the Form?
              </p>
              <Link
                href={callHref}
                className="text-[length:var(--ks)] leading-[1.3] font-normal tracking-[-0.04em] whitespace-nowrap text-[#E71117] underline decoration-1 underline-offset-[4px] transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-[#ff1e2d]"
              >
                Book A Call Directly
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}