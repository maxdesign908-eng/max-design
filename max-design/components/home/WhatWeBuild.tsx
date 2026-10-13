"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Service = {
  label: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  href: string;
};

const SERVICES: Service[] = [
  {
    label: "Brand Design",
    title: "Brand Design",
    text: "Everything a growing brand needs under one roof, built by people who actually use this stuff daily.",
    image: "/images/services/brand-design.webp",
    alt: "Golden Blood hair care packaging: boxes, bottles and a tube in dark green",
    href: "/brand-design",
  },
  {
    label: "UI/UX Design",
    title: "UI/UX Design",
    text: "Clear, usable interfaces for apps and products, designed around how people actually use them.",
    image: "/images/services/ui-ux-design.webp",
    alt: "Two phone screens of a rewards app showing points and transactions",
    href: "/ui-ux-design",
  },
  {
    label: "Social Media",
    title: "Social Media",
    text: "Scroll-stopping posts and campaigns that keep your brand consistent on every platform.",
    image: "/images/services/social-media.webp",
    alt: "Three poster designs on a wall about data security",
    href: "/social-media",
  },
  {
    label: "Video Editing",
    title: "Video Editing",
    text: "Sharp, well-paced edits for ads, reels and brand films, from rough cut to final export.",
    image: "/images/services/video-editing.webp",
    alt: "A video editing timeline on a monitor",
    href: "/video-editing",
  },
  {
    label: "AI-Powered Ad Creatives",
    title: "AI-Powered Ad Creatives",
    text: "Fast, eye-catching ad visuals built with AI and finished by designers.",
    image: "/images/services/ai-ad-creatives.webp",
    alt: "A person in an orange robe standing on giant watermelons",
    href: "/ai-ad-creatives",
  },
  {
    label: "Website Design & Development",
    title: "Web design & Development",
    text: "High-performing digital experiences built for modern brands.",
    image: "/images/services/web-development.webp",
    alt: "A laptop showing a finance dashboard",
    href: "/web-development",
  },
];

/* Same hover effect as the CTA button: a red fill rises from the bottom of the pill (no red outline),
   the dot and the arrow circle turn white, the arrow turns red and tilts 45deg. */
function ArrowPill({ active }: { active: boolean }) {
  return (
    <span
      data-active={active}
      className="
        isolate flex h-[calc(50*var(--spacing))]
        w-[calc(88*var(--spacing))]
        shrink-0 items-center justify-between overflow-hidden [contain:layout]
        rounded-full border-[0.57px] border-white/25
        pr-[calc(6*var(--spacing))]
        pl-[calc(16*var(--spacing))]
        max-[820px]:h-[calc(40*var(--spacing))]
        max-[820px]:w-[calc(70*var(--spacing))]
        max-[820px]:pl-[calc(12*var(--spacing))]
      "
    >
      {/* red fill rising from the bottom */}
      <span
        aria-hidden="true"
        data-active={active}
        className="pointer-events-none absolute top-0 left-0 z-0 h-[140%] w-full translate-y-[72%] rounded-[50%_50%_0_0/28%_28%_0_0] bg-[#ff1e2d] transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] data-[active=true]:-translate-y-[28.6%]"
      />

      <i
        data-active={active}
        className="relative z-10 h-7 w-7 shrink-0 rounded-full bg-[#ff1e2d] transition-colors duration-300 data-[active=true]:bg-white max-[820px]:h-6 max-[820px]:w-6"
      />

      <span
        data-active={active}
        className="relative z-10 grid h-[calc(38*var(--spacing))] w-[calc(38*var(--spacing))] shrink-0 place-items-center rounded-full bg-[#ff1e2d] text-white transition-colors duration-300 data-[active=true]:bg-white data-[active=true]:text-[#ff1e2d] max-[820px]:h-[calc(30*var(--spacing))] max-[820px]:w-[calc(30*var(--spacing))]"
      >
        <svg
          data-active={active}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          className="origin-center transition-transform duration-300 ease-out data-[active=true]:rotate-45"
        >
          <path
            d="M12.48 0L13.44 0.99L13.33 1.1C10.56 4.01 10.66 7.98 12.49 9.87L11.52 10.86C10.01 9.3 9.47 6.87 10.01 4.46L1.95 12.64L1 11.65L9.06 3.47C6.7 4 4.34 3.43 2.83 1.87L3.8 0.88C5.65 0.88 9.6 2.92 12.48 0Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </span>
  );
}

export default function WhatWeBuild() {
  const [active, setActive] = useState(0);

  // entrance animation: starts once, when the section is scrolled into view
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
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
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative isolate h-1164 w-full overflow-hidden bg-black text-white max-[820px]:flex max-[820px]:h-auto max-[820px]:flex-col max-[820px]:gap-32 max-[820px]:px-20 max-[820px]:py-48"
    >
      {/* Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-66 left-95 z-0 h-1032 w-1730 max-[820px]:hidden"
      />

      {/* Heading */}
      <div className="absolute top-66 left-[calc(425.5*var(--spacing))] z-10 flex h-204 w-1069 flex-col items-center gap-18 text-center max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:h-auto max-[820px]:w-auto max-[820px]:gap-12">
        <h2 className="h-90 w-1069 text-[calc(80*var(--spacing))] leading-[1.12] font-medium tracking-[-0.04em] max-[820px]:h-auto max-[820px]:w-auto max-[820px]:text-[calc(34*var(--spacing))]">
          <span className="block overflow-hidden">
            <span
              className={`block transition-[translate] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                inView ? "translate-y-0" : "translate-y-[105%]"
              }`}
            >
              What We build
            </span>
          </span>
        </h2>

        <p
          className={`h-56 w-763 transition-[opacity,translate] delay-300 duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            inView ? "translate-y-0 opacity-100" : "translate-y-[calc(24*var(--spacing))] opacity-0"
          } text-[calc(22*var(--spacing))] leading-[calc(28*var(--spacing))] font-normal text-white/90 max-[820px]:h-auto max-[820px]:w-auto max-[820px]:text-[calc(15*var(--spacing))] max-[820px]:leading-[1.6]`}
        >
          Everything a growing brand needs under one roof, built by people who
          actually use this stuff daily.
        </p>
      </div>

      {/* Service list + preview card */}
      <div className="absolute top-350 left-95 z-10 flex h-748 w-1730 gap-36 max-[820px]:relative max-[820px]:top-0 max-[820px]:left-0 max-[820px]:h-auto max-[820px]:w-full max-[820px]:flex-col max-[820px]:gap-24">
        {/* Service list */}
        <ul className="flex h-748 w-788 shrink-0 flex-col rounded-[calc(24*var(--spacing))] bg-black/5 max-[820px]:h-auto max-[820px]:w-full">
          {SERVICES.map((service, i) => {
            const isActive = i === active;
            const isLast = i === SERVICES.length - 1;

            return (
              <li
                key={service.label}
                style={{ transitionDelay: inView ? `${450 + i * 110}ms` : "0ms" }}
                className={`min-h-0 transition-[opacity,translate] duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  inView ? "translate-x-0 opacity-100" : "-translate-x-[calc(40*var(--spacing))] opacity-0"
                } ${
                  isLast ? "flex-[1.2]" : "flex-1"
                } ${isLast ? "" : "border-b border-white/10"}`}
              >
                <Link
                  href={service.href}
                  prefetch={true}
                  data-active={isActive}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="
                    group flex h-full w-full cursor-pointer
                    items-center justify-between gap-24
                    px-[calc(28*var(--spacing))]
                    text-left text-[calc(40*var(--spacing))]
                    leading-[1.1] font-medium tracking-[-0.03em]
                    no-underline text-white
                    transition-colors duration-300
                    hover:bg-white/[0.04]
                    focus-visible:outline-2
                    focus-visible:-outline-offset-2
                    focus-visible:outline-[#ff1e2d]
                    data-[active=true]:bg-white/[0.04]
                    max-[820px]:min-h-[calc(64*var(--spacing))]
                    max-[820px]:px-[calc(16*var(--spacing))]
                    max-[820px]:py-[calc(14*var(--spacing))]
                    max-[820px]:text-[calc(20*var(--spacing))]
                  "
                >
                  <span className="transition-[translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[active=true]:translate-x-[calc(12*var(--spacing))] motion-reduce:transition-none">
                    {service.label}
                  </span>
                  <ArrowPill active={isActive} />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Service preview card */}
        <div
          id="service-card"
          aria-live="polite"
          className={`relative h-748 min-w-0 flex-1 overflow-hidden rounded-[calc(24*var(--spacing))] border border-[#262626] bg-black transition-[opacity,translate] delay-500 duration-[1000ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none max-[820px]:h-auto max-[820px]:flex-none max-[820px]:p-16 ${
            inView ? "translate-y-0 opacity-100" : "translate-y-[calc(40*var(--spacing))] opacity-0"
          }`}
        >
          {/* Title + subtitle */}
          <div className="absolute top-46 right-24 left-24 grid h-84 max-[820px]:relative max-[820px]:top-0 max-[820px]:right-0 max-[820px]:left-0 max-[820px]:h-auto">
            {SERVICES.map((service, i) => (
              <div
                key={service.label}
                aria-hidden={i !== active}
                className={`col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  i === active
                    ? "translate-y-0 opacity-100 delay-100"
                    : "pointer-events-none translate-y-[calc(14*var(--spacing))] opacity-0"
                }`}
              >
                <h3 className="text-[calc(34*var(--spacing))] leading-[1.15] font-medium tracking-[-0.03em] max-[820px]:text-[calc(22*var(--spacing))]">
                  {service.title}
                </h3>

                <p className="mt-6 text-[calc(16*var(--spacing))] leading-[1.45] text-white/90 max-[820px]:text-[calc(13*var(--spacing))]">
                  {service.text}
                </p>
              </div>
            ))}
          </div>

          {/* Service images */}
          <div className="absolute top-148 right-24 left-24 h-574 overflow-hidden rounded-[calc(18*var(--spacing))] max-[820px]:relative max-[820px]:top-0 max-[820px]:right-0 max-[820px]:left-0 max-[820px]:mt-16 max-[820px]:aspect-[851/574] max-[820px]:h-auto">
            {SERVICES.map((service, i) => (
              <Image
                key={service.image}
                src={service.image}
                alt={i === active ? service.alt : ""}
                fill
                sizes="(max-width: 820px) 100vw, 860px"
                priority={i === 0}
                className={`object-cover transition-[opacity,scale] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  i === active ? "scale-100 opacity-100" : "scale-[1.07] opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}