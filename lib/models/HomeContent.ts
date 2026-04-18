import { Schema, model, models } from "mongoose";

const homeContentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    heroImage: { type: String, default: "" },
    stats: [{ value: String, label: String }],
    gallery: [{ type: String }],
    features: [
      {
        id: String,
        title: String,
        short: String,
        desc: String,
        image: String,
        accent: String,
      },
    ],
  },
  { timestamps: true },
);

export const HomeContentModel = models.HomeContent || model("HomeContent", homeContentSchema);
