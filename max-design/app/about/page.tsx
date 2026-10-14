

import AboutPage from "@/components/AboutPage";
import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import Testimonials from "@/components/home/Testimonials";
import StatsStrip from "@/components/StatsStrip";

export default function AboutPagee() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
        <AboutPage/>
        <Testimonials/>
        <StatsStrip/>
        <Contact/>
         <Footer />
      </main>
    </>
  );
}
