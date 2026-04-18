import { Schema, model, models } from "mongoose";

const domainContentSchema = new Schema(
  {
    literature: [{ type: String }],
    researchGap: [{ type: String }],
    problem: { type: String, required: true },
    proposedSolution: { type: String, default: "" },
    researchApproach: { type: String, default: "" },
    systemArchitecture: { type: String, default: "" },
    objectives: [{ type: String }],
    methodology: [{ phase: String, desc: String }],
    technologies: [{ type: String }],
  },
  { timestamps: true },
);

export const DomainContentModel = models.DomainContent || model("DomainContent", domainContentSchema);
