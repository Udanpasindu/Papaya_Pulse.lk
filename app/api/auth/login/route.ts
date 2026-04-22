import { NextRequest } from "next/server";
import { comparePassword, setAuthCookie, signToken } from "@/lib/auth";
import { ok, fail } from "@/lib/api-helpers";
import { bootstrapData } from "@/lib/bootstrap";
import { UserModel } from "@/lib/models/User";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    await bootstrapData();
    const body = await request.json();
    const email = String(body.email || "").toLowerCase().trim();
    const password = String(body.password || "");

    if (!email || !password) {
      return fail("Email and password are required.", 400);
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return fail("Invalid credentials.", 401);
    }

    const valid = await comparePassword(password, String(user.password));
    if (!valid) {
      return fail("Invalid credentials.", 401);
    }

    const token = signToken({ userId: String(user._id), email: String(user.email) });
    setAuthCookie(token);

    return ok({ email: String(user.email), id: String(user._id) });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Login failed.", 500);
  }
}
