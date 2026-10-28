import CtaButton from "./CtaButton";
import HeroVideo from "./HeroVideo";
import ScrollGrow from "./ScrollGrow";
import PillMedia from "./PillMedia";

/*
  Figma "Home" artboard: 1920 x 1017, black background.
  Desktop (> 900px): --u is 1px at 1920 and scales with the container (capped at 1920), so every
  coordinate below is the Figma value, e.g. left-[calc(84*var(--u))] = 84px in Figma.

  Mobile / tablet (<= 900px): the artboard becomes a stack (title, paragraph, button, video).
    - --pad  : side padding, clamp(16px, 5vw, 96px)  (same as the navbar)
    - --fs   : title size = content width / 6.1, max 120px. "DESIGN THAT" fills the line,
               "LEAVE", the pill, "A LASTING" and "MARK!" each get their own line.
    - paragraph: clamp(17px, 4.6vw, 30px)
    - Let's Connect: full width (max 360px), slightly bigger (--k:1.1px) for easy tapping
    - video: full width, 16:9 (same shape as the video, so nothing is cropped), rounded corners
*/

/** Home artboard (1920 x 1017). Children (the navbar) sit on top of the texture. */
export function HomeStage({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="@container w-full bg-[#000000]">
        <div className="relative isolate z-[2] mx-auto h-[calc(1017*var(--u))] w-full max-w-[1920px] bg-[#000000] [--u:calc(min(100cqw,1920px)_/_1920)] [--k:var(--u)] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:[--k:1px] [@media(max-width:900px)]:pb-[18px] [@media(max-width:900px)]:[--fs:min(120px,calc((100cqw_-_2_*_var(--pad))_/_6.1))] [@media(max-width:900px)]:[--pad:clamp(16px,5vw,96px)]">
          {/* Keep your existing background texture and children here */}
          {children}
        </div>

        <div
          className="hidden min-[1024px]:block min-[1024px]:h-[calc(1152_*_min(100cqw,1920px)_/_1920)] bg-[#000000]"
          aria-hidden="true"
        />
      </div>
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      aria-label="Hero"
      className="block [@media(max-width:900px)]:flex [@media(max-width:900px)]:flex-col [@media(max-width:900px)]:items-start [@media(max-width:900px)]:px-[var(--pad)] [@media(max-width:900px)]:pt-[20px] [@media(max-width:900px)]:pb-0"
    >
      {/* text entrance: every heading line slides up out of a hidden strip (a "mask" reveal), then the
          paragraph and the button fade up. No blur. Nothing moves when "reduce motion" is on. */}
      <style>{`
        @keyframes lineUp {
          from { transform: translateY(105%); }
          to   { transform: none; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <h1 className="absolute top-[calc(182*var(--u))] left-[calc(84*var(--u))] m-0 w-[calc(1682.93*var(--u))] text-[length:calc(164.85*var(--u))] leading-[calc(170.34*var(--u))] font-medium tracking-[-0.04em] text-white uppercase [@media(max-width:900px)]:static [@media(max-width:900px)]:w-full [@media(max-width:900px)]:text-[length:var(--fs)] [@media(max-width:900px)]:leading-[1.033]">
        <span className="block overflow-hidden">
          <span className="animate-[lineUp_1.1s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none [animation-delay:100ms] block whitespace-nowrap [@media(max-width:900px)]:whitespace-normal">
            Design That LEAVE
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="animate-[lineUp_1.1s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none [animation-delay:250ms] flex items-start whitespace-nowrap [@media(max-width:900px)]:flex-wrap">
          <PillMedia className="mt-[calc(24.66*var(--u))] ml-[calc(12*var(--u))] h-[calc(124*var(--u))] w-[calc(852*var(--u))] flex-none [@media(max-width:900px)]:mt-[0.2em] [@media(max-width:900px)]:mb-[0.04em] [@media(max-width:900px)]:ml-0 [@media(max-width:900px)]:h-[0.752em] [@media(max-width:900px)]:w-[5.168em]" />
          <span className="relative top-[calc(6*var(--u))] ml-[calc(47*var(--u))] [@media(max-width:900px)]:top-0 [@media(max-width:900px)]:ml-0">
            a LASTING
          </span>
        </span>
        </span>
        <span className="block overflow-hidden">
          <span className="animate-[lineUp_1.1s_cubic-bezier(0.16,1,0.3,1)_both] motion-reduce:animate-none [animation-delay:400ms] block whitespace-nowrap">mark!</span>
        </span>
      </h1>

      <p className="animate-[fadeUp_0.9s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none [animation-delay:700ms] absolute top-[calc(718*var(--u))] left-[calc(94*var(--u))] m-0 w-[calc(797.71*var(--u))] text-[length:calc(38*var(--u))] leading-[calc(59.19*var(--u))] font-normal tracking-[-0.04em] text-white [@media(max-width:900px)]:static [@media(max-width:900px)]:mt-[28px] [@media(max-width:900px)]:w-full [@media(max-width:900px)]:max-w-[40ch] [@media(max-width:900px)]:text-[length:clamp(17px,4.6vw,30px)] [@media(max-width:900px)]:leading-[1.55]">
        Building brands from the ground up with strategy, creativity, and a clear purpose.
      </p>

      <CtaButton
        href="/contact"
        label="Let’s Connect"
        width={189}
        className="animate-[fadeUp_0.9s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none [animation-delay:850ms] absolute top-[calc(860*var(--u))] left-[calc(96*var(--u))] [@media(max-width:900px)]:static [@media(max-width:900px)]:mt-[28px] [@media(max-width:900px)]:w-full [@media(max-width:900px)]:max-w-[360px] [@media(max-width:900px)]:[--k:1.1px]"
      />

      {/* Same media div + HeroVideo, wrapped by ScrollGrow */}
      <ScrollGrow className="absolute top-[calc(551*var(--u))] left-[calc(894*var(--u))] h-[calc(523.13*var(--u))] w-[calc(930*var(--u))] overflow-hidden bg-[#330101] [@media(max-width:900px)]:relative [@media(max-width:900px)]:top-auto [@media(max-width:900px)]:left-auto [@media(max-width:900px)]:mt-[36px] [@media(max-width:900px)]:aspect-[930/523.13] [@media(max-width:900px)]:h-auto [@media(max-width:900px)]:w-full [@media(max-width:900px)]:rounded-[12px]">
        <HeroVideo
          className="absolute inset-0 block h-full w-full object-cover"
          sources={[
            { src: "/video/intro.webm", type: "video/webm" },
            { src: "/video/intro.mp4", type: "video/mp4" },
          ]}
          poster="/images/hero-video-poster.webp"
        />
      </ScrollGrow>
    </section>
  );
}