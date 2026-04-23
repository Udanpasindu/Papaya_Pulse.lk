import { Schema, model, models } from "mongoose";

const homeGalleryImageSchema = new Schema(
  {
    title: { type: String, default: "" },
    fileData: { type: Buffer, required: true },
    mimeType: { type: String, default: "image/jpeg" },
  },
  { timestamps: true },
);

export const HomeGalleryImageModel =
  models.HomeGalleryImage || model("HomeGalleryImage", homeGalleryImageSchema);