import { useQuery } from 'react-query';
import { getNodeList } from '@/api/Node';
import { KEY } from '@/utils/constants';

export const useNodeListQuery = () => {
  return useQuery([KEY.NODE_LIST], getNodeList, {
    staleTime: Infinity,
  });
};
