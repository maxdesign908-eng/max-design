import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

import Webdevelopment from "@/components/services/Webdevelopment";


export default function WebDevelopmentPage() {
  return (
    <>
        <Navbar />

      <main className="min-h-screen bg-black text-white">
        <Webdevelopment/>
         <Contact/>
         <Footer />
      </main>
    </>
  );
}
