export async function GET() {
  return Response.json({ comments: [], mirror: true });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as { peptide?: string; body?: string };
  const body = payload.body?.trim() ?? "";

  if (!body || body.length > 600) {
    return Response.json({ error: "Comment must be 1–600 characters." }, { status: 400 });
  }

  return Response.json(
    { comment: { id: Date.now(), peptide: payload.peptide?.trim() || "BPC-157", body, mirror: true } },
    { status: 201 },
  );
}
