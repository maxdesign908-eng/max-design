import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

import ContactService from "@/components/services/ContactService";
import Socialmedia from "@/components/services/Socialmedia";


export default function ServicesPage() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
        <Socialmedia/>
         <ContactService/>
         <Footer />
      </main>
    </>
  );
}
