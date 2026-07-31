type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T | null;
};

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const json: ApiResponse<T> = await res.json();

  if (json.status === "error" || !res.ok) {
    throw new Error(json.message || "Request failed");
  }

  return json.data as T;
}
