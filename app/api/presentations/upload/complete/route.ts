import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationModel } from "@/lib/models/Presentation";
import { PresentationUploadChunkModel } from "@/lib/models/PresentationUploadChunk";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function withResolvedFileUrl(doc: Record<string, unknown>) {
  return {
    ...doc,
    fileUrl: doc._id ? `/api/presentations/file/${String(doc._id)}` : String(doc.fileUrl || ""),
    fileData: undefined,
  };
}

async function writeChunksToGridFs(uploadId: string, title: string, mimeType: string) {
  if (!mongoose.connection.db) {
    throw new Error("Database connection is unavailable.");
  }

  const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "presentations" });
  const chunks = await PresentationUploadChunkModel.find({ uploadId }).sort({ index: 1 }).lean();

  if (!chunks.length) {
    throw new Error("Upload chunks not found.");
  }

  const uploadStream = bucket.openUploadStream(title, { contentType: mimeType });
  const buffer = Buffer.concat(chunks.map((chunk) => Buffer.from(chunk.chunkData as Buffer)));
  await new Promise<void>((resolve, reject) => {
    uploadStream.once("error", reject);
    uploadStream.once("finish", () => resolve());
    uploadStream.end(buffer);
  });

  await PresentationUploadChunkModel.deleteMany({ uploadId });
  return uploadStream.id;
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();

    const body = await request.json();
    const uploadId = String(body?.uploadId || "").trim();

    if (!uploadId) {
      return fail("Missing upload ID.", 400);
    }

    const chunks = await PresentationUploadChunkModel.find({ uploadId }).sort({ index: 1 }).lean();
    if (!chunks.length) {
      return fail("Upload not found.", 404);
    }

    const totalChunks = chunks[0]?.totalChunks || 0;
    if (chunks.length !== totalChunks) {
      return fail("Upload is incomplete.", 400);
    }

    const first = chunks[0];
    const fileId = await writeChunksToGridFs(
      uploadId,
      String(first.title || "presentation"),
      String(first.mimeType || "application/octet-stream"),
    );

    const created = await PresentationModel.create({
      title: String(first.title || "presentation"),
      type: String(first.type || "General"),
      date: String(first.date || ""),
      slides: Number(first.slides || 0),
      mimeType: String(first.mimeType || "application/octet-stream"),
      hasBinary: true,
      fileId,
    });

    return ok(withResolvedFileUrl(created.toObject() as Record<string, unknown>));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to finalize presentation upload.", 500);
  }
}