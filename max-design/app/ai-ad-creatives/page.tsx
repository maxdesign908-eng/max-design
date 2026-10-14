import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import Aiadcreatives from "@/components/services/Aiadcreatives";



export default function AiAdCreativesPage() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
        <Aiadcreatives/>
         <Contact/>
         <Footer />
      </main>
    </>
  );
}
