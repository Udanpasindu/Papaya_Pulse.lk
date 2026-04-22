import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { HomeContentModel } from "@/lib/models/HomeContent";
import { fail, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await bootstrapData();
    const content = await HomeContentModel.findOne().lean();
    return okWithHeaders(content, 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch home content.", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();
    const existing = await HomeContentModel.findOne();

    if (!existing) {
      const created = await HomeContentModel.create(body);
      return ok(created, 201);
    }

    existing.title = body.title;
    existing.description = body.description;
    existing.features = body.features || [];
    existing.stats = body.stats || [];
    existing.heroImage = body.heroImage || "";
    existing.gallery = body.gallery || [];
    await existing.save();
    return ok(existing);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to update home content.", 500);
  }
}
