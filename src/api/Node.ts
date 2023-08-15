import axios from '@/utils/baseAxios';
import { GraphData } from '@/utils/types';

export const getNodeList = async (): Promise<GraphData> => {
  const response = await axios.get('node/check');

  const nodeList = {
    nodes: response.data.nodes,
    links: response.data.links,
  };

  return nodeList;
};
