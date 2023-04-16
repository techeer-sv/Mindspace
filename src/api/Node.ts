import axios from 'axios';

interface NodeData {
  id: number;
  title: string;
  content: string;
}

export const getNodeData = async (): Promise<NodeData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Loading 테스트
  const res = await axios.get('../dummy/getNodeInfo.json');
  const data = res.data;

  return data;
};
