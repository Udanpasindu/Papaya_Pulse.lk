import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { DomainContentModel } from "@/lib/models/DomainContent";
import { fail, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export async function GET() {
  try {
    await bootstrapData();
    const content = await DomainContentModel.findOne().lean();
    return okWithHeaders(content, 200, { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch domain content.", 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
    const body = await request.json();
    const existing = await DomainContentModel.findOne();

    if (!existing) {
      const created = await DomainContentModel.create(body);
      return ok(created, 201);
    }

    existing.literature = body.literature || [];
    existing.researchGap = body.researchGap || [];
    existing.problem = body.problem || "";
    existing.proposedSolution = body.proposedSolution || "";
    existing.researchApproach = body.researchApproach || "";
    existing.systemArchitecture = body.systemArchitecture || "";
    existing.objectives = body.objectives || [];
    existing.methodology = body.methodology || [];
    existing.technologies = body.technologies || [];
    await existing.save();

    return ok(existing);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to update domain content.", 500);
  }
}
