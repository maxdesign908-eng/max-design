"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import CtaButton from "./CtaButton";

/* "design" word of the logo: Poppins ExtraLight (Figma weight "ExtraLight"). */
const designFont = localFont({
  src: "../app/fonts/Poppins-ExtraLight.woff2",
  weight: "200",
  style: "normal",
  display: "swap",
});

const links = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
];

/*
  Figma navbar frame: 1728 x 98, left 96, padding 21px 0, justify space-between.
    - logo group: 159.59 x 43 = MAX mark (png) + "design" text (Poppins ExtraLight 28.76px, -8%)
    - links: gap 97
    - CTA: 239 x 56
  Desktop (> 900px): every size is N * var(--k) so the bar scales together with the hero.
  Mobile / tablet (<= 900px): 72px bar, fluid logo (34vw, 120-160px), links + CTA move
  into a full-width menu opened by the toggle. On phones (<= 560px) the CTA lives in the menu.
*/
export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close the menu with Esc, and when the screen grows back to desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 901px)");
    const onChange = () => desktop.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <header className="relative z-[1] w-full">
      <div className="mx-auto box-border flex h-[calc(98*var(--k,1px))] w-[calc(1728*var(--k,1px))] items-center justify-between py-[calc(21*var(--k,1px))] [@media(max-width:900px)]:h-[72px] [@media(max-width:900px)]:w-[min(1728px,100%_-_2_*_clamp(16px,5vw,96px))] [@media(max-width:900px)]:py-[12px]">
        {/*
          Logo group (159.59 x 43). Everything inside is in % / cqw of the group, so the logo
          scales as one piece: MAX mark 75.43 x 22.74 at top 9.18, "design" box 84 x 43 at left 75.59.
          Mobile: width clamp(120px, 34vw, 160px), height follows the 159.59 : 43 ratio.
        */}
        <Link
          href="/"
          className="@container relative block h-[calc(43*var(--k,1px))] w-[calc(159.59*var(--k,1px))] flex-none [@media(max-width:900px)]:aspect-[159.59/43] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-[clamp(120px,34vw,160px)]"
          aria-label="MAX design — home"
        >
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={76}
            height={23}
            priority
            className="absolute top-[21.35%] left-0 block h-[52.88%] w-[47.264%]"
          />
          <span
            className={`${designFont.className} absolute top-0 left-[47.363%] flex h-full w-[52.634%] items-center text-[length:18.022cqw] leading-none tracking-[-0.08em] whitespace-nowrap text-white`}
          >
            design
          </span>
        </Link>

        <nav
          id="primary-nav"
          aria-label="Primary"
          className={`[@media(max-width:900px)]:absolute [@media(max-width:900px)]:top-full [@media(max-width:900px)]:right-0 [@media(max-width:900px)]:left-0 [@media(max-width:900px)]:z-10 [@media(max-width:900px)]:border-t [@media(max-width:900px)]:border-white/10 [@media(max-width:900px)]:bg-black [@media(max-width:900px)]:px-[clamp(16px,5vw,96px)] [@media(max-width:900px)]:pt-[4px] [@media(max-width:900px)]:pb-[28px] ${
            open ? "[@media(max-width:900px)]:block" : "[@media(max-width:900px)]:hidden"
          }`}
        >
          <ul className="m-0 flex list-none gap-[calc(97*var(--k,1px))] p-0 [@media(max-width:900px)]:flex-col [@media(max-width:900px)]:gap-0">
            {links.map(({ label, href }) => (
              <li key={href} className="[@media(max-width:900px)]:border-b [@media(max-width:900px)]:border-white/10">
                <a
                  href={href}
                  className="inline-block pb-[calc(2*var(--k,1px))] text-[length:calc(18*var(--k,1px))] leading-[normal] font-normal text-white whitespace-nowrap no-underline transition-[color] duration-200 ease-[ease] [&:hover]:text-(color:--color-accent) [@media(max-width:900px)]:block [@media(max-width:900px)]:py-[16px] [@media(max-width:900px)]:text-[length:22px]"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Phones only: the bar has no room for the CTA, so it sits at the bottom of the menu. */}
          <CtaButton
            href="#contact"
            label="Book a Consultation"
            width={239}
            className="mt-[24px] [@media(min-width:561px)]:hidden [@media(max-width:560px)]:w-full"
          />
        </nav>

        <CtaButton
          href="#contact"
          label="Book a Consultation"
          width={239}
          className="[@media(max-width:900px)]:mr-[12px] [@media(max-width:900px)]:ml-auto [@media(max-width:560px)]:hidden"
        />

        <button
          type="button"
          className="hidden cursor-pointer border-0 bg-transparent [@media(max-width:560px)]:ml-auto [@media(max-width:900px)]:inline-flex [@media(max-width:900px)]:h-[44px] [@media(max-width:900px)]:w-[44px] [@media(max-width:900px)]:flex-col [@media(max-width:900px)]:items-center [@media(max-width:900px)]:justify-center [@media(max-width:900px)]:gap-[6px]"
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            aria-hidden="true"
            className={`block h-[2px] w-[26px] bg-white transition-transform duration-200 ${open ? "translate-y-[4px] rotate-45" : ""}`}
          />
          <span
            aria-hidden="true"
            className={`block h-[2px] w-[26px] bg-white transition-transform duration-200 ${open ? "-translate-y-[4px] -rotate-45" : ""}`}
          />
        </button>
      </div>
    </header>
  );
}