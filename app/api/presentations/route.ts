import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationModel } from "@/lib/models/Presentation";
import { fail, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function withResolvedFileUrl(doc: Record<string, unknown>) {
  const hasBinary = Boolean(doc.hasBinary) || Boolean(doc.fileData) || Boolean(doc.fileId);
  return {
    ...doc,
    fileUrl: hasBinary && doc._id ? `/api/presentations/file/${String(doc._id)}` : String(doc.fileUrl || ""),
    fileData: undefined,
  };
}

function hasUsablePresentationFile(doc: Record<string, unknown>) {
  const directUrl = String(doc.fileUrl || "").trim();
  return Boolean(doc.hasBinary) || Boolean(doc.fileData) || Boolean(doc.fileId) || directUrl.length > 0;
}

export async function GET() {
  try {
    await bootstrapData();
    const items = await PresentationModel.find()
      .select("title fileUrl hasBinary fileId fileData mimeType type date slides createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const filtered = items
      .filter((item) => hasUsablePresentationFile(item as Record<string, unknown>))
      .map((item) => withResolvedFileUrl(item as Record<string, unknown>));

    return okWithHeaders(filtered, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch presentations.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const title = String(formData.get("title") || file?.name || "").trim();
      const type = String(formData.get("type") || "General").trim();
      const date = String(formData.get("date") || "").trim();
      const slides = Number(formData.get("slides") || 0);

      if (!file || !title) {
        return fail("File and title are required.", 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const created = await PresentationModel.create({
        title,
        type,
        date,
        slides,
        mimeType: String(file.type || "application/octet-stream"),
        fileData: buffer,
        hasBinary: true,
      });

      return ok(withResolvedFileUrl(created.toObject() as Record<string, unknown>), 201);
    }

    const body = await request.json();

    const payload = {
      title: String(body?.title || "").trim(),
      fileUrl: String(body?.fileUrl || "").trim(),
      mimeType: String(body?.mimeType || "").trim(),
      hasBinary: false,
      type: String(body?.type || "General").trim(),
      date: String(body?.date || "").trim(),
      slides: Number(body?.slides || 0),
    };

    if (!payload.title || !payload.fileUrl) {
      return fail("Title and file URL are required.", 400);
    }

    const created = await PresentationModel.create(payload);
    return ok(withResolvedFileUrl(created.toObject() as Record<string, unknown>), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to create presentation.", 500);
  }
}
