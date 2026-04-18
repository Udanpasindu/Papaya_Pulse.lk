import { Schema, model, models } from "mongoose";

const presentationSchema = new Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, default: "" },
    type: { type: String, required: true },
    date: { type: String, default: "" },
    slides: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const PresentationModel =
  models.Presentation || model("Presentation", presentationSchema);
