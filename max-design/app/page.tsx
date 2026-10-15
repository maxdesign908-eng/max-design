import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import Faq from "@/components/home/Faq";
import Footer from "@/components/home/Footer";
import Hero, { HomeStage } from "@/components/home/Hero";
import LogoMarquee from "@/components/home/LogoMarquee";
import Navbar from "@/components/home/Navbar";
import Portfolio from "@/components/home/Portfolio";
import Testimonials from "@/components/home/Testimonials";
import WhatWeBuild from "@/components/home/WhatWeBuild";

export default function Home() {
  return (
    <>
        
      <HomeStage>
        <Navbar />
        <Hero />
      </HomeStage>

      <main id="main">
        <LogoMarquee />
        <WhatWeBuild />
        <About />
        <Portfolio />
        <Testimonials />
        <Faq />
        <Contact/>
        <Footer />
      </main>
    </>
  );
}