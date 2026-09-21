import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://peptide-parlays-q82q.vercel.app",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
