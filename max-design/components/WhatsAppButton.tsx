"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const NUMBER = "923394011842";
const MESSAGE = "Hi! 👋 Thank you for reaching out to us. How can we help you today?";

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
        fixed z-[9998]
        right-[max(14px,env(safe-area-inset-right))]
        bottom-[max(14px,env(safe-area-inset-bottom))]
        sm:right-[28px] sm:bottom-[28px]
        transition-all duration-700 ease-out
        ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"}
      `}
    >
      {/* Floating + breathing animation (self-contained, no extra config needed) */}
      <style>{`
        @keyframes maxWhatsappFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-12px) scale(1.12); }
        }
        @keyframes maxWhatsappGlow {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50%      { opacity: 0.6;  transform: scale(1.35); }
        }
        .max-whatsapp-float {
          animation: maxWhatsappFloat 3s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        .max-whatsapp-glow {
          animation: maxWhatsappGlow 3s cubic-bezier(0.45, 0, 0.55, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .max-whatsapp-float,
          .max-whatsapp-glow { animation: none; }
        }
      `}</style>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with MAX Design on WhatsApp"
        className="
          group relative flex items-center justify-center
          h-[56px] w-[56px] sm:h-[68px] sm:w-[68px]
          transition-transform duration-300 ease-out
          hover:-translate-y-1 hover:scale-105
          active:translate-y-0 active:scale-95
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/50
          focus-visible:rounded-full
        "
      >
        {/* Soft pulsing red glow behind the bot */}
        <span
          aria-hidden="true"
          className="
            max-whatsapp-glow pointer-events-none absolute inset-0
            rounded-full bg-red-500/50 blur-xl
          "
        />

        <Image
          src="/bot.png"
          alt="MAX Design chat"
          width={136}
          height={136}
          priority
          className="
            max-whatsapp-float relative
            h-full w-full select-none object-contain
            drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)]
            transition-[filter] duration-300
            group-hover:drop-shadow-[0_12px_20px_rgba(255,0,0,0.35)]
          "
          draggable={false}
        />

        {/* Tooltip (desktop only) */}
        <span
          role="tooltip"
          className="
            pointer-events-none absolute right-full top-1/2 mr-[8px] hidden
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