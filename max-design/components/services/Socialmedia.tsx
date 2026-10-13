import Image from "next/image";

/*
  Brand Design service page (Figma 1920 wide). Everything below the navbar.

  Desktop (> 900px): every size is N * var(--u), 1 Figma px (scales with the page, capped at 1920).
  Tablet / phone (<= 900px): fluid sizes with clamp(), cards in 2 / 1 columns.

  Vertical layout from your Figma numbers (page y):
    navbar 0-98 | heading row 278-399 | hero 435-1235 (1920 x 800, picture 1920 x 1279.8 shifted -110)
    intro paragraph 1271-1463 | "Our Expertise" 1553 | paragraph 1623 | tags 1791 / 1851
    "How We Work" 2003 | paragraph 2111 | 4 step cards 2287-2646 (413.5 x 358.78, gap 24)
*/

const STEPS = [
  { n: "01", title: "Discover", lines: ["Understand your brand, audience,", "goals, and market."] },
  { n: "02", title: "Strategize", lines: ["Define your brand positioning, personality,", "and creative direction."] },
  { n: "03", title: "Design", lines: ["Create a distinctive visual identity built", "around your brand."] },
  { n: "04", title: "Launch & Refine", lines: ["Polish every detail and deliver a", "complete brand system."] },
];

const TAGS: string[][] = [
  ["Brand strategy & positioning", "Logo & visual identity design", "Typography & color systems", "Brand guidelines", "Brand Pitch Decks"],
  ["Business stationery & brand collateral", "Social media & marketing assets", "Packaging & product identity", "Presentation Slides"],
];

/* the red rounded badge (same shape as your cursor), traced from Figma, 13.48deg, 2.989x */
const BADGE =
  "M3.37 8.65A5.21 5.21 0 0 0 0.55 15.86L8.05 30.85A6.37 6.37 0 0 0 14.26 34.35L31.35 32.99A5.3 5.3 0 0 0 36.16 26.9L32.69 4.56A5.39 5.39 0 0 0 25.46 0.34Z";

/* side padding of every block: 97 Figma px on desktop, fluid on phones */
const SIDE = "px-[calc(97*var(--u))] [@media(max-width:900px)]:px-[var(--pad)]";

function Star() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 13 13"
      className="mr-[calc(5.5*var(--u))] h-[calc(13*var(--u))] w-[calc(13*var(--u))] flex-none [@media(max-width:900px)]:mr-[6px] [@media(max-width:900px)]:h-[12px] [@media(max-width:900px)]:w-[12px]"
    >
      <path
        fill="currentColor"
        d="M6.5 0C6.9 3.6 9.4 6.1 13 6.5C9.4 6.9 6.9 9.4 6.5 13C6.1 9.4 3.6 6.9 0 6.5C3.6 6.1 6.1 3.6 6.5 0Z"
      />
    </svg>
  );
}

export default function Socialmedia() {
  return (
    <div className="@container w-full bg-black text-white">
      <div className="mx-auto w-full max-w-[1920px] [--k:var(--u)] [--u:calc(min(100cqw,1920px)_/_1920)] [@media(max-width:900px)]:[--k:1px] [@media(max-width:900px)]:[--pad:clamp(16px,5vw,96px)]">

        <main>
          {/* ───────── heading row (1727 x 121, divider line at the bottom) ───────── */}
          <section
            className={`${SIDE} mt-[calc(180*var(--u))] [@media(max-width:900px)]:mt-[32px]`}
          >
            <div className="relative flex h-[calc(121*var(--u))] items-start border-b border-white/[0.26] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:items-center [@media(max-width:900px)]:justify-between [@media(max-width:900px)]:gap-[16px] [@media(max-width:900px)]:pb-[22px]">
              <h1 className="m-0 w-[calc(1136*var(--u))] text-[length:calc(80*var(--u))] leading-[0.96] font-medium tracking-[-0.08em] text-white [@media(max-width:900px)]:w-auto [@media(max-width:900px)]:text-[length:clamp(30px,7.4vw,64px)] [@media(max-width:900px)]:leading-[1.08]">
                Build A Brand People Remember.
              </h1>
              <Image
                src="/images/services/chrome-shape.webp"
                alt=""
                width={260}
                height={259}
                unoptimized
                priority
                className="absolute top-[calc(-14*var(--u))] left-[calc(1620.5*var(--u))] block h-[calc(106.2*var(--u))] w-[calc(106.6*var(--u))] [@media(max-width:900px)]:static [@media(max-width:900px)]:h-[clamp(52px,12vw,96px)] [@media(max-width:900px)]:w-[clamp(52px,12vw,96px)] [@media(max-width:900px)]:flex-none"
              />
            </div>
          </section>

          {/* ───────── hero picture (1920 x 800, picture shifted up 110) ───────── */}
          <div className="relative mt-[calc(36*var(--u))] h-[calc(800*var(--u))] w-full overflow-hidden [@media(max-width:900px)]:mt-[28px] [@media(max-width:900px)]:h-[clamp(230px,68vw,520px)]">
            <Image
              src="/images/services/social-media-hero.webp"
              alt="Golden Blood hair care brand identity and packaging"
              width={2576}
              height={1717}
              unoptimized
              priority
              className="absolute top-[calc(-280*var(--u))] left-0 block h-auto w-full [@media(max-width:900px)]:top-0 [@media(max-width:900px)]:h-full [@media(max-width:900px)]:object-cover [@media(max-width:900px)]:object-[50%_55%]"
            />
          </div>

          {/* ───────── intro paragraph ───────── */}
          <p
            className={`${SIDE} m-0 mt-[calc(36*var(--u))] text-[length:calc(32*var(--u))] leading-[1.5] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:mt-[32px] [@media(max-width:900px)]:text-[length:clamp(17px,4.4vw,28px)]`}
          >
            We build distinctive brand identities that give businesses a clear voice, a memorable
            visual presence, and a strong foundation for growth. From brand strategy and positioning
            to logo design, visual systems, and brand guidelines, every element is carefully crafted
            to make your brand feel consistent, intentional, and recognizable across every
            touchpoint.
          </p>

          {/* ───────── Our Expertise ───────── */}
          <section className={`${SIDE} mt-[calc(90*var(--u))] [@media(max-width:900px)]:mt-[56px]`}>
            <h2 className="m-0 h-[calc(70*var(--u))] text-[length:calc(48*var(--u))] leading-[calc(72*var(--u))] font-medium tracking-[-0.08em] text-[#E71117] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:text-[length:clamp(30px,7vw,44px)] [@media(max-width:900px)]:leading-[1.2]">
              Our Expertise
            </h2>
            <p className="m-0 text-[length:calc(24*var(--u))] leading-[2] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:mt-[14px] [@media(max-width:900px)]:text-[length:clamp(16px,4vw,22px)] [@media(max-width:900px)]:leading-[1.6]">
              Our Brand Design service is focused on creating identities that look distinctive,
              communicate clearly, and connect with the right audience. We combine strategy and
              visual design to build brands that are not only visually strong, but also meaningful
              and practical. From defining your brand direction to creating the final visual system,
              every detail is designed to give your business a confident and consistent presence.
            </p>

            <div className="mt-[calc(24*var(--u))] flex flex-col gap-[calc(28*var(--u))] [@media(max-width:900px)]:mt-[24px] [@media(max-width:900px)]:gap-[12px]">
              {TAGS.map((row, i) => (
                <ul
                  key={i}
                  className="m-0 flex list-none flex-wrap gap-x-[calc(24*var(--u))] gap-y-[12px] p-0 [@media(max-width:900px)]:gap-x-[20px]"
                >
                  {row.map((tag) => (
                    <li
                      key={tag}
                      className="flex h-[calc(32*var(--u))] items-center text-[length:calc(16*var(--u))] leading-[calc(32*var(--u))] tracking-[-0.04em] whitespace-nowrap text-white/[0.48] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:text-[length:clamp(13px,3.4vw,16px)] [@media(max-width:900px)]:leading-[1.6]"
                    >
                      <Star />
                      {tag}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </section>

          {/* ───────── How We Work ───────── */}
          <section className={`${SIDE} mt-[calc(120*var(--u))] pb-[calc(120*var(--u))] [@media(max-width:900px)]:mt-[72px] [@media(max-width:900px)]:pb-[72px]`}>
            <h2 className="m-0 text-center text-[length:calc(80*var(--u))] leading-[1.12] font-medium tracking-[-0.04em] text-white [@media(max-width:900px)]:text-[length:clamp(36px,10vw,64px)]">
              How We Work
            </h2>
            <p className="mx-auto mt-[calc(18.2*var(--u))] mb-0 w-[calc(1300*var(--u))] max-w-full text-center text-[length:calc(32*var(--u))] leading-[1.5] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:mt-[16px] [@media(max-width:900px)]:w-full [@media(max-width:900px)]:text-[length:clamp(16px,4.2vw,24px)]">
              Our brand design process combines strategy, creativity, and thoughtful execution to
              create distinctive identities aligned with your business, audience, and goals.
            </p>

            <ol className="m-0 mt-[calc(80*var(--u))] grid list-none grid-cols-4 gap-[calc(24*var(--u))] p-0 [@media(max-width:900px)]:mt-[36px] [@media(max-width:900px)]:grid-cols-2 [@media(max-width:900px)]:gap-[16px] [@media(max-width:560px)]:grid-cols-1">
              {STEPS.map(({ n, title, lines }) => (
                /* each card is a container: all its inner sizes are N * var(--cu) = card width / 413.5 */
                <li
                  key={n}
                  className="@container relative aspect-[413.5/358.78] min-w-0 rounded-[10px] bg-white/[0.047] shadow-[inset_0_-6px_10px_-6px_rgba(255,255,255,0.10)]"
                >
                  {/* outline: a little brighter along the top */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[10px] border border-white/[0.31] border-t-white/[0.44]"
                  />

                  <div className="absolute inset-0 [--cu:calc(100cqw_/_413.5)]">
                    {/* badge */}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 413.5 358.78"
                      preserveAspectRatio="none"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    >
                      <path
                        d={BADGE}
                        fill="#E71117"
                        transform="translate(335.08 77.44) rotate(13.48) scale(2.989) translate(-19.01 -19.258)"
                      />
                    </svg>

                    <span className="absolute top-[calc(47*var(--cu))] left-[calc(315*var(--cu))] flex h-[calc(50*var(--cu))] w-[calc(49*var(--cu))] items-center justify-center text-[length:calc(49.66*var(--cu))] leading-none font-medium tracking-[-0.01em] text-white">
                      {n}
                    </span>

                    <h3 className="absolute top-[calc(228.3*var(--cu))] left-[calc(19*var(--cu))] m-0 flex h-[calc(36*var(--cu))] items-center text-[length:calc(48*var(--cu))] leading-[calc(36*var(--cu))] font-medium tracking-[-0.0833em] whitespace-nowrap text-white">
                      {title}
                    </h3>

                    <p className="absolute top-[calc(281*var(--cu))] left-[calc(19*var(--cu))] m-0 text-[length:calc(18*var(--cu))] leading-[1.7] tracking-[-0.0444em] whitespace-nowrap text-white/[0.37]">
                      {lines.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </main>
      </div>
    </div>
  );
}
