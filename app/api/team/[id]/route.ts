import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { bootstrapData } from "@/lib/bootstrap";
import { TeamMemberModel } from "@/lib/models/TeamMember";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await bootstrapData();
    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Team member not found.", 404);
    }
    const item = await TeamMemberModel.findById(params.id).lean();
    if (!item) {
      return fail("Team member not found.", 404);
    }
    return ok(item);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch team member.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Team member not found.", 404);
    }

    const body = await request.json();
    const payload = {
      name: String(body?.name || "").trim(),
      role: String(body?.role || "").trim(),
      email: String(body?.email || "").trim().toLowerCase(),
      image: String(body?.image || "/assets/team-1.jpg").trim(),
    };

    if (!payload.name || !payload.role || !payload.email) {
      return fail("Name, role, and email are required.", 400);
    }

    const updated = await TeamMemberModel.findByIdAndUpdate(params.id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) {
      return fail("Team member not found.", 404);
    }
    return ok(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if ((error as { code?: number })?.code === 11000) {
      return fail("Email already exists.", 409);
    }
    return fail(error instanceof Error ? error.message : "Failed to update team member.", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return ok({ deleted: true, existed: false });
    }

    const deleted = await TeamMemberModel.findByIdAndDelete(params.id).lean();
    return ok({ deleted: true, existed: Boolean(deleted) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete team member.", 500);
  }
}
