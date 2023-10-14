import { ssrFetch } from "./utils/ssrFetch";
import { GraphData } from "@/constants/types";

export const getNodeListSSR = async (): Promise<GraphData> => {
  const endpoint = "node/check";

  const response = await ssrFetch<GraphData>(endpoint, {
    method: "GET",
  });

  const nodeList = {
    nodes: response.nodes,
    links: response.links,
  };

  return nodeList;
};
