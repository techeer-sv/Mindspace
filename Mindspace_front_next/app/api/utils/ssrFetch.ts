import { cookies } from "next/headers";
import { baseFetch } from "./baseFetch";

export const ssrFetch = async <T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const nextCookies = cookies();
  const accessToken = nextCookies.get("accessToken")?.value;

  const authHeader: Record<string, string> = {};

  if (accessToken) {
    authHeader.Authorization = `${accessToken}`;
  }

  return baseFetch<T>(endpoint, authHeader, options);
};
