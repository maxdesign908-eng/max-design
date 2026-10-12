"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sources: { src: string; type: string }[]; poster: string; className?: string };

/**
 * Decorative looping clip. Stays on the poster frame for reduced-motion users.
 * Added: sound is ON by default, plus a small mute / unmute button in the bottom-right corner.
 * Browsers often block autoplay with sound; if that happens the clip plays muted and the sound
 * comes on at the visitor's first click, tap or key press (a browser rule no code can skip).
 *
 * The video keeps exactly the same className as before. It now sits inside a wrapper that fills
 * the same box (absolute inset-0), so the button is always in the corner of the video itself.
 */
export default function HeroVideo({ sources, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);
  const stopUnlock = useRef<() => void>(() => {});

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Browsers may block autoplay with sound. So: try with sound first; if the browser says no,
    // play muted and turn the sound on at the visitor's first click / tap / key press anywhere.
    const start = async () => {
      if (query.matches) {
        video.pause();
        return;
      }
      video.muted = false;
      video.volume = 1;
      setMuted(false);
      try {
        await video.play();
      } catch {
        video.muted = true;
        setMuted(true);
        void video.play().catch(() => {});

        const events = ["pointerdown", "keydown", "touchend"] as const;
        const unlock = (e: Event) => {
          // a click on the mute button itself is handled by the button
          if ((e.target as Element | null)?.closest?.("[data-hero-mute]")) return;
          video.muted = false;
          video.volume = 1;
          setMuted(false);
          void video.play().catch(() => {});
          stopUnlock.current();
        };
        stopUnlock.current = () => {
          events.forEach((ev) => window.removeEventListener(ev, unlock));
          stopUnlock.current = () => {};
        };
        events.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));
      }
    };

    void start();

    const sync = () => (query.matches ? video.pause() : void video.play().catch(() => {}));
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      stopUnlock.current();
    };
  }, []);

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    stopUnlock.current(); // the visitor chose, stop waiting for a first click
    const next = !video.muted;
    video.muted = next;
    if (!next) video.volume = 1;
    setMuted(next);
    if (video.paused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void video.play().catch(() => {});
    }
  }

  return (
    <div className="absolute inset-0">
      <video
        ref={ref}
        className={className}
        poster={poster}
        autoPlay
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      >
        {sources.map(({ src, type }) => (
          <source key={src} src={src} type={type} />
        ))}
      </video>

      <button
        type="button"
        data-hero-mute
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        title={muted ? "Unmute" : "Mute"}
        className="absolute right-[max(10px,calc(20*var(--u,1px)))] bottom-[max(10px,calc(20*var(--u,1px)))] z-10 grid h-[max(32px,calc(44*var(--u,1px)))] w-[max(32px,calc(44*var(--u,1px)))] cursor-pointer place-items-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-sm transition-[background-color,transform,border-color] duration-200 hover:scale-105 hover:border-white/70 hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff1e2d] active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-[48%] w-[48%]"
        >
          <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" stroke="none" />
          {muted ? (
            <path d="m16 9.5 5 5m0-5-5 5" />
          ) : (
            <>
              <path d="M15.5 9a4.2 4.2 0 0 1 0 6" />
              <path d="M18.4 6.5a8 8 0 0 1 0 11" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}