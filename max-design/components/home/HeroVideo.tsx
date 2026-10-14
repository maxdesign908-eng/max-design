"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sources: { src: string; type: string }[]; poster: string; className?: string };

/**
 * Decorative looping clip. Stays on the poster frame for reduced-motion users.
 * Added: the clip starts muted; the glass pill in the bottom-right corner turns the sound on / off
 * (red icon + moving equalizer when the sound is on, pulsing ring when muted).
 * The clip pauses (and the sound stops) when it is scrolled out of view or the tab is hidden.
 *
 * The video keeps exactly the same className as before. It now sits inside a wrapper that fills
 * the same box (absolute inset-0), so the button is always in the corner of the video itself.
 */
export default function HeroVideo({ sources, poster, className }: Props) {
  // H.264 mp4 is hardware decoded (smooth); VP9 webm is often software decoded (laggy) -> mp4 first
  const ordered = [...sources].sort((a, b) => Number(b.type.includes("mp4")) - Number(a.type.includes("mp4")));
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    let visible = true;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

    // the button always shows the real state of the video
    const onVolume = () => setMuted(video.muted);
    video.addEventListener("volumechange", onVolume);
    setMuted(video.muted);

    const resume = () => {
      if (visible && !saveData && !document.hidden && !query.matches) void video.play().catch(() => {});
    };
    const sync = () => (query.matches || saveData ? video.pause() : resume());
    sync();
    query.addEventListener("change", sync);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) resume();
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    const onVisibility = () => (document.hidden ? video.pause() : resume());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      video.removeEventListener("volumechange", onVolume);
      document.removeEventListener("visibilitychange", onVisibility);
      query.removeEventListener("change", sync);
    };
  }, []);

  function toggleSound() {
    const video = ref.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.volume = 1;
    if (video.paused && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void video.play().catch(() => {});
    }
  }

  return (
    <div className="absolute inset-0 [contain:paint] [transform:translateZ(0)]">
      <video
        ref={ref}
        className={className}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        disableRemotePlayback
        aria-hidden="true"
        tabIndex={-1}
      >
        {ordered.map(({ src, type }) => (
          <source key={src} src={src} type={type} />
        ))}
      </video>

      <style>{`
        @keyframes hv-eq { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        @keyframes hv-ping { 0% { transform: scale(1); opacity: 0.55; } 80%,100% { transform: scale(1.9); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .hv-eq, .hv-ping { animation: none !important; } }
      `}</style>

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        title={muted ? "Unmute" : "Mute"}
        data-on={!muted}
        className="group absolute right-[max(10px,calc(20*var(--u,1px)))] bottom-[max(10px,calc(20*var(--u,1px)))] z-10 flex h-[max(36px,calc(48*var(--u,1px)))] cursor-pointer items-center gap-[max(6px,calc(10*var(--u,1px)))] rounded-full bg-gradient-to-b from-white/[0.16] to-black/70 p-[max(3px,calc(4*var(--u,1px)))] pr-[max(10px,calc(16*var(--u,1px)))] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.22)] transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.04] hover:shadow-[0_10px_30px_rgba(231,17,23,0.35),inset_0_0_0_1px_rgba(255,255,255,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E71117] active:scale-95"
      >
        {/* round icon: red with sound on, glass when muted (with a soft pulse that invites a click) */}
        <span
          className="relative grid h-full aspect-square place-items-center rounded-full bg-white/15 transition-colors duration-300 group-data-[on=true]:bg-[#E71117]"
        >
          <span
            aria-hidden="true"
            className="hv-ping pointer-events-none absolute inset-0 rounded-full border border-white/60 [animation:hv-ping_2.4s_ease-out_infinite] group-data-[on=true]:hidden"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-[52%] w-[52%]"
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
        </span>

        {/* tiny equalizer: moves while the sound is on, flat line when muted */}
        <span aria-hidden="true" className="flex h-[40%] items-center gap-[max(2px,calc(3*var(--u,1px)))]">
          {[0, 0.25, 0.5, 0.15].map((d, i) => (
            <i
              key={i}
              style={{ animationDelay: `${d}s` }}
              className="hv-eq block h-full w-[max(2px,calc(3*var(--u,1px)))] origin-center scale-y-[0.3] rounded-full bg-white/80 group-data-[on=true]:bg-white group-data-[on=true]:[animation:hv-eq_0.9s_ease-in-out_infinite]"
            />
          ))}
        </span>
      </button>
    </div>
  );
}