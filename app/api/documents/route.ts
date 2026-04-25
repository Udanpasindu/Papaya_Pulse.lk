import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { DocumentModel } from "@/lib/models/Document";
import { fail, getSearchQuery, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function withResolvedFileUrl(doc: Record<string, unknown>) {
  const hasBinary = Boolean(doc.hasBinary) || Boolean(doc.fileData) || Boolean(doc.fileId);
  return {
    ...doc,
    fileUrl: hasBinary && doc._id ? `/api/documents/file/${String(doc._id)}` : String(doc.fileUrl || ""),
    fileData: undefined,
  };
}

function hasUsableDocumentFile(doc: Record<string, unknown>) {
  const directUrl = String(doc.fileUrl || "").trim();
  return Boolean(doc.hasBinary) || Boolean(doc.fileData) || Boolean(doc.fileId) || directUrl.length > 0;
}

export async function GET(request: NextRequest) {
  try {
    await bootstrapData();
    const q = getSearchQuery(request.url);
    const filter = q
      ? {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
          ],
        }
      : {};

    const items = await DocumentModel.find(filter)
      .select("title fileUrl hasBinary fileData mimeType category size date createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const filtered = items
      .filter((item) => hasUsableDocumentFile(item as Record<string, unknown>))
      .map((item) => withResolvedFileUrl(item as Record<string, unknown>));

    return okWithHeaders(filtered, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to fetch documents.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const file = form.get("file") as File | null;
      const title = String(form.get("title") || file?.name || "").trim();
      const category = String(form.get("category") || "Charter").trim();
      const date = String(form.get("date") || "").trim();

      if (!file || !title) {
        return fail("File and title are required.", 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const created = await DocumentModel.create({
        title,
        category,
        date,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        mimeType: String(file.type || "application/octet-stream"),
        fileData: buffer,
        hasBinary: true,
      });

      const plain = created.toObject();
      return ok(withResolvedFileUrl(plain as Record<string, unknown>), 201);
    }

    const body = await request.json();
    const payload = {
      title: String(body?.title || "").trim(),
      fileUrl: String(body?.fileUrl || "").trim(),
      mimeType: String(body?.mimeType || "").trim(),
      category: String(body?.category || "Charter").trim(),
      size: String(body?.size || "").trim(),
      date: String(body?.date || "").trim(),
    };

    if (!payload.title || !payload.fileUrl) {
      return fail("Title and file URL are required.", 400);
    }

    const created = await DocumentModel.create(payload);
    const plain = created.toObject();
    return ok(withResolvedFileUrl(plain as Record<string, unknown>), 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to create document.", 500);
  }
}
