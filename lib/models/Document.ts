import { Schema, model, models } from "mongoose";

const documentSchema = new Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, default: "" },
    category: { type: String, required: true },
    size: { type: String, default: "" },
    date: { type: String, default: "" },
  },
  { timestamps: true },
);

export const DocumentModel = models.Document || model("Document", documentSchema);
