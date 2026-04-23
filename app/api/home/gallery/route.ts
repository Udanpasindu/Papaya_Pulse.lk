import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { HomeContentModel } from "@/lib/models/HomeContent";
import { HomeGalleryImageModel } from "@/lib/models/HomeGalleryImage";
import { fail, ok, requireAuth } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return fail("No file uploaded.", 400);
    }

    if (!file.type.startsWith("image/")) {
      return fail("Unsupported image format.", 400);
    }

    const title = String(formData.get("title") || file.name || "gallery-image").trim();
    const buffer = Buffer.from(await file.arrayBuffer());
    const created = await HomeGalleryImageModel.create({
      title,
      fileData: buffer,
      mimeType: String(file.type || "image/jpeg"),
    });

    const url = `/api/home/gallery/${created._id}`;
    const home = await HomeContentModel.findOne();

    if (home) {
      const gallery = Array.isArray(home.gallery) ? home.gallery.filter((item: string) => typeof item === "string") : [];
      home.gallery = [...gallery, url];
      await home.save();
    }

    return ok({ fileUrl: url, originalName: file.name, title });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Image upload failed.", 500);
  }
}