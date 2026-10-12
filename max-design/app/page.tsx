import About from "@/components/About";
import Contact from "@/components/Contact";
import CustomCursor from "@/components/CustomCursor";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Hero, { HomeStage } from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import WhatWeBuild from "@/components/WhatWeBuild";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <HomeStage>
        <Navbar />
        <Hero />
      </HomeStage>
      <main id="main">
        <LogoMarquee />
        <WhatWeBuild />
        <About />
        <Portfolio />
        
        <Testimonials/>
        <Faq/>
        <Contact/>
        <Footer/>
      </main>
    </>
  );
}
