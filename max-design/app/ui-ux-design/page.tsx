import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

import UiDesign from "@/components/services/UIDesign";

export default function UiUxPage() {
  return (
    <>
     
        <Navbar />
    

      <main className="min-h-screen bg-black text-white">
        <UiDesign/>
         <Contact/>
         <Footer />
      </main>
    </>
  );
}
