import type { Metadata } from "next";
import BookCallPage from "../../components/BookCallPage";
import Navbar from "../../components/home/Navbar";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Book a call | MAX design",
  description: "Pick a day and a time and book a call with MAX design.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string | string[];
    email?: string | string[];
  }>;
}) {
  const sp = await searchParams;

  const one = (v?: string | string[]) =>
    (Array.isArray(v) ? v[0] : v) ?? "";

  return (
    <>
      <Navbar />

      <BookCallPage
        defaultName={one(sp.name).slice(0, 200)}
        defaultEmail={one(sp.email).slice(0, 200)}
      />
      <Footer/>
    </>
  );
}
