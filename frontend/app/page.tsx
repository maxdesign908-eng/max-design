import About from "@/components/About";
import Hero, { HomeStage } from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <HomeStage>
        <Navbar />
        <Hero />
      </HomeStage>
      <main id="main">
        <About />
      </main>
    </>
  );
}
