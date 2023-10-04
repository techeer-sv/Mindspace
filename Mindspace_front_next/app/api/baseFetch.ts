const VERSION = "api/v1/";
const BASEURL = `${process.env.NEXT_PUBLIC_API_URL}${VERSION}`;

const defaultHeaders = {
  "Content-Type": "application/json",
};

export async function baseFetch<T = any>(
  endpoint: string,
  options?: RequestInit,
) {
  const accessToken = localStorage.getItem("accessToken");

  const authHeader: Record<string, string> = {};
  if (accessToken) {
    authHeader.Authorization = `Bearer ${accessToken}`;
  }
  const combinedHeaders = {
    ...defaultHeaders,
    ...authHeader,
    ...options?.headers,
  };

  const response = await fetch(`${BASEURL}${endpoint}`, {
    ...options,
    headers: new Headers(combinedHeaders),
  });

  return handleResponse<T>(response);
}

class ApiError extends Error {
  constructor(
    public code: string,
    message?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJson) {
      throw data;
    }
    throw new Error(data.message || response.statusText);
  }

  return data as T;
}
