import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://peptide-parlays-q82q.vercel.app/sitemap.xml",
  };
}
