import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { fail, requireAuth, ok } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    requireAuth();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return fail("No file uploaded.", 400);
    }

    const ext = path.extname(file.name).toLowerCase();
    const allowed = [".pdf", ".ppt", ".pptx", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".webp"];
    if (!allowed.includes(ext)) {
      return fail("Unsupported file format.", 400);
    }

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    
    // On production (Vercel), use a mock URL since filesystem is ephemeral
    // In local development, write to disk
    if (process.env.NODE_ENV === "production") {
      return ok({
        fileUrl: `/uploads/${safeName}`,
        originalName: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, safeName), buffer);

    return ok({
      fileUrl: `/uploads/${safeName}`,
      originalName: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Upload failed.", 500);
  }
}
