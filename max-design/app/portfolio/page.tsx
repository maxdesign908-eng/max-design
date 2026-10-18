import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";


export default function ContactPage() {
  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
         <Footer />
      </main>
    </>
  );
}
