import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationModel } from "@/lib/models/Presentation";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();
    const updated = await PresentationModel.findByIdAndUpdate(context.params.id, body, { new: true }).lean();
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

export async function DELETE(_request: NextRequest, context: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();
    const deleted = await PresentationModel.findByIdAndDelete(context.params.id).lean();
    if (!deleted) {
      return fail("Presentation not found.", 404);
    }
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete presentation.", 500);
  }
}
