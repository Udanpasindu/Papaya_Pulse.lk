import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { DocumentModel } from "@/lib/models/Document";
import { fail, getSearchQuery, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    await bootstrapData();
    const q = getSearchQuery(request.url);
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const items = await DocumentModel.find(filter).sort({ createdAt: -1 }).lean();
    return okWithHeaders(items, 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch documents.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();
    const created = await DocumentModel.create(body);
    return ok(created, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to create document.", 500);
  }
}
