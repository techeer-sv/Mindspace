const VERSION = "api/v1/";
const BASEURL = `${process.env.NEXT_PUBLIC_API_URL}${VERSION}`;

const defaultHeaders = {
  "Content-Type": "application/json",
};

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

export const baseFetch = async <T = any>(
  endpoint: string,
  headers: HeadersInit,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${BASEURL}${endpoint}`, {
    ...options,
    headers: new Headers({
      ...defaultHeaders,
      ...headers,
      ...options?.headers,
    }),
  });

  return handleResponse<T>(response);
};
