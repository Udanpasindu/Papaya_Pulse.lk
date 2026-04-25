import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationUploadChunkModel } from "@/lib/models/PresentationUploadChunk";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeMimeType(mimeType: string, title: string) {
  const normalized = String(mimeType || "").trim();
  if (normalized) return normalized;
  if (String(title || "").toLowerCase().endsWith(".pdf")) {
    return "application/pdf";
  }
  return "application/octet-stream";
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();

    const formData = await request.formData();
    const uploadId = String(formData.get("uploadId") || "").trim();
    const index = Number(formData.get("index"));
    const totalChunks = Number(formData.get("totalChunks"));
    const title = String(formData.get("title") || "").trim();
    const type = String(formData.get("type") || "General").trim();
    const date = String(formData.get("date") || "").trim();
    const slides = Number(formData.get("slides") || 0);
    const originalName = String(formData.get("originalName") || title || "presentation").trim();
    const mimeType = normalizeMimeType(String(formData.get("mimeType") || "").trim(), title);
    const chunk = formData.get("chunk") as File | null;

    if (!uploadId || !Number.isFinite(index) || !Number.isFinite(totalChunks) || !title || !chunk) {
      return fail("Missing upload chunk data.", 400);
    }

    const chunkData = Buffer.from(await chunk.arrayBuffer());
    await PresentationUploadChunkModel.findOneAndUpdate(
      { uploadId, index },
      {
        uploadId,
        index,
        totalChunks,
        title,
        type,
        date,
        slides,
        originalName,
        mimeType,
        chunkData,
      },
      { upsert: true, new: true },
    );

    return ok({ uploadId, index, totalChunks });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to upload presentation chunk.", 500);
  }
}