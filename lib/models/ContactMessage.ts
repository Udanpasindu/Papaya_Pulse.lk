import { Schema, model, models } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

export const ContactMessageModel =
  models.ContactMessage || model("ContactMessage", contactMessageSchema);
