import Image from "next/image";
import Link from "next/link";

/*
  Footer: big "MAXdesign" wordmark, link columns, moving logo, copyright.
  Figma frame: 1921 x 880 (page top 11877.17), plus 80 of empty space above the wordmark (--top).

  HOW IT SCALES (same system as the other blocks)
  - Page 900px and wider: the Figma layout, scaled. Every size is N * var(--u),
    where 1 --u = 1 Figma px, so everything shrinks smoothly (and stops growing at 1920).
    Text has a minimum size so it stays readable on tablets.
  - Page 899px and narrower: the wordmark fills the width, link columns sit in a grid,
    the moving logo goes under them.
  - --u uses cqw (the width of the <section>) and not vw, so a scrollbar never causes sideways scroll.

  Numbers taken from your Figma values (positions are inside the 880 high frame; the copyright line and the frame height move down by --ext
  because Company now has 7 links, the design has 4):
    MAX picture ..... left 97, 818 wide (your 819 x 205 export, converted to webp)
    "design" ........ Poppins ExtraLight 311.96, line-height 100%, tracking -8%, left 916.84
    divider ......... top 351, left 95, 1727 wide, 1px, white 26%
    column titles ... top 406, Poppins Regular 32 / 39, tracking -8%, left 97 / 366 / 600
    links ........... top 477, Poppins Regular 24 / 36, 16 apart, white 50%, tracking -8%
    social icons .... top 530, 25 x 25, 6 apart
    copyright ....... top 795, Poppins 16 (Bold "max" + Regular), tracking -8%

  FONT: the "design" word needs Poppins weight 200 (ExtraLight). With next/font:
      Poppins({ subsets: ["latin"], weight: ["200", "300", "400", "500", "700"] })
  VIDEO: /videos/logo.mp4 is the same file as in the About section.
*/

const COMPANY = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Protfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/maxdesignagency/", icon: "in" },
  { label: "Facebook", href: "https://www.facebook.com/maxdesignsinnovation/", icon: "f" },
  { label: "Instagram", href: "https://www.instagram.com/maxdesign908/", icon: "ig" },
  { label: "Behance", href: "#", icon: "https://www.behance.net/maxdesignagency" },
] as const;

const CSS = `
  .ft {
    --u: calc(min(100cqw, 1920px) / 1920);
    --pad: 0px;
    --top: calc(80 * var(--u));                      /* empty space above the wordmark */
    --ext: calc(156 * var(--u));                     /* extra height for the 7 links in Company (3 more than the design: 3 x 52) */
    --m: var(--u);                                   /* wordmark unit */
    --h: max(20px, calc(32 * var(--u)));             /* column titles */
    --hl: max(26px, calc(39 * var(--u)));
    --l: max(15px, calc(24 * var(--u)));             /* links */
    --ll: max(24px, calc(36 * var(--u)));
    --c: max(12px, calc(16 * var(--u)));             /* copyright */
    --i: max(22px, calc(25 * var(--u)));             /* social icon */
    position: relative;
    isolation: isolate;
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
    height: calc(880 * var(--u) + var(--top) + var(--ext));
    overflow: hidden;
    background: #000;
    color: #fff;
    font-family: var(--font-poppins), Poppins, system-ui, sans-serif;
  }
  .ft, .ft * { box-sizing: border-box; }
  .ft ul { list-style: none; margin: 0; padding: 0; }
  .ft a { color: inherit; text-decoration: none; }

  /* wordmark: MAX picture + the word "design" */
  .ft-mark { position: absolute; top: var(--top); left: calc(97 * var(--m)); width: calc(1724 * var(--m)); height: calc(290 * var(--m)); }
  .ft-max { position: absolute; top: calc(1 * var(--m)); left: 0; width: calc(818 * var(--m)); height: calc(204.7 * var(--m)); }
  .ft-max img { display: block; width: 100%; height: 100%; }
  .ft-design {
    position: absolute; top: calc(-63 * var(--m)); left: calc(819.84 * var(--m));
    margin: 0; font-size: calc(311.96 * var(--m)); line-height: 1; font-weight: 200;
    letter-spacing: -0.08em; white-space: nowrap; color: #fff;
  }

  .ft-line { position: absolute; top: calc(351 * var(--u) + var(--top)); left: calc(95 * var(--u)); width: calc(1727 * var(--u)); height: 1px; background: rgba(255,255,255,0.26); }

  .ft-col { position: absolute; top: calc(407 * var(--u) + var(--top)); }
  .ft-col h2 { margin: 0; font-size: var(--h); line-height: var(--hl); height: var(--hl); font-weight: 400; letter-spacing: -0.08em; white-space: nowrap; }
  .ft .ft-body { margin-top: max(10px, calc(31 * var(--u))); display: flex; flex-direction: column; gap: max(10px, calc(16 * var(--u))); }
  .ft a.ft-link { display: block; font-size: var(--l); line-height: var(--ll); font-weight: 400; letter-spacing: -0.08em; color: rgba(255,255,255,0.5); white-space: nowrap; transition: color .25s; }
  .ft a.ft-link:hover, .ft a.ft-link:focus-visible { color: #fff; outline: none; }
  .ft-addr { margin: 0; font-style: normal; font-size: var(--l); line-height: max(22px, calc(35 * var(--u))); font-weight: 400; letter-spacing: -0.08em; color: rgba(255,255,255,0.5); }
  .ft-addr span { display: block; white-space: nowrap; }

  .ft-soc { display: flex; gap: max(5px, calc(6 * var(--u))); margin: 0; }
  .ft-soc a { display: grid; place-items: center; width: var(--i); height: var(--i); border-radius: max(3px, calc(4 * var(--u))); background: #E71117; transition: background .25s; }
  .ft-soc a:hover, .ft-soc a:focus-visible { background: #ff1e2d; outline: none; }
  .ft-soc svg { width: 62%; height: 62%; display: block; }

  /* moving logo (same video + blend as the About section) */
  .ft-logo { position: absolute; top: calc(397 * var(--u) + var(--top)); left: calc(1372 * var(--u)); width: calc(300 * var(--u)); height: calc(300 * var(--u)); object-fit: contain; mix-blend-mode: screen; pointer-events: none; z-index: 1; }

  .ft-copy { position: absolute; top: calc(795 * var(--u) + var(--top) + var(--ext)); left: calc(95 * var(--u)); margin: 0; height: calc(24 * var(--u)); min-height: 20px; display: flex; align-items: center; font-size: var(--c); line-height: 1; letter-spacing: -0.08em; font-weight: 400; white-space: nowrap; }
  .ft-copy b { font-weight: 700; }

  .ft a:focus-visible { outline: 2px solid #ff1e2d; outline-offset: 3px; }

  @media (max-width: 899px) {
    /* no white strip under the footer when the phone browser bar / overscroll shows the page background */
    html { background: #000; }
    .ft {
      --pad: clamp(16px, 5cqw, 48px);
      --top: 0px;
      --ext: 0px;
      --m: calc((100cqw - 2 * var(--pad)) / 1724);
      --h: 20px; --hl: 28px; --l: 16px; --ll: 26px; --c: 13px; --i: 28px;
      height: auto;
      padding: max(40px, calc(80 * var(--m))) var(--pad) 40px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 24px;
      row-gap: 32px;
      align-content: start;
    }
    .ft-mark { position: relative; left: 0; width: 100%; height: calc(290 * var(--m)); grid-column: 1 / -1; }
    .ft-line { position: static; width: 100%; grid-column: 1 / -1; }
    .ft-col { position: static; }
    .ft-mark { grid-row: 1; }
    .ft-line { grid-row: 2; }
    nav.ft-col { grid-column: 1; grid-row: 3; }
    .ft-col:not(.ft-where):not(nav) { grid-column: 2; grid-row: 3; }
    .ft .ft-body { margin-top: 12px; gap: 8px; }
    .ft-col.ft-where { grid-column: 1 / -1; grid-row: 4; }
    .ft-addr { line-height: 26px; }
    .ft-addr span { white-space: normal; }
    .ft-soc { margin-top: 4px; }
    .ft-logo { position: relative; top: auto; left: auto; width: 100%; max-width: 160px; height: auto; aspect-ratio: 1; grid-column: 2; grid-row: 4; justify-self: end; align-self: center; margin: 0; }
    .ft-copy { position: static; grid-column: 1 / -1; height: auto; margin-top: 8px; grid-row: 5; }
  }
`;

function Glyph({ name }: { name: (typeof SOCIALS)[number]["icon"] }) {
  const common = { fill: "none", stroke: "#fff", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  switch (name) {
    case "in":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" {...common} />
          <path d="M5 7v4.5M5 4.7v.1M8 11.5V7m0 2c0-1.2.8-2 2-2s1.5.8 1.5 2v2.5" {...common} />
        </svg>
      );
    case "f":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M9.6 14.5V8.6h2l.3-2.3H9.6V5c0-.7.2-1.1 1.1-1.1h1.3V1.8c-.2 0-1-.1-1.8-.1-1.8 0-3 1.1-3 3.1v1.5H5.2v2.3h2v5.9z" fill="#fff" />
        </svg>
      );
    case "ig":
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <rect x="1.8" y="1.8" width="12.4" height="12.4" rx="3.6" {...common} />
          <circle cx="8" cy="8" r="2.9" {...common} />
          <circle cx="11.7" cy="4.3" r=".6" fill="#fff" stroke="#fff" strokeWidth=".6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <text x="8" y="11.6" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#fff" fontFamily="Poppins, Arial, sans-serif">Bē</text>
        </svg>
      );
  }
}

export default function Footer() {
  return (
    <footer id="footer" className="@container w-full bg-black">
      <style>{CSS}</style>

      <div className="ft">
        {/* wordmark: MAX picture + "design" */}
        <div className="ft-mark" aria-label="Max Design" role="img">
          <div className="ft-max" aria-hidden="true">
            <Image src="/images/footer/max.webp" alt="" width={819} height={205} unoptimized priority />
          </div>
          <p className="ft-design" aria-hidden="true">design</p>
        </div>

        <div className="ft-line" aria-hidden="true" />

        <nav className="ft-col" style={{ left: "calc(97 * var(--u))" }} aria-label="Company">
          <h2>Company</h2>
          <ul className="ft-body">
            {COMPANY.map((l) => (
              <li key={l.label}>
                <Link className="ft-link" href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ft-col" style={{ left: "calc(366 * var(--u))" }}>
          <h2>Portfolio</h2>
          <div className="ft-body">
            <Link className="ft-link" href="/portfolio">Our work</Link>
            <ul className="ft-soc">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    <Glyph name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ft-col ft-where" style={{ left: "calc(600 * var(--u))" }}>
          <h2>Lahore</h2>
          <div className="ft-body">
            <address className="ft-addr">
              <span>5th floor,  21, Block J 3</span>
              <span>Phase 2 , Global</span>
              <span>Heights, Johar Town,</span>
              <span>Lahore</span>
            </address>
            <a className="ft-link" href="tel:+92334901842">+92 334 90 1842</a>
          </div>
        </div>

        {/* the moving logo: same video and blend mode as the About section */}
        <video
          className="ft-logo"
          src="/videos/logo.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />

        <p className="ft-copy">
          <b>max</b>design | 2026. All rights reserved
        </p>
      </div>
    </footer>
  );
}