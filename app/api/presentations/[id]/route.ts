import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationModel } from "@/lib/models/Presentation";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await bootstrapData();
    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Presentation not found.", 404);
    }
    const item = await PresentationModel.findById(params.id).lean();
    if (!item) {
      return fail("Presentation not found.", 404);
    }
    return ok(item);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch presentation.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Presentation not found.", 404);
    }

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

    const updated = await PresentationModel.findByIdAndUpdate(params.id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) {
      return fail("Presentation not found.", 404);
    }
    return ok(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to update presentation.", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return ok({ deleted: true, existed: false });
    }

    const deleted = await PresentationModel.findByIdAndDelete(params.id).lean();
    return ok({ deleted: true, existed: Boolean(deleted) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete presentation.", 500);
  }
}
