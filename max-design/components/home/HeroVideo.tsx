"use client";

import { useEffect, useRef } from "react";

type Props = { sources: { src: string; type: string }[]; poster: string; className?: string };

/** Decorative looping clip. Stays on the poster frame for reduced-motion users. */
export default function HeroVideo({ sources, poster, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (query.matches ? video.pause() : void video.play().catch(() => {}));
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      autoPlay
      muted
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
  );
}
