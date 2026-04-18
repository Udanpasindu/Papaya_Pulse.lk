import { Schema, model, models } from "mongoose";

const milestoneSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    marks: { type: Number, default: 0 },
    weight: { type: String, default: "0%" },
    status: {
      type: String,
      enum: ["completed", "in-progress", "upcoming"],
      default: "upcoming",
    },
  },
  { timestamps: true },
);

export const MilestoneModel = models.Milestone || model("Milestone", milestoneSchema);
