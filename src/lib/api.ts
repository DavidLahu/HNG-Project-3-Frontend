const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: HeadersInit = {
    "X-API-Version": "1",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  let res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  // Intercept 401 Unauthorized for token refresh
  if (res.status === 401 && path !== "/auth/refresh") {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Web cookie flow
      })
        .then((refreshRes) => {
          if (!refreshRes.ok) throw new Error("Refresh failed");
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    try {
      await refreshPromise;
      // Refresh succeeded, retry original request
      res = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      });
    } catch {
      // Refresh failed or we failed again after refresh
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      throw new Error("Unauthorized");
    }
  }

  // If it's STILL 401 after retry (or it was the /auth/refresh endpoint itself failing)
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    let errorMessage = "Unknown error";
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail?.message || errorData.message || JSON.stringify(errorData);
    } catch {
      errorMessage = await res.text().catch(() => "Unknown error");
    }
    throw new Error(`API Error: ${errorMessage}`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}
