import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { bootstrapData } from "@/lib/bootstrap";
import { DocumentModel } from "@/lib/models/Document";
import { fail } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function normalizeBinary(input: unknown) {
  if (!input) return null;
  if (input instanceof Uint8Array) return input;
  const maybeBinary = input as { buffer?: ArrayLike<number> };
  if (maybeBinary.buffer) {
    return Uint8Array.from(maybeBinary.buffer);
  }
  return Uint8Array.from(Buffer.from(input as Buffer));
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return fail("Document not found.", 404);
    }

    const item = (await DocumentModel.findById(params.id)
      .select("title mimeType fileData fileUrl")
      .lean()) as {
      title?: string;
      mimeType?: string;
      fileData?: unknown;
      fileUrl?: string;
    } | null;

    if (!item) {
      return fail("Document not found.", 404);
    }

    if (item.fileData) {
      const filename = encodeURIComponent(String(item.title || "document"));
      const bytes = normalizeBinary(item.fileData);
      if (!bytes) {
        return fail("Document data is unavailable.", 404);
      }
      const normalized = new Uint8Array(Array.from(bytes));
      const blob = new Blob([normalized], { type: String(item.mimeType || "application/octet-stream") });
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": String(item.mimeType || "application/octet-stream"),
          "Content-Disposition": `inline; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const fileUrl = String(item.fileUrl || "").trim();
    if (fileUrl.startsWith("data:")) {
      const commaIndex = fileUrl.indexOf(",");
      if (commaIndex === -1) {
        return fail("Invalid document data.", 400);
      }

      const meta = fileUrl.slice(5, commaIndex);
      const body = fileUrl.slice(commaIndex + 1);
      const isBase64 = meta.includes(";base64");
      const mimeType = meta.split(";")[0] || "application/octet-stream";

      const bytes = isBase64
        ? Uint8Array.from(Buffer.from(body, "base64"))
        : Uint8Array.from(Buffer.from(decodeURIComponent(body), "utf-8"));

      const filename = encodeURIComponent(String(item.title || "document"));
      return new Response(bytes, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename="${filename}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return fail("Document file is unavailable.", 404);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to load document.", 500);
  }
}
