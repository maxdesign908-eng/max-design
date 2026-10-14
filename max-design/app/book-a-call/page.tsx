"use client";

import { useState } from "react";
import BookCall from "@/components/home/BookCall";
import Contact from "@/components/home/Contact";
import Navbar from "@/components/home/Navbar";

export default function Page() {
  // the pop-up is controlled from here: BookCall needs `open` and `onClose`
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
        {/* "Book A Call Directly" opens the pop-up */}
        <Contact onBookCall={() => setBookOpen(true)} />
      </main>

      <BookCall open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}