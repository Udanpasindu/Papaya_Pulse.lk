import { clearAuthCookie } from "@/lib/auth";
import { ok } from "@/lib/api-helpers";

export async function POST() {
  clearAuthCookie();
  return ok({ loggedOut: true });
}
