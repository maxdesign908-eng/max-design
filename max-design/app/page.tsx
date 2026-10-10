import About from "@/components/About";
import CustomCursor from "@/components/CustomCursor";
import Hero, { HomeStage } from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Navbar from "@/components/Navbar";

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
        <About />
      </main>
    </>
  );
}
