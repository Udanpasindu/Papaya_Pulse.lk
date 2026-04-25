import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { bootstrapData } from "@/lib/bootstrap";
import { ContactMessageModel } from "@/lib/models/ContactMessage";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return ok({ deleted: true, existed: false });
    }

    const deleted = await ContactMessageModel.findByIdAndDelete(params.id).lean();
    return ok({ deleted: true, existed: Boolean(deleted) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete contact message.", 500);
  }
}