import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { comments } from "../../../db/schema";
export async function GET(request: Request) {
  const peptide = new URL(request.url).searchParams.get("peptide") || "BPC-157";
  const rows = await getDb().select().from(comments).where(eq(comments.peptide, peptide)).orderBy(desc(comments.id)).limit(50);
  return Response.json({ comments: rows });
}
export async function POST(request: Request) {
  const payload = await request.json() as { peptide?: string; body?: string };
  const peptide = payload.peptide?.trim() || "BPC-157"; const body = payload.body?.trim() || "";
  if (!body || body.length > 600) return Response.json({ error: "Comment must be 1–600 characters." }, { status: 400 });
  const [comment] = await getDb().insert(comments).values({ peptide, body }).returning();
  return Response.json({ comment }, { status: 201 });
}
