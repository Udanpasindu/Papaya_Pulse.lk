import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { DocumentModel } from "@/lib/models/Document";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();
    const updated = await DocumentModel.findByIdAndUpdate(context.params.id, body, { new: true }).lean();
    if (!updated) {
      return fail("Document not found.", 404);
    }
    return ok(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to update document.", 500);
  }
}

export async function DELETE(_request: NextRequest, context: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();
    const deleted = await DocumentModel.findByIdAndDelete(context.params.id).lean();
    if (!deleted) {
      return fail("Document not found.", 404);
    }
    return ok({ deleted: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete document.", 500);
  }
}
