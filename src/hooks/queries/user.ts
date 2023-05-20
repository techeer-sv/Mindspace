import { useEffect } from 'react';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { getUserNickname, createUser, getAccessToken } from 'api/Auth';
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

// TODO 로그인, 회원가입에 대한 에러처리 필요
export const useSignUpMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  return useMutation(createUser, {
    onSuccess: () => {
      successAction();
    },
    onError: (error) => {
      errorAction('에러가 발생하였습니다 (임시문구)');
      console.log(error);
    },
  });
};

export const useSignInMutation = (
  successAction: (token: string) => void,
  errorAction: (message: string) => void,
) => {
  return useMutation(getAccessToken, {
    onSuccess: (accessToken) => {
      successAction(accessToken);
    },
    onError: (error) => {
      errorAction('에러가 발생하였습니다 (임시문구)');
      console.log(error);
    },
  });
};
