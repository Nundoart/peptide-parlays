const origin = "https://peptide-parlayscom.nundo-com.chatgpt.site";

export async function POST() {
  try {
    const response = await fetch(origin + "/api/views", {
      method: "POST",
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error("Counter unavailable");
    const counts = await response.json() as Record<string, unknown>;
    if (!counts || typeof counts !== "object" || !["day", "month", "year"].every(key => Number.isFinite(counts[key]))) throw new Error("Invalid counter response");
    return Response.json(counts, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "View counts are temporarily unavailable." }, { status: 503 });
  }
}
