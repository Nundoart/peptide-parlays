import type { Metadata } from "next";
import "./globals.css";
import "./marketplace.css";
import "./community.css";

const siteUrl = "https://peptide-parlays-q82q.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Peptide Parlays | Community Reviews & Research",
    template: "%s | Peptide Parlays",
  },
  description:
    "Explore source-aware peptide discussions, community reviews, and links to primary research and regulatory information.",
  keywords: [
    "peptide reviews",
    "peptide research",
    "BPC-157 discussion",
    "CJC-1295 discussion",
    "TB-500 discussion",
    "peptide safety",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Peptide Parlays",
    title: "Peptide Parlays | Community Reviews & Research",
    description: "Source-aware peptide reviews, discussions, and primary research links.",
  },
  twitter: {
    card: "summary",
    title: "Peptide Parlays | Community Reviews & Research",
    description: "Source-aware peptide reviews, discussions, and primary research links.",
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Peptide Parlays",
  url: siteUrl,
  description: "Source-aware peptide community reviews, discussions, and research links.",
  inLanguage: "en-US",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
