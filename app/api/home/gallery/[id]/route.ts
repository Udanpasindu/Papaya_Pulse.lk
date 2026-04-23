import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { bootstrapData } from "@/lib/bootstrap";
import { HomeContentModel } from "@/lib/models/HomeContent";
import { HomeGalleryImageModel } from "@/lib/models/HomeGalleryImage";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

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
      return fail("Gallery image not found.", 404);
    }

    const item = (await HomeGalleryImageModel.findById(params.id)
      .select("title mimeType fileData")
      .lean()) as { title?: string; mimeType?: string; fileData?: unknown } | null;

    if (!item || !item.fileData) {
      return fail("Gallery image not found.", 404);
    }

    const bytes = normalizeBinary(item.fileData);
    if (!bytes) {
      return fail("Gallery image data is unavailable.", 404);
    }

    const normalized = new Uint8Array(Array.from(bytes));
    const blob = new Blob([normalized], { type: String(item.mimeType || "image/jpeg") });
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": String(item.mimeType || "image/jpeg"),
        "Content-Disposition": `inline; filename="${encodeURIComponent(String(item.title || "gallery-image"))}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to load gallery image.", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth();
    await bootstrapData();

    if (!Types.ObjectId.isValid(params.id)) {
      return ok({ deleted: true, existed: false });
    }

    const removedUrl = `/api/home/gallery/${params.id}`;
    await HomeGalleryImageModel.findByIdAndDelete(params.id).lean();

    const home = await HomeContentModel.findOne();
    if (home) {
      home.gallery = (home.gallery || []).filter((item: string) => item !== removedUrl);
      await home.save();
    }

    return ok({ deleted: true, existed: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to delete gallery image.", 500);
  }
}