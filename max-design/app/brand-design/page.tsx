import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import BrandDesign from "@/components/services/BrandDesign";

import ContactService from "@/components/services/ContactService";

export default function BrandPage() {
  return (
    <>
      
        <Navbar />
      

      <main className="min-h-screen bg-black text-white">
        <BrandDesign/>
         <Contact/>
         <Footer />
      </main>
    </>
  );
}
