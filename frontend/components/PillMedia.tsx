/*
  Pill graphic in the hero title. Motion copied from the Figma prototype video:
  the picture only ROTATES (no zoom) about a fixed pivot inside the pill.
  - The END frame (rotate -21.295deg) is the resting style of the layer.
  - The animation plays from the START frame (rotate 0) into that end frame in 4.62s,
    slow start then speeding up, and then it stays on the end frame.
  The pill shape is a plain rounded box (rounded-full), no mask file needed.
  Sizes / positions are % of the pill (852 x 124), so it scales with the pill.
  Only file needed: /public/images/hero-pill-media.png (868 x 426).
*/
export default function PillMedia({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative isolate block aspect-[852/124] overflow-hidden rounded-full bg-black ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes pillMotion {
          from { transform: rotate(0deg); }
        }
      `}</style>
      <span className="absolute top-[-118.548%] left-[-0.1174%] h-[343.548%] w-[101.878%] origin-[49.101%_60.775%] animate-[pillMotion_4.62s_cubic-bezier(0.6,0.5,1,1)_both] bg-[url('/images/hero-pill-media.png')] bg-[length:100%_100%] bg-no-repeat [transform:rotate(-21.295deg)] will-change-transform motion-reduce:animate-none" />
    </span>
  );
}