import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import PortfolioSection from "@/components/portfolio/PortfolioSection";

export default function PortfolioPage() {
  return (
    <>
        <Navbar />

      <main className="min-h-screen bg-black text-white">
        <PortfolioSection />
        <Footer />
      </main>
    </>
  );
}
