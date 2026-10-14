"use client";

import { useState } from "react";
import BookCall from "@/components/home/BookCall";
import Contact from "@/components/home/Contact";

/*
  Contact block + the "Book A Call Directly" pop-up.
  Your home page is a server component, so it cannot hold the open / close state.
  This small client component holds it: Contact's link opens BookCall (your meeting page).
  BookCall sits NEXT TO Contact (not inside it), so its full-screen overlay is never clipped.
*/
export default function ContactSection() {
  const [bookOpen, setBookOpen] = useState(false);

  return (
    <>
      <Contact onBookCall={() => setBookOpen(true)} />
      <BookCall open={bookOpen} onClose={() => setBookOpen(false)} />
    </>
  );
}
