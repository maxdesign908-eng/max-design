"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const NUMBER = "923394011842";
const MESSAGE = "Hi MAX Design, I want to know more about your services.";

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  const whatsappUrl = `https://wa.me/${NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <div
      className={`
        fixed z-[9999]
        right-[max(24px,env(safe-area-inset-right))]
        bottom-[max(24px,env(safe-area-inset-bottom))]
        sm:right-[40px] sm:bottom-[40px]
        transition-all duration-700 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}
      `}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with MAX Design on WhatsApp"
        className="
          group relative flex items-center justify-center
          h-[64px] w-[64px] sm:h-[72px] sm:w-[72px]
          rounded-full
          shadow-[0_10px_30px_-6px_rgba(0,0,0,0.5),0_4px_12px_rgba(0,0,0,0.25)]
          transition-all duration-300 ease-out
          hover:-translate-y-1
          hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.6),0_6px_16px_rgba(0,0,0,0.3)]
          active:translate-y-0 active:scale-95
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50
        "
      >
        {/* Soft pulse ring */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 rounded-full bg-[#25D366]
            opacity-30
            motion-safe:animate-[ping_2.8s_cubic-bezier(0,0,0.2,1)_infinite]
          "
        />

        {/* Brand logo */}
        <span className="relative z-10 h-full w-full overflow-hidden rounded-full ring-2 ring-white/90">
          <Image
            src="/icon.png"
            alt="MAX Design"
            width={144}
            height={144}
            priority
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </span>

        {/* WhatsApp badge (replaces the green dot) */}
        <span
          aria-hidden="true"
          className="
            absolute -right-[2px] -top-[2px] z-20
            flex h-[26px] w-[26px] sm:h-[28px] sm:w-[28px]
            items-center justify-center
            rounded-full bg-[#25D366] text-white
            ring-2 ring-white
            shadow-[0_2px_8px_rgba(0,0,0,0.3)]
          "
        >
          <svg
            viewBox="0 0 32 32"
            className="h-[15px] w-[15px] sm:h-[16px] sm:w-[16px]"
            fill="currentColor"
          >
            <path d="M16 3C8.8 3 3 8.8 3 16c0 2.3.6 4.5 1.7 6.4L3 29l6.8-1.8C11.6 28.3 13.8 29 16 29c7.2 0 13-5.8 13-13S23.2 3 16 3zm0 23.7c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1 1.1-3.9-.3-.4C5.7 19.9 5.3 18 5.3 16 5.3 9.9 10.1 5.3 16 5.3S26.7 10.1 26.7 16 21.9 26.7 16 26.7zm5.9-8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.4.6 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
          </svg>
        </span>

        {/* Tooltip (desktop only) */}
        <span
          role="tooltip"
          className="
            pointer-events-none absolute right-full top-1/2 mr-[16px] hidden
            -translate-y-1/2 translate-x-2
            whitespace-nowrap rounded-xl
            bg-[#111111]/95 px-[16px] py-[10px]
            text-[14px] font-medium text-white
            shadow-xl backdrop-blur
            opacity-0 transition-all duration-300
            sm:block
            group-hover:translate-x-0 group-hover:opacity-100
            group-focus-visible:translate-x-0 group-focus-visible:opacity-100
          "
        >
          Chat with us on WhatsApp
          <span
            aria-hidden="true"
            className="
              absolute left-full top-1/2 -translate-y-1/2
              border-[6px] border-transparent border-l-[#111111]/95
            "
          />
        </span>
      </a>
    </div>
  );
}