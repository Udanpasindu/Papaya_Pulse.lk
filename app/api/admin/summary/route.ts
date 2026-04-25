import { bootstrapData } from "@/lib/bootstrap";
import { fail, okWithHeaders, requireAuth } from "@/lib/api-helpers";
import { MilestoneModel } from "@/lib/models/Milestone";
import { DocumentModel } from "@/lib/models/Document";
import { PresentationModel } from "@/lib/models/Presentation";
import { TeamMemberModel } from "@/lib/models/TeamMember";
import { ContactMessageModel } from "@/lib/models/ContactMessage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    requireAuth();
    await bootstrapData();

    const [milestones, documents, presentations, team, contacts] = await Promise.all([
      MilestoneModel.find().sort({ date: 1 }).lean(),
      DocumentModel.countDocuments(),
      PresentationModel.countDocuments(),
      TeamMemberModel.countDocuments(),
      ContactMessageModel.countDocuments(),
    ]);

    return okWithHeaders(
      {
        milestones,
        documents,
        presentations,
        team,
        contacts,
      },
      200,
      { "Cache-Control": "no-store" },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to load admin summary.", 500);
  }
}
