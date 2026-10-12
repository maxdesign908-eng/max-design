import type { CSSProperties } from "react";

type Props = {
  href: string;
  label: string;
  /** Outer width in Figma px (1920 artboard). Can be overridden with a width class (e.g. w-full). */
  width: number;
  className?: string;
};

/*
  Pill button. Outer box = Figma rect + 0.573px stroke (Book a Consultation: 239 x 56).
  Every size is N * var(--k): --k is set by HomeStage (= 1 Figma px, scales with the page
  on desktop, 1px on mobile). Set --k on the button itself to make it bigger/smaller,
  e.g. className="[--k:1.1px]". Outside HomeStage it falls back to plain px.

  HOVER (and keyboard focus): a red fill rises from the bottom with a soft curved edge.
  While it is red, the small dot and the arrow circle turn white and the arrow turns red,
  so they stay visible. With "reduce motion" the colour changes instantly, no sliding.
*/
export default function CtaButton({ href, label, width, className }: Props) {
  return (
    <a
      href={href}
      className={`group relative isolate flex h-[calc(56*var(--k,1px))] w-[calc(var(--w)*var(--k,1px))] flex-none items-center overflow-hidden rounded-[999px] border-[length:calc(0.573*var(--k,1px))] border-solid border-white pr-[calc(10.46*var(--k,1px))] pl-[calc(14.33*var(--k,1px))] text-white whitespace-nowrap no-underline transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(color:--color-accent) ${className ?? ""}`}
      style={{ "--w": width } as CSSProperties}
    >
      {/* red fill that rises from the bottom (taller than the button so the curved top edge stays above it) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 z-0 h-[140%] w-full translate-y-[72%] rounded-[50%_50%_0_0/28%_28%_0_0] bg-(color:--color-accent) transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-[28.6%] group-focus-visible:-translate-y-[28.6%] motion-reduce:transition-none"
      />

      <span
        className="relative z-10 h-[calc(5.73*var(--k,1px))] w-[calc(5.73*var(--k,1px))] flex-none rounded-[50%] bg-(color:--color-accent) transition-colors duration-300 group-hover:bg-white group-focus-visible:bg-white"
        aria-hidden="true"
      />
      <span className="relative z-10 ml-[calc(9.17*var(--k,1px))] text-[length:calc(16*var(--k,1px))] leading-[normal] font-medium tracking-[-0.04em]">
        {label}
      </span>
      <span
        className="relative z-10 ml-auto h-[calc(38*var(--k,1px))] w-[calc(38*var(--k,1px))] flex-none rounded-[50%] bg-(color:--color-accent) text-white transition-colors duration-300 group-hover:bg-white group-hover:text-(color:--color-accent) group-focus-visible:bg-white group-focus-visible:text-(color:--color-accent)"
        aria-hidden="true"
      >
        <svg
          className="absolute top-[calc(11*var(--k,1px))] left-[calc(12.13*var(--k,1px))] h-[calc(14*var(--k,1px))] w-[calc(14*var(--k,1px))]"
          width="14"
          height="14"
          viewBox="1691.1 41 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1703.58 41L1704.54 41.9906L1704.43 42.0986C1701.66 45.0122 1701.76 48.9776 1703.59 50.8714L1702.62 51.8562C1701.11 50.2962 1700.57 47.8741 1701.11 45.4621L1693.05 53.6371L1692.1 52.6476L1700.16 44.4691C1697.8 45.002 1695.44 44.4296 1693.93 42.8684L1694.9 41.8824C1696.75 43.8001 1700.7 43.9228 1703.58 41Z" fill="currentColor" />
        </svg>
      </span>
    </a>
  );
}