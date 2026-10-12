import Image from "next/image";
import type { CSSProperties } from "react";
import CtaButton from "./CtaButton";

/*
  "Our Workfolio" block. Figma: 1726 wide, left 97 on the 1920 page (block height 3425.17).

  HOW IT SCALES
  - Page 768px and wider: the Figma layout, scaled. Every size is N * var(--u), where
    1 --u = 1 Figma px, so the block shrinks smoothly with the page (and stops growing at 1920).
    Text has a minimum size so it stays readable on tablets.
  - Page 767px and narrower: one column, centred, each card at most 640px wide.
    Sizes switch to clamp() so they follow the screen width.
  - --u uses cqw (the width of the <section>) and not vw, so a scrollbar never causes sideways scroll.
  - --k is the unit CtaButton uses: = --u on large screens, 1px on small ones.

  Vertical rhythm (Figma px, taken from your numbers):
    space above the heading 108 (so it does not touch the section above)
    heading frame 236  ->  80  ->  row 1 cards (803)  ->  42.79  ->  title (45)  ->  84
    ->  row 2 cards (876 / 875)  ->  42.79  ->  title (45)  ->  98.35  ->  banner (802.31)
    ->  42.79  ->  title (45)  ->  126  ->  "View All Projects" button (56)

  The card images are your exported frames: the white tag, the rounded corners (14px) and the
  0.53px white outline are already inside the image files, so every card keeps its exact
  aspect ratio (never use object-cover here, it would cut the tag).
*/

type Work = {
  title: string;
  tags: string;
  src: string;
  w: number; // Figma width
  h: number; // Figma height
  titleShift?: number; // Figma px the title sits left of the card (OH BELLY: -2)
};

const row1: Work[] = [
  { title: "JAMSWHEELS ON DEALS", tags: "Social Media, Web Development, Branding", src: "jamswheels-on-deals", w: 559, h: 803 },
  { title: "ROCHE MELGAR", tags: "Social Media, Branding, AI Visuals", src: "roche-melgar", w: 560, h: 803 },
  { title: "OH BELLY", tags: "Branding Identity", src: "oh-belly", w: 559, h: 803, titleShift: -2 },
];
const row2: Work[] = [
  { title: "LEAFROOMS", tags: "Social Media", src: "leafrooms", w: 851, h: 876.08 },
  { title: "GALI’S HOMES", tags: "Branding Identity", src: "galis-homes", w: 851, h: 875.08 },
];
const banner: Work = {
  title: "BNU (BESTIVAL EDITION)",
  tags: "Event Branding, Social Media",
  src: "bnu-bestival-edition",
  w: 1726,
  h: 802.31,
};

/* All the sizes of this block live here, so the class names below stay short. */
const CSS = `
  .wf {
    --u: calc(min(100cqw, 1920px) / 1920);
    --k: var(--u);
    --hs: max(40px, calc(80 * var(--u)));   /* heading */
    --ts: calc(48 * var(--u));              /* project titles */
    --pad: 0px;
  }
  @media (max-width: 767px) {
    .wf {
      --k: 1px;
      --hs: clamp(40px, 11.5cqw, 72px);
      --ts: clamp(22px, 7cqw, 40px);
      --pad: clamp(16px, 5cqw, 48px);
    }
  }
  @keyframes workArrowVibrate {
    from { transform: translateY(-0.03em); }
    to   { transform: translateY(0.03em); }
  }
`;

/* one project: picture on top, big uppercase name under it */
function Project({ work }: { work: Work }) {
  const { title, tags, src, w, h, titleShift = 0 } = work;
  return (
    <article className="group mx-auto w-full min-w-0 max-[767px]:max-w-[640px]">
      <div
        className="relative w-full motion-reduce:transition-none [@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-300 [@media(hover:hover)]:ease-out [@media(hover:hover)]:group-hover:-translate-y-[calc(6*var(--u))]"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <Image
          src={`/images/work/${src}.webp`}
          alt={`${title.replace("’", "'")} — ${tags}`}
          width={Math.round(w)}
          height={Math.round(h)}
          unoptimized
          className="block h-full w-full object-fill"
        />

        {/* tag: hidden by default, fades in when the card is hovered (or focused with the keyboard).
            Touch screens have no hover, so there it stays visible. */}
        <span
          className="pointer-events-none absolute top-[calc(42*var(--u))] right-[calc(42.6*var(--u))] flex h-[calc(56*var(--u))] -translate-y-[calc(8*var(--u))] items-center rounded-full border-[0.57px] border-white bg-white pr-[calc(14.9*var(--u))] pl-[calc(14.9*var(--u))] text-[length:max(10px,calc(15*var(--u)))] leading-none font-normal tracking-[-0.04em] whitespace-nowrap text-black opacity-0 transition-[opacity,translate] duration-300 ease-out group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 max-[767px]:top-[14px] max-[767px]:right-[14px] max-[767px]:h-[36px] max-[767px]:pr-[12px] max-[767px]:pl-[12px] max-[767px]:text-[12px]"
        >
          {tags}
        </span>
      </div>
      <h3
        className="m-0 mt-[calc(42.79*var(--u))] ml-[calc(var(--shift,0)*var(--u))] text-[length:var(--ts)] leading-[0.9375] font-medium tracking-[-0.0833em] whitespace-nowrap text-white uppercase max-[767px]:mt-[14px] max-[767px]:ml-0 max-[767px]:whitespace-normal"
        style={{ "--shift": titleShift } as CSSProperties}
      >
        {title}
      </h3>
    </article>
  );
}

/* the 4 small white squares of the "selected text" box around the heading */
const HANDLES = [
  "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
];

export default function Portfolio() {
  return (
    <section
      id="portfolio"
      aria-label="Our Workfolio"
      className="@container w-full overflow-x-clip bg-black"
    >
      <style>{CSS}</style>

      <div className="wf mx-auto w-full max-w-[1920px] px-[calc(97*var(--u))] pt-[calc(108*var(--u))] max-[767px]:px-[var(--pad)] max-[767px]:py-[48px] max-[767px]:pt-[72px]">
        {/* ───────── heading frame (902 x 236) ───────── */}
        <header className="mx-auto flex w-[max(calc(902*var(--u)),min(100%,520px))] flex-col items-center max-[767px]:w-full">
          <h2 className="relative m-0 mt-[0.1875em] w-[6.3125em] max-w-full text-left text-[length:var(--hs)] leading-[1.12] font-medium tracking-[-0.04em] text-white max-[767px]:mt-0">
            Our Workfolio

            {/* "selected text" box: 1px line (white 58%) + 4 white corner squares */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[0.14em] -right-[0.0035em] -bottom-[0.134em] -left-[0.015em] border border-white/[0.58]"
            >
              {HANDLES.map((pos) => (
                <i
                  key={pos}
                  className={`absolute block h-[max(5px,0.106em)] w-[max(5px,0.106em)] bg-white ${pos}`}
                />
              ))}
            </span>

            {/* cursor arrow (arrow + soft shadow are inside the picture), vibrates slightly up / down.
                Placed in em, so it stays on the same letter at every heading size. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-[0.525em] left-[4.23em] block h-[1em] w-[1.0125em] animate-[workArrowVibrate_0.7s_ease-in-out_infinite_alternate] will-change-transform motion-reduce:animate-none"
            >
              <Image
                src="/images/work/cursor-arrow.webp"
                alt=""
                width={81}
                height={80}
                unoptimized
                className="block h-full w-full"
              />
            </span>
          </h2>

          <p className="m-0 mt-[calc(35.4*var(--u))] w-full text-center text-[length:max(16px,calc(32*var(--u)))] leading-[max(1.4em,calc(48*var(--u)))] font-normal tracking-[-0.04em] text-white max-[767px]:mt-[20px] max-[767px]:text-[length:clamp(16px,4.2cqw,24px)] max-[767px]:leading-normal max-[767px]:text-balance">
            Every project is built around a simple idea create something people remember.
          </p>
        </header>

        {/* ───────── row 1: three portrait cards (559 : 560 : 559) ───────── */}
        <div className="mt-[calc(80*var(--u))] grid grid-cols-[559fr_560fr_559fr] items-start gap-x-[calc(24*var(--u))] max-[767px]:mt-[40px] max-[767px]:grid-cols-1 max-[767px]:gap-y-[36px]">
          {row1.map((work) => (
            <Project key={work.src} work={work} />
          ))}
        </div>

        {/* ───────── row 2: two big cards ───────── */}
        <div className="mt-[calc(83.99*var(--u))] grid grid-cols-2 items-start gap-x-[calc(24*var(--u))] max-[767px]:mt-[36px] max-[767px]:grid-cols-1 max-[767px]:gap-y-[36px]">
          {row2.map((work) => (
            <Project key={work.src} work={work} />
          ))}
        </div>

        {/* ───────── banner ───────── */}
        <div className="mt-[calc(98.35*var(--u))] max-[767px]:mt-[36px]">
          <Project work={banner} />
        </div>

        {/* ───────── button ───────── */}
        <div className="mt-[calc(126.07*var(--u))] flex justify-center max-[767px]:mt-[48px]">
          <CtaButton href="#projects" label="View All Projects" width={207} />
        </div>
      </div>
    </section>
  );
}