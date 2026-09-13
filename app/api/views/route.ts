import { sql } from "drizzle-orm";
import { getDb } from "../../../db";

export async function POST() {
  const db = getDb();
  await db.run(sql`INSERT INTO page_views (view_date, views) VALUES (date('now'), 1) ON CONFLICT(view_date) DO UPDATE SET views = views + 1`);
  const [row] = await db.all<{ day: number; month: number; year: number }>(sql`SELECT COALESCE(SUM(CASE WHEN view_date = date('now') THEN views END), 0) AS day, COALESCE(SUM(CASE WHEN strftime('%Y-%m', view_date) = strftime('%Y-%m', 'now') THEN views END), 0) AS month, COALESCE(SUM(CASE WHEN strftime('%Y', view_date) = strftime('%Y', 'now') THEN views END), 0) AS year FROM page_views`);
  return Response.json(row);
}
