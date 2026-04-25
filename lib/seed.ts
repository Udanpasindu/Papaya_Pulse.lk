import { hashPassword } from "@/lib/auth";
import { DEFAULT_DOMAIN, DEFAULT_HOME, DEFAULT_MILESTONES, DEFAULT_DOCUMENTS, DEFAULT_PRESENTATIONS, DEFAULT_TEAM } from "@/lib/defaults";
import { UserModel } from "@/lib/models/User";
import { HomeContentModel } from "@/lib/models/HomeContent";
import { DomainContentModel } from "@/lib/models/DomainContent";
import { MilestoneModel } from "@/lib/models/Milestone";
import { DocumentModel } from "@/lib/models/Document";
import { PresentationModel } from "@/lib/models/Presentation";
import { TeamMemberModel } from "@/lib/models/TeamMember";

export async function seedIfNeeded() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@papayapulse.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const shouldSeedSampleCollections = process.env.NODE_ENV !== "production";

  const [existingUser, homeCount, domainCount, milestoneCount, documentCount, presentationCount, teamCount] =
    await Promise.all([
      UserModel.findOne({ email: adminEmail }).lean(),
      HomeContentModel.estimatedDocumentCount(),
      DomainContentModel.estimatedDocumentCount(),
      MilestoneModel.estimatedDocumentCount(),
      DocumentModel.estimatedDocumentCount(),
      PresentationModel.estimatedDocumentCount(),
      TeamMemberModel.estimatedDocumentCount(),
    ]);

  const seedOperations: Promise<unknown>[] = [];

  if (!existingUser) {
    seedOperations.push(hashPassword(adminPassword).then((password) => UserModel.create({ email: adminEmail, password })));
  }

  if (!homeCount) seedOperations.push(HomeContentModel.create(DEFAULT_HOME));
  if (!domainCount) seedOperations.push(DomainContentModel.create(DEFAULT_DOMAIN));
  if (shouldSeedSampleCollections && !milestoneCount) seedOperations.push(MilestoneModel.insertMany(DEFAULT_MILESTONES));
  if (shouldSeedSampleCollections && !documentCount) seedOperations.push(DocumentModel.insertMany(DEFAULT_DOCUMENTS));
  if (shouldSeedSampleCollections && !presentationCount) seedOperations.push(PresentationModel.insertMany(DEFAULT_PRESENTATIONS));
  if (shouldSeedSampleCollections && !teamCount) seedOperations.push(TeamMemberModel.insertMany(DEFAULT_TEAM));

  if (seedOperations.length > 0) {
    await Promise.all(seedOperations);
  }
}
