"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

export function useApi<T>(url: string, cache: RequestCache = "force-cache") {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    apiGet<T>(url, cache)
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [url, cache]);

  return { data, loading, error, setData };
}
