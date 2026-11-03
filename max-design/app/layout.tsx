import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CustomCursor from "@/components/home/CustomCursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";

const poppins = localFont({
  src: [
    { path: "./fonts/poppins-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/poppins-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-poppins",
});

const siteUrl = "https://www.maxdesign.agency";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MAX design | UI/UX, Branding & Web Design Studio",
    template: "%s | MAX design",
  },
  description:
    "MAX design is a design studio creating UI/UX, branding and websites that leave a lasting mark.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "MAX design",
    title: "MAX design | UI/UX, Branding & Web Design Studio",
    description: "Design that leaves a lasting mark.",
    images: [{ url: "/og.png", width: 1200, height: 630 }], // /public mein og.png add karni hai
  },
  twitter: { card: "summary_large_image" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteUrl}/#organization`,
  name: "MAX design",
  url: siteUrl,
  logo: `${siteUrl}/images/footer/max.webp`,
  image: `${siteUrl}/og.png`,
  description: "Design studio for UI/UX, branding and websites.",
  telephone: "+92334901842",
  address: {
    "@type": "PostalAddress",
    streetAddress: "5th floor, 21, Block J 3, Phase 2, Global Heights, Johar Town",
    addressLocality: "Lahore",
    addressCountry: "PK",
  },
  sameAs: [
    "https://www.linkedin.com/company/maxdesignagency/",
    "https://www.facebook.com/maxdesignsinnovation/",
    "https://www.instagram.com/maxdesign908/",
    "https://www.behance.net/maxdesignagency",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "MAX design",
  url: siteUrl,
  publisher: { "@id": `${siteUrl}/#organization` },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-black">
        
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <CustomCursor />
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}