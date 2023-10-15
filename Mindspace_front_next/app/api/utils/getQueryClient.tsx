import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
// 싱글톤 인스턴스를 만들어 하나의 QueryClient를 생성
