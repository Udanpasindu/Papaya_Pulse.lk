import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { MilestoneModel } from "@/lib/models/Milestone";
import { fail, getSearchQuery, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeWeight(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "0%";
  if (/^\d+(\.\d+)?$/.test(raw)) return `${raw}%`;
  return raw;
}

export async function GET(request: NextRequest) {
  try {
    await bootstrapData();
    const q = getSearchQuery(request.url);
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const items = await MilestoneModel.find(filter).sort({ date: 1 }).lean();
    return okWithHeaders(items, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch milestones.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
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

    const created = await MilestoneModel.create(payload);
    return ok(created, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to create milestone.", 500);
  }
}
