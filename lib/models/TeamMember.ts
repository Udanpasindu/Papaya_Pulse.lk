import { Schema, model, models } from "mongoose";

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, default: "" },
    email: { type: String, required: true },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
  },
  { timestamps: true },
);

export const TeamMemberModel = models.TeamMember || model("TeamMember", teamMemberSchema);
