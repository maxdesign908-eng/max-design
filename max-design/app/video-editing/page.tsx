import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

import ContactService from "@/components/services/ContactService";
import Videoediting from "@/components/services/Videoediting";


export default function ServicesPage() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
         <Videoediting/>
         <ContactService/>
         <Footer />
      </main>
    </>
  );
}
