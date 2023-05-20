import { useEffect } from 'react';
import { useQueryClient, useQuery } from 'react-query';
import { getUserNickname } from 'api/Auth';
import { KEY } from 'utils/constants';

export const useUserNicknameQuery = (isLoggedIn: boolean) => {
  return useQuery([KEY.USER_NICKNAME], getUserNickname, {
    enabled: isLoggedIn,
    staleTime: 1000 * 60 * 5,
  });
};

export const useClearUserNicknameCache = (isLoggedIn: boolean) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.invalidateQueries(KEY.USER_NICKNAME);
    }
  }, [isLoggedIn, queryClient]);
};
