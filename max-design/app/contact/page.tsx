import BlogPage from "@/components/BlogPage";
import Faq from "@/components/home/Faq";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import StartProject from "@/components/StartProject";

export default function ContactPage() {
  return (
    <>
        <Navbar />
      

      <main className="min-h-screen bg-black text-white">
        <StartProject/>
        <Faq/>
         <Footer />
      </main>
    </>
  );
}
