import { cookies } from "next/headers";
import { baseFetch } from "./baseFetch";

export const ssrFetch = async <T = any>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> => {
  const nextCookies = cookies();
  const accessToken = nextCookies.get("accessToken")?.value;

  const authHeader: Record<string, string> = {};

  // FIXME Swagger이슈로 인해 향후 Authoization Header를 사용하게되면 수정해야합니다
  if (accessToken) {
    authHeader.user_id = `${accessToken}`;
  }

  return baseFetch<T>(endpoint, authHeader, options);
};
