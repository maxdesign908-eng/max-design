import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/home/Navbar";
import CaseStudyView from "../CaseStudyView";
import LongImageView from "../LongImageView";
import CaseStudyVideoGrid, { VIDEO_BG } from "../CaseStudyVideoGrid";
import { caseStudies, getCaseStudy } from "@/data/caseStudies";

type Params = { params: Promise<{ slug: string }> };

// These pages are built at build time (one per project in data/caseStudies.ts)
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

  // Long image project: image only (no navbar / footer), then videos right below it if any
  if (study.longImage) {
    const videos = study.items.filter((i) => i.video);
    return (
      <main
        className="min-h-screen text-white"
        style={{ background: videos.length > 0 ? VIDEO_BG : "#000" }}
      >
        <LongImageView study={study} />
        {videos.length > 0 && <CaseStudyVideoGrid items={videos} />}
      </main>
    );
  }

  return (
    <>

        <Navbar />
    

      <main className="min-h-screen bg-black text-white">
        <CaseStudyView study={study} />
        <Footer />
      </main>
    </>
  );
}