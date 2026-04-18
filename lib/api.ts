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

  const json = (await res.json()) as ApiResponse<T>;
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Request failed.");
  }

  return json.data;
}
