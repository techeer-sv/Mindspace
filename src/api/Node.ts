import axios from 'axios';
import { NodeObject, Node } from '@/utils/types';

/**
 * 작성자 : 태원
 * 날짜 : 4/20
 * 내용 : Link의 경우 백엔드 개발 전 까지 임시로 더미데이터를 사용합니다. 이에 따라 Node객체의 connect_count값도
 * 더미 데이터 기반의 정보를 프론트에서 가공해서 사용합니다.
 */

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
      target: 4,
    },
    {
      source: 1,
      target: 5,
    },
    {
      source: 3,
      target: 6,
    },
    {
      source: 3,
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
      source: 3,
      target: 10,
    },
    {
      source: 1,
      target: 11,
    },
    {
      source: 7,
      target: 12,
    },
    {
      source: 7,
      target: 13,
    },
    {
      source: 7,
      target: 14,
    },
    {
      source: 7,
      target: 15,
    },
    {
      source: 12,
      target: 16,
    },
    {
      source: 12,
      target: 17,
    },
    {
      source: 18,
      target: 19,
    },
    {
      source: 5,
      target: 20,
    },
    {
      source: 21,
      target: 22,
    },
    {
      source: 21,
      target: 25,
    },
    {
      source: 21,
      target: 26,
    },
    {
      source: 22,
      target: 23,
    },
    {
      source: 22,
      target: 24,
    },
    {
      source: 27,
      target: 19,
    },
    {
      source: 27,
      target: 28,
    },
    {
      source: 27,
      target: 29,
    },
    {
      source: 27,
      target: 30,
    },
    {
      source: 27,
      target: 31,
    },
    {
      source: 27,
      target: 32,
    },
    {
      source: 27,
      target: 33,
    },
  ];

  const nodeList = {
    nodes: nodeData.nodes.map((node: Node) => {
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
