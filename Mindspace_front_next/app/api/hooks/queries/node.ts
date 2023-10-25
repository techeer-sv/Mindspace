import { useQuery } from "@tanstack/react-query";
import { getNodeList } from "@/api/node";
import { NODE_QUERIES } from "@/constants/queryKeys";

export const useNodeListQuery = () => {
  return useQuery([NODE_QUERIES.LIST], getNodeList, {
    staleTime: Infinity,
  });
};
