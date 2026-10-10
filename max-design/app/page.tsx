import About from "@/components/About";
import Hero, { HomeStage } from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
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
