"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sources: { src: string; type: string }[]; poster: string; className?: string };

/**
 * Decorative looping clip. Stays on the poster frame for reduced-motion users.
 * Added: the clip starts muted; the small button in the bottom-right corner turns the sound on / off.
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

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        title={muted ? "Unmute" : "Mute"}
        className="absolute right-[max(10px,calc(20*var(--u,1px)))] bottom-[max(10px,calc(20*var(--u,1px)))] z-10 grid h-[max(32px,calc(44*var(--u,1px)))] w-[max(32px,calc(44*var(--u,1px)))] cursor-pointer place-items-center rounded-full border border-white/30 bg-black/70 text-white transition-[background-color,transform,border-color] duration-200 hover:scale-105 hover:border-white/70 hover:bg-black/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff1e2d] active:scale-95"
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