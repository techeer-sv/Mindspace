import Cookies from "js-cookie";
import { baseFetch } from "./baseFetch";

export const csrFetch = async <T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const accessToken = Cookies.get("accessToken");
  const authHeader: Record<string, string> = {};

  if (accessToken) {
    authHeader.Authorization = `${accessToken}`;
  }

  return baseFetch<T>(endpoint, authHeader, options);
};
