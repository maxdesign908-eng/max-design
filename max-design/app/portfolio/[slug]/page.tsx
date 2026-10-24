import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import CaseStudyView from "../CaseStudyView";
import LongImageView from "../LongImageView";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";

type Params = { params: Promise<{ slug: string }> };

// Ye pages build ke waqt hi ban jate hain (data/caseStudies.ts me jitne project hain)
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return study
    ? { title: `${study.title} | MAX design`, description: study.badge ?? `${study.title} case study` }
    : {};
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  // Lambi image wala project (jaise Roche Melgar): sirf image, navbar / footer nahi
  if (study.longImage) {
    return (
      <main className="min-h-screen bg-black text-white">
        <LongImageView study={study} />
      </main>
    );
  }

  return (
    <>
      <div className="w-full bg-black">
        <Navbar />
      </div>

      <main className="min-h-screen bg-black text-white">
        <CaseStudyView study={study} />
        <Footer />
      </main>
    </>
  );
}