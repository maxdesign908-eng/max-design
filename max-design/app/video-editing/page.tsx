import Contact from "@/components/home/Contact";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";


import Videoediting from "@/components/services/Videoediting";


export default function VideoEditingPage() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
         <Videoediting/>
         <Contact/>
         <Footer />
      </main>
    </>
  );
}
