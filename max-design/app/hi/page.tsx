import Image from "next/image";

export default function CaseStudy() {
  return (
    <section className="w-full bg-black">
      <Image
        src="/images/roche-melgar.jpg"
        alt="Roche Melgar brand identity case study"
        width={0}
        height={0}
        sizes="100vw"
        quality={95}
        priority
        className="block h-auto w-full"
      />
    </section>
  );
}