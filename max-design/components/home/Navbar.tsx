"use client";

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { useEffect, useState } from "react";
import CtaButton from "../home/CtaButton";

const designFont = localFont({
  src: "../../app/fonts/Poppins-ExtraLight.woff2",
  weight: "200",
  style: "normal",
  display: "swap",
});

const links = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "About", href: "#about" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const desktop = window.matchMedia("(min-width: 901px)");
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onChange);

    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div className="@container w-full bg-black [--u:calc(min(100cqw,1920px)_/_1920)] [--k:var(--u)] [@media(max-width:900px)]:[--k:1px]">
      <header className="relative z-[1] w-full">
        <div className="mx-auto box-border flex h-[calc(98*var(--k))] w-[calc(1728*var(--k))] items-center justify-between py-[calc(21*var(--k))] [@media(max-width:900px)]:h-[72px] [@media(max-width:900px)]:w-[min(1728px,100%_-_2_*_clamp(16px,5vw,96px))] [@media(max-width:900px)]:py-[12px]">

          {/* Logo */}
          <Link
            href="/"
            aria-label="MAX design — home"
            onClick={() => setOpen(false)}
            className="@container relative block h-[calc(43*var(--k))] w-[calc(159.59*var(--k))] flex-none [@media(max-width:900px)]:aspect-[159.59/43] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-[clamp(120px,34vw,160px)]"
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

          {/* Navigation */}
          <nav
            id="primary-nav"
            aria-label="Primary"
            className={`[@media(max-width:900px)]:absolute [@media(max-width:900px)]:top-full [@media(max-width:900px)]:right-0 [@media(max-width:900px)]:left-0 [@media(max-width:900px)]:z-10 [@media(max-width:900px)]:border-t [@media(max-width:900px)]:border-white/10 [@media(max-width:900px)]:bg-black [@media(max-width:900px)]:px-[clamp(16px,5vw,96px)] [@media(max-width:900px)]:pt-[4px] [@media(max-width:900px)]:pb-[28px] ${
              open
                ? "[@media(max-width:900px)]:block"
                : "[@media(max-width:900px)]:hidden"
            }`}
          >
            <ul className="m-0 flex list-none gap-[calc(97*var(--k))] p-0 [@media(max-width:900px)]:flex-col [@media(max-width:900px)]:gap-0">
              {links.map(({ label, href }) => (
                <li
                  key={href}
                  className="[@media(max-width:900px)]:border-b [@media(max-width:900px)]:border-white/10"
                >
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="inline-block pb-[calc(2*var(--k))] text-[length:calc(18*var(--k))] leading-[normal] font-normal text-white whitespace-nowrap no-underline transition-[color] duration-200 ease-[ease] [&:hover]:text-(color:--color-accent) [@media(max-width:900px)]:block [@media(max-width:900px)]:py-[16px] [@media(max-width:900px)]:text-[length:22px]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <CtaButton
              href="#contact"
              label="Book a Consultation"
              width={239}
              className="mt-[24px] [@media(min-width:561px)]:hidden [@media(max-width:560px)]:w-full"
            />
          </nav>

          {/* Desktop / tablet CTA */}
          <CtaButton
            href="#contact"
            label="Book a Consultation"
            width={239}
            className="[@media(max-width:900px)]:mr-[12px] [@media(max-width:900px)]:ml-auto [@media(max-width:560px)]:hidden"
          />

          {/* Mobile menu toggle */}
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
              className={`block h-[2px] w-[26px] bg-white transition-transform duration-200 ${
                open ? "translate-y-[4px] rotate-45" : ""
              }`}
            />

            <span
              aria-hidden="true"
              className={`block h-[2px] w-[26px] bg-white transition-transform duration-200 ${
                open ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>
    </div>
  );
}