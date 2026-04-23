import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationModel } from "@/lib/models/Presentation";
import { fail, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await bootstrapData();
    const items = await PresentationModel.find().sort({ date: 1 }).lean();
    return okWithHeaders(items, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch presentations.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();

    const payload = {
      title: String(body?.title || "").trim(),
      fileUrl: String(body?.fileUrl || "").trim(),
      type: String(body?.type || "General").trim(),
      date: String(body?.date || "").trim(),
      slides: Number(body?.slides || 0),
    };

    if (!payload.title || !payload.fileUrl) {
      return fail("Title and file URL are required.", 400);
    }

    const created = await PresentationModel.create(payload);
    return ok(created, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to create presentation.", 500);
  }
}
