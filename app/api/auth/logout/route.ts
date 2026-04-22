import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

export async function POST() {
  clearAuthCookie();
  return ok({ loggedOut: true });
}
