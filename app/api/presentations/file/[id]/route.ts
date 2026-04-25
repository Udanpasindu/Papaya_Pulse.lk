import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { Readable } from "stream";
import { GridFSBucket } from "mongodb";
import { bootstrapData } from "@/lib/bootstrap";
import { PresentationModel } from "@/lib/models/Presentation";
import { fail } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function getContentType(mimeType: string | undefined, title: string | undefined) {
  const raw = String(mimeType || "").trim().toLowerCase();
  if (raw) return raw;
  const name = String(title || "").toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  return "application/octet-stream";
}

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
      return fail("Presentation not found.", 404);
    }

    const item = (await PresentationModel.findById(params.id)
      .select("title mimeType fileData fileUrl fileId")
      .lean()) as {
      title?: string;
      mimeType?: string;
      fileData?: unknown;
      fileUrl?: string;
      fileId?: unknown;
    } | null;

    if (!item) {
      return fail("Presentation not found.", 404);
    }

    const filename = encodeURIComponent(String(item.title || "presentation"));
    const contentType = getContentType(item.mimeType, item.title);

    if (item.fileId && mongoose.connection.db) {
      const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: "presentations" });
      const fileId = Types.ObjectId.isValid(String(item.fileId)) ? new Types.ObjectId(String(item.fileId)) : null;
      if (fileId) {
        const exists = await bucket.find({ _id: fileId }).limit(1).toArray();
        if (!exists.length) {
          return fail("Presentation file is unavailable.", 404);
        }
        const downloadStream = bucket.openDownloadStream(fileId);
        return new Response(Readable.toWeb(downloadStream) as unknown as BodyInit, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filename}"`,
            "Cache-Control": "no-store",
          },
        });
      }
    }

    if (item.fileData) {
      const bytes = normalizeBinary(item.fileData);
      if (!bytes) {
        return fail("Presentation data is unavailable.", 404);
      }
      const normalized = new Uint8Array(Array.from(bytes));
      const blob = new Blob([normalized], { type: contentType });
      return new Response(blob, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${encodeURIComponent(String(item.title || "presentation"))}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    const fileUrl = String(item.fileUrl || "").trim();
    if (fileUrl.startsWith("data:")) {
      const commaIndex = fileUrl.indexOf(",");
      if (commaIndex === -1) {
        return fail("Invalid presentation data.", 400);
      }

      const meta = fileUrl.slice(5, commaIndex);
      const body = fileUrl.slice(commaIndex + 1);
      const isBase64 = meta.includes(";base64");
      const mimeType = meta.split(";")[0] || "application/octet-stream";
      const bytes = isBase64
        ? Uint8Array.from(Buffer.from(body, "base64"))
        : Uint8Array.from(Buffer.from(decodeURIComponent(body), "utf-8"));

      return new Response(bytes, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Content-Disposition": `inline; filename="${encodeURIComponent(String(item.title || "presentation"))}"`,
          "Cache-Control": "no-store",
        },
      });
    }

    return fail("Presentation file is unavailable.", 404);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to load presentation.", 500);
  }
}
