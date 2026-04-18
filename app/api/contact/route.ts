import { NextRequest } from "next/server";
import { bootstrapData } from "@/lib/bootstrap";
import { ContactMessageModel } from "@/lib/models/ContactMessage";
import { fail, ok } from "@/lib/api-helpers";

export async function POST(request: NextRequest) {
  try {
    await bootstrapData();
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return fail("Name, email and message are required.", 400);
    }

    const created = await ContactMessageModel.create({
      name: String(body.name),
      email: String(body.email),
      message: String(body.message),
    });

    return ok(created, 201);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to send contact message.", 500);
  }
}
