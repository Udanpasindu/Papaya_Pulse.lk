import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { bootstrapData } from "@/lib/bootstrap";
import { DocumentModel } from "@/lib/models/Document";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await bootstrapData();
    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Document not found.", 404);
    }
    const item = await DocumentModel.findById(params.id).lean();
    if (!item) {
      return fail("Document not found.", 404);
    }
    return ok(item);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch document.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Document not found.", 404);
    }

    const body = await request.json();
    const payload = {
      title: String(body?.title || "").trim(),
      fileUrl: String(body?.fileUrl || "").trim(),
      category: String(body?.category || "Charter").trim(),
      size: String(body?.size || "").trim(),
      date: String(body?.date || "").trim(),
    };

    if (!payload.title || !payload.fileUrl) {
      return fail("Title and file URL are required.", 400);
    }

    const updated = await DocumentModel.findByIdAndUpdate(params.id, payload, {
      new: true,
      runValidators: true,
    }).lean();
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

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return ok({ deleted: true, existed: false });
    }

    const deleted = await DocumentModel.findByIdAndDelete(params.id).lean();
    return ok({ deleted: true, existed: Boolean(deleted) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete document.", 500);
  }
}
