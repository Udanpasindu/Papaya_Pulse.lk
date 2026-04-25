import { Schema, model, models } from "mongoose";

const presentationUploadChunkSchema = new Schema(
  {
    uploadId: { type: String, required: true, index: true },
    index: { type: Number, required: true },
    totalChunks: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, default: "" },
    slides: { type: Number, default: 0 },
    originalName: { type: String, default: "" },
    mimeType: { type: String, default: "application/octet-stream" },
    chunkData: { type: Buffer, required: true },
  },
  { timestamps: true },
);

presentationUploadChunkSchema.index({ uploadId: 1, index: 1 }, { unique: true });

export const PresentationUploadChunkModel =
  models.PresentationUploadChunk || model("PresentationUploadChunk", presentationUploadChunkSchema);