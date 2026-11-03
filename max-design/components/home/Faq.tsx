"use client";

import { useId, useRef, useState } from "react";
import { faqs as ITEMs } from "@/data/faqs";


/*
  "Good Questions. Clear Answers." block. Figma: left 97 on the 1920 page.

  HOW IT SCALES (same system as the Portfolio block)
  - Page 900px and wider: the Figma layout, scaled. Every size is N * var(--u),
    where 1 --u = 1 Figma px, so the block shrinks smoothly (and stops growing at 1920).
    Text and icon have a minimum size so they stay readable on tablets.
  - Page 899px and narrower: one column, sizes switch to clamp().
  - --u uses cqw (the width of the <section>) and not vw, so a scrollbar never causes sideways scroll.

  Numbers taken from your Figma values and the screenshot:
    heading ........ 660 x 168, Poppins Medium 80 / 112%, tracking -4%
    heading -> grid  45
    question box ... 836 wide, 126 high, radius 14, fill #A5A5A512 (1px faint outline, drawn inside so the box stays exactly 126)
    columns ........ 836 + 48 + 836, rows 40 apart
    red icon ....... 40 round, 43 from the box edge; question text starts 43 after it
    question ....... Poppins Regular 32, tracking -4% (fitted from the screenshot)
    block padding .. 60 above and below (same gap as every other section)

  BEHAVIOUR
  - Mouse: hover a box -> the arrow turns and the box opens; leave -> it closes.
  - Touch / keyboard: tap, Enter or Space toggles. Only one box is open at a time.
  - Arrow turn: ↗ becomes → (45deg). For ↖ change --tilt to -90deg in the CSS below.
*/

type Item = { q: string; a: string };

// Order is row by row: left, right, left, right ...
const ITEMS: Item[] = [
  {
    q: "What services do you offer?",
    a: "We offer Branding, UI/UX, Social media creatives, AI visualization, Video Editing, Web Development and others design solutions.",
  },
  {
    q: "What is your process?",
    a: "We start by understanding your vision, exploring ideas, and turning them into purposeful designs.",
  },
  {
    q: "How long does a project take?",
    a: "Every project is different. Timelines depend on the scope, complexity, and requirements.",
  },
  {
    q: "Do you offer revisions?",
    a: "Yes! Revisions are included based on the agreed scope to make sure the design feels right.",
  },
  {
    q: "How much does a project cost?",
    a: "Pricing depends on the project requirements, complexity, and deliverables.",
  },
  {
    q: "Can you work with international clients?",
    a: "Absolutely! We collaborate remotely with clients from anywhere in the world.",
  },
  {
    q: "Can you help refresh an existing brand?",
    a: "Absolutely! We can give your existing brand a fresh, modern look while keeping its original identity and values intact.",
  },
  {
    q: "How can we start working together?",
    a: "Simply share your ideas and project details, and let's create something that stands out.",
  },
];

/* All the sizes of this block live here, so the class names below stay short. */
const CSS = `
  .faq {
    --u: calc(min(100cqw, 1920px) / 1920);
    --hs: max(40px, calc(80 * var(--u)));        /* heading */
    --qs: max(15px, calc(32 * var(--u)));        /* question text */
    --as: max(14px, calc(24 * var(--u)));        /* answer text */
    --is: max(26px, calc(40 * var(--u)));        /* red round icon */
    --pl: calc(43 * var(--u));                   /* box edge -> icon */
    --ig: calc(43 * var(--u));                   /* icon -> text */
    --pr: calc(32 * var(--u));                   /* right padding */
    --ih: max(64px, calc(126 * var(--u)));       /* closed box height */
    --tilt: 45deg;                               /* arrow turn when open */
    --pull: calc(28 * var(--u));                 /* answer moves up toward the question (smaller gap) */
    --tx: calc(var(--pl) + var(--is) + var(--ig)); /* where the text starts */
  }
  @media (max-width: 899px) {
    .faq {
      --hs: clamp(40px, 11.5cqw, 64px);
      --qs: clamp(16px, 4.6cqw, 22px);
      --as: clamp(14px, 3.9cqw, 18px);
      --is: 32px;
      --pl: 16px;
      --ig: 14px;
      --pr: 16px;
      --ih: 68px;
      --pull: 8px;
    }
  }
`;

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="h-[40%] w-[40%]"
    >
      <path
        d="M12.48 0L13.44 0.99L13.33 1.1C10.56 4.01 10.66 7.98 12.49 9.87L11.52 10.86C10.01 9.3 9.47 6.87 10.01 4.46L1.95 12.64L1 11.65L9.06 3.47C6.7 4 4.34 3.43 2.83 1.87L3.8 0.88C5.65 0.88 9.6 2.92 12.48 0Z"
        fill="white"
      />
    </svg>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const lastPointer = useRef("");
  const uid = useId();

  return (
    <section
      id="faq"
      aria-labelledby={`${uid}-title`}
      className="@container w-full overflow-x-clip bg-black"
    >
      <style>{CSS}</style>

      <div className="faq mx-auto w-full max-w-[1920px] px-[calc(97*var(--u))] pt-[calc(60*var(--u))] pb-[calc(60*var(--u))] max-[899px]:px-[clamp(16px,5cqw,48px)] max-[899px]:pt-[18px] max-[899px]:pb-[18px]">
        {/* ───────── heading (660 x 168) ───────── */}
        <h2
          id={`${uid}-title`}
          className="m-0 text-[length:var(--hs)] leading-[1.12] font-medium tracking-[-0.04em] text-white"
        >
          <span className="block">Good Questions.</span>
          <span className="block">Clear Answers.</span>
        </h2>

        {/* ───────── questions: 2 columns (836 + 48 + 836), rows 40 apart ───────── */}
        <ul className="m-0 mt-[calc(45*var(--u))] grid max-w-[calc(1720*var(--u))] list-none grid-cols-[1fr_1fr] items-start gap-x-[calc(48*var(--u))] gap-y-[calc(40*var(--u))] p-0 max-[899px]:mt-[32px] max-[899px]:max-w-none max-[899px]:grid-cols-1 max-[899px]:gap-y-[14px]">
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${uid}-q${i}`;
            const panelId = `${uid}-a${i}`;

            return (
              <li
                key={item.q}
                data-open={isOpen}
                className="group min-w-0 rounded-[calc(14*var(--u))] bg-[#A5A5A512] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-shadow duration-300 data-[open=true]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setOpen(i);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === "mouse")
                    setOpen((cur) => (cur === i ? null : cur));
                }}
              >
                <h3 className="m-0">
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onPointerDown={(e) => {
                      lastPointer.current = e.pointerType;
                    }}
                    onClick={() => {
                      // a mouse click: the box is already open from hover, keep it open
                      if (lastPointer.current === "mouse") setOpen(i);
                      else setOpen((cur) => (cur === i ? null : i));
                      lastPointer.current = "";
                    }}
                    className="flex min-h-[var(--ih)] w-full cursor-pointer items-center gap-[var(--ig)] rounded-[inherit] bg-transparent py-[12px] pr-[var(--pr)] pl-[var(--pl)] text-left text-[length:var(--qs)] leading-[1.3] font-normal tracking-[-0.04em] text-white outline-none focus-visible:outline-2 focus-visible:-outline-offset-[2px] focus-visible:outline-[#ff1e2d]"
                  >
                    {/* red round icon: the arrow turns when the box is open */}
                    <span className="grid h-[var(--is)] w-[var(--is)] shrink-0 place-items-center rounded-full bg-[#ff1e2d] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[open=true]:scale-110 motion-reduce:transition-none">
                      <span className="grid h-full w-full place-items-center transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-data-[open=true]:rotate-[var(--tilt)] motion-reduce:transition-none">
                        <ArrowIcon />
                      </span>
                    </span>
                    <span className="min-w-0">{item.q}</span>
                  </button>
                </h3>

                {/* answer: height opens smoothly, text rises and fades in (no blur) */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid grid-rows-[0fr] transition-[grid-template-rows,margin] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-data-[open=true]:mt-[calc(-1*var(--pull))] group-data-[open=true]:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="m-0 translate-y-[22px] pr-[calc(var(--pr)_+_12*var(--u))] pb-[calc(38*var(--u))] pl-[var(--tx)] text-[length:var(--as)] leading-[1.5] font-normal text-white/70 opacity-0 transition-[opacity,translate] duration-300 ease-out group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 group-data-[open=true]:duration-[750ms] group-data-[open=true]:ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[open=true]:delay-[140ms] motion-reduce:transition-none max-[899px]:pb-[22px]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}