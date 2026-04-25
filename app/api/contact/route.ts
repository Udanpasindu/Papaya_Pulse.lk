import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { ContactMessageModel } from "@/lib/models/ContactMessage";
import { fail, ok, okWithHeaders, requireAuth } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    requireAuth();
    await bootstrapData();

    const url = new URL(request.url);
    const limitRaw = Number(url.searchParams.get("limit") || 0);
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 200) : 0;

    const query = ContactMessageModel.find()
      .select("name email message createdAt updatedAt")
      .sort({ createdAt: -1 });

    const items = limit ? await query.limit(limit).lean() : await query.lean();
    return okWithHeaders(items, 200, { "Cache-Control": "no-store" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return fail("Unauthorized", 401);
    }
    return fail(error instanceof Error ? error.message : "Failed to load contact messages.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    await bootstrapData();
    const body = await request.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return fail("Name, email and message are required.", 400);
    }

    const created = await ContactMessageModel.create({
      name,
      email,
      message,
    });

    return ok(created, 201);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to send contact message.", 500);
  }
}
