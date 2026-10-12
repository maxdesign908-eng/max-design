import Footer from "@/components/home/Footer";
import LogoMarquee from "@/components/home/LogoMarquee";
import Navbar from "@/components/home/Navbar";
import WhatWeBuild from "@/components/home/WhatWeBuild";
import ContactService from "@/components/services/ContactService";

export default function ServicesPage() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
        <WhatWeBuild />
        <LogoMarquee />
         <ContactService/>
         <Footer />
      </main>
    </>
  );
}
