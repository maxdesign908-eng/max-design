"use client";

import { useEffect, useRef, useState } from "react";

type Props = { sources: { src: string; type: string }[]; poster: string; className?: string };

/**
 * Decorative looping clip. Stays on the poster frame for reduced-motion users.
 * Added: the clip starts muted; the small round red & white button in the top-right corner turns the sound on / off
 * (white with a red icon when muted, solid red with a white icon when the sound is on).
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
        preload="none"
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
        data-on={!muted}
        className="absolute top-[clamp(8px,1vw,14px)] right-[clamp(8px,1vw,14px)] z-10 grid h-[clamp(24px,1.5vw,28px)] w-[clamp(24px,1.5vw,28px)] cursor-pointer place-items-center rounded-full bg-white text-[#E71117] shadow-[0_3px_10px_rgba(0,0,0,0.4)] transition-[transform,background-color,color] duration-300 ease-out hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95 data-[on=true]:bg-[#E71117] data-[on=true]:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-[56%] w-[56%]"
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