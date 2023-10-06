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
    authHeader.Authorization = `${accessToken}`;
    // TODO 향후 Bearer(혹은 기타 토큰타입) 를 붙여 토큰정보를 보낼 것
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
