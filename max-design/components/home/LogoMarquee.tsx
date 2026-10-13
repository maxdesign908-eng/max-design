import Image from "next/image";

/*
  Moving client-logo strip (Figma: 1730 x 114, left 90, top 2220, radius 307, fill #FFFFFF0A).

  - Sequence = the order below (first ten are the order in your design:
    Roche Melgar, Gem & Glam, Jazzba, Higland Manor, Buffloom, Gali's Home, Bestival,
    Hernandez, Carmentis, Brainforce; the rest follow the order of the Logos.zip).
    To change the order, just move lines in this list.
  - Each logo frame is w x 79 (Figma px), 66px gap between frames, centred vertically.
  - The list is rendered twice and slid left by exactly one list width, so the loop is seamless.
  - dy (optional, Figma px) nudges one logo down if its picture sits too high.
  - Hover pauses it; with "reduce motion" on, it stays still.

  Sizes are N * var(--s): 1 Figma px (scales with the page like the hero). On <= 900px the strip is
  full width (same side padding as the hero) with smaller logos.
  Put <LogoMarquee /> right under the hero (after the video). Top gap 51 = 2220 - 2169 (end of hero).
*/
const logos = [
  { name: "Roche Melgar", file: "roche-melgar", w: 262 },
  { name: "Gem & Glam", file: "gem-and-glam", w: 226 },
  { name: "Jazzba", file: "jazzba", w: 180 },
  { name: "Highland Manor", file: "higland-manor", w: 80 },
  { name: "Buffloom", file: "buffloom", w: 180 },
  { name: "Gali's Home", file: "galis-home", w: 164 },
  { name: "Bestival Edition", file: "bestival-edition", w: 131 },
  { name: "Hernandez", file: "hernandez", w: 80 },
  { name: "Carmentis", file: "carmentis", w: 180 },
  { name: "Brainforce Digital", file: "brainforce-digital", w: 180 },
  { name: "Discountiee", file: "discountiee", w: 180 },
  { name: "Chainup Solutions", file: "chainup-soluitons", w: 106 },
  { name: "OperaIQ", file: "operaiq", w: 142 },
  { name: "Ora", file: "ora", w: 112 },
  { name: "Pixelette Technologies", file: "pixelette-technologies", w: 154 },
  { name: "Ossujiyassan", file: "ossujiyassan", w: 199 },
  { name: "SYD'S House Cleaning", file: "syds-house-cleaning", w: 70 },
  { name: "Xloop Cloud", file: "x-loop-cloud", w: 180, dy: 5 },
  { name: "Leafrooms", file: "leafrooms", w: 154 },
  { name: "Kora Constructions", file: "kora", w: 145 },
  { name: "Oh Belly", file: "oh-belly", w: 80 },
  { name: "Fifer Electric", file: "fifer-electric", w: 101 },
  { name: "Jams Wheels on Deals", file: "jams-wheels-on-deals", w: 154 },
];

export default function LogoMarquee() {
  return (
    <section
      aria-label="Brands we have worked with"
      className="@container w-full bg-black"
    >
      <style>{`
        @keyframes logoMarquee {
          to { transform: translateX(-50%); }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1920px] pt-[calc(51*var(--s))] [--s:calc(min(100cqw,1920px)_/_1920)] [@media(max-width:900px)]:pt-[32px] [@media(max-width:900px)]:[--pad:clamp(16px,5vw,96px)] [@media(max-width:900px)]:[--s:clamp(0.45px,calc(100cqw_/_720),0.9px)]">
        {/* The bar */}
        <div className="relative ml-[calc(90*var(--s))] h-[calc(114*var(--s))] w-[calc(1730*var(--s))] overflow-hidden rounded-[calc(307*var(--s))] border border-white/[0.28] bg-[#FFFFFF0A] [@media(max-width:900px)]:ml-[var(--pad)] [@media(max-width:900px)]:w-[calc(100%_-_2_*_var(--pad))]">
          {/* start offset (first logo sits 43 Figma px from the left edge) */}
          <div className="h-full pl-[calc(43*var(--s))]">
            {/* two copies of the list; moving -50% = exactly one list */}
            <ul className="m-0 flex h-full w-max list-none items-center p-0 will-change-transform animate-[logoMarquee_60s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
              {[0, 1].flatMap((copy) =>
                logos.map(({ name, file, w, dy = 0 }) => (
                  <li
                    key={`${copy}-${file}`}
                    aria-hidden={copy === 1 ? true : undefined}
                    className="mr-[calc(66*var(--s))] flex-none"
                    style={{
                      width: `calc(${w} * var(--s))`,
                      height: "calc(79 * var(--s))",
                      // optical fix: moves one logo down (Figma px), e.g. Xloop Cloud sat slightly high
                      transform: dy ? `translateY(calc(${dy} * var(--s)))` : undefined,
                    }}
                  >
                    <Image
                      src={`/images/logos/${file}.webp`}
                      alt={copy === 1 ? "" : name}
                      width={w}
                      height={79}
                      unoptimized
                      loading="eager"
                      draggable={false}
                      className="block h-full w-full object-contain select-none"
                    />
                  </li>
                )),
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}