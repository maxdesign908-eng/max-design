import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import LogoMarquee from "@/components/home/LogoMarquee";
import Navbar from "@/components/home/Navbar";
import WhatWeBuild from "@/components/home/WhatWeBuild";

export default function ServicesPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-black text-white">
        <WhatWeBuild />
        <LogoMarquee />
        <Contact />
        <Footer />
      </main>
    </>
  );
}