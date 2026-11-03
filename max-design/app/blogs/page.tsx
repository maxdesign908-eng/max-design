import BlogPage from "@/components/BlogPage";

import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";

export default function BlogPagee() {
  return (
    <>
      
        <Navbar />
      

      <main className="min-h-screen bg-black text-white">
        <BlogPage/>
         <Footer />
      </main>
    </>
  );
}
