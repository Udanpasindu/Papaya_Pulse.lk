import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { MilestoneModel } from "@/lib/models/Milestone";
import { fail, ok, requireAuth } from "@/lib/api-helpers";
import { Types } from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeWeight(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "0%";
  if (/^\d+(\.\d+)?$/.test(raw)) return `${raw}%`;
  return raw;
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await bootstrapData();
    const item = await MilestoneModel.findById(params.id).lean();
    if (!item) {
      return fail("Milestone not found.", 404);
    }
    return ok(item);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch milestone.", 500);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Milestone not found.", 404);
    }

    const body = await request.json();
    const payload = {
      title: String(body?.title || "").trim(),
      date: String(body?.date || "").trim(),
      description: String(body?.description || "").trim(),
      marks: Number(body?.marks || 0),
      weight: normalizeWeight(body?.weight),
      status: String(body?.status || "upcoming"),
    };

    if (!payload.title || !payload.date || !payload.description) {
      return fail("Title, date and description are required.", 400);
    }

    const updated = await MilestoneModel.findByIdAndUpdate(params.id, payload, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) {
      return fail("Milestone not found.", 404);
    }
    return ok(updated);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to update milestone.", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return ok({ deleted: true, existed: false });
    }

    const deleted = await MilestoneModel.findByIdAndDelete(params.id).lean();
    return ok({ deleted: true, existed: Boolean(deleted) });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete milestone.", 500);
  }
}
