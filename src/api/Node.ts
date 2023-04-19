import axios from 'axios';
import { NodeObject } from 'utils/types';

export const getNodeList = async (): Promise<NodeObject> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Loading 테스트
  const res = await axios.get('../dummy/nodeList.json');
  const nodeData = res.data;

  const dummyLink = [
    {
      source: 1,
      target: 2,
    },
    {
      source: 1,
      target: 3,
    },
    {
      source: 2,
      target: 4,
    },
    {
      source: 2,
      target: 5,
    },
    {
      source: 2,
      target: 6,
    },
    {
      source: 2,
      target: 7,
    },
    {
      source: 3,
      target: 8,
    },
    {
      source: 3,
      target: 9,
    },
    {
      source: 10,
      target: 11,
    },
  ];

  const nodeList = {
    nodes: nodeData.nodes.map((node: any) => {
      const connectCount = dummyLink.reduce((acc, link) => {
        if (link.source === node.id || link.target === node.id) {
          acc += 1;
        }
        return acc;
      }, 0);

      return {
        ...node,
        connect_count: connectCount,
      };
    }),
    links: dummyLink,
  };

  return nodeList;
};
