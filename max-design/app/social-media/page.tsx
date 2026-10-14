import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

import Socialmedia from "@/components/services/Socialmedia";


export default function SocialMediaPage() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
        <Socialmedia/>
         <Contact/>
         <Footer />
      </main>
    </>
  );
}
