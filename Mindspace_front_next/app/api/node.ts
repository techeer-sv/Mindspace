import { csrFetch } from "./utils/csrFetch";
import { GraphData } from "@/constants/types";

export const getNodeList = async (): Promise<GraphData> => {
  const endpoint = "node/check";

  const response = await csrFetch<GraphData>(endpoint, {
    method: "GET",
  });

  const nodeList = {
    nodes: response.nodes,
    links: response.links,
  };

  return nodeList;
};
