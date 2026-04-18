import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationModel } from "@/lib/models/Presentation";
import { fail, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export async function GET() {
  try {
    await bootstrapData();
    const items = await PresentationModel.find().sort({ date: 1 }).lean();
    return okWithHeaders(items, 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch presentations.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();
    const created = await PresentationModel.create(body);
    return ok(created, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to create presentation.", 500);
  }
}
