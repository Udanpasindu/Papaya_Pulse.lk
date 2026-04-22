export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function apiGet<T>(url: string, cache: RequestCache = "force-cache"): Promise<T> {
  const res = await fetch(url, { cache });
  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Request failed.");
  }
  return json.data;
}

export async function apiSend<T>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" },
    body: body ? (body instanceof FormData ? body : JSON.stringify(body)) : undefined,
    credentials: "include",
  });

  const raw = await res.text();
  let json: ApiResponse<T> | null = null;
  if (raw) {
    try {
      json = JSON.parse(raw) as ApiResponse<T>;
    } catch {
      json = null;
    }
  }
  if (!res.ok || !json || !json.success) {
    const message = json?.message || (res.status === 401 ? "Unauthorized" : `Request failed (${res.status}).`);
    throw new Error(message);
  }

  return json.data;
}
