import { NextResponse } from "next/server";
import { getAuthCookie, verifyToken } from "@/lib/auth";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function okWithHeaders<T>(data: T, status = 200, headers?: HeadersInit) {
  return NextResponse.json({ success: true, data }, { status, headers });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function getSearchQuery(url: string) {
  const u = new URL(url);
  return (u.searchParams.get("q") || "").trim().toLowerCase();
}

export function requireAuth() {
  const token = getAuthCookie();
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }
  try {
    return verifyToken(token);
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
