import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { TeamMemberModel } from "@/lib/models/TeamMember";
import { fail, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeUrl(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export async function GET() {
  try {
    await bootstrapData();
    const items = await TeamMemberModel.find().sort({ createdAt: 1 }).lean();
    return okWithHeaders(items, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch team members.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();

    const payload = {
      name: String(body?.name || "").trim(),
      role: String(body?.role || "").trim(),
      email: String(body?.email || "").trim().toLowerCase(),
      image: String(body?.image || "/assets/team-1.jpg").trim(),
      linkedin: normalizeUrl(body?.linkedin),
      github: normalizeUrl(body?.github),
    };

    if (!payload.name || !payload.role || !payload.email) {
      return fail("Name, role, and email are required.", 400);
    }

    const created = await TeamMemberModel.create(payload);
    return ok(created, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    if ((error as { code?: number })?.code === 11000) {
      return fail("Email already exists.", 409);
    }
    return fail(error instanceof Error ? error.message : "Failed to create team member.", 500);
  }
}
