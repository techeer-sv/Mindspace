import { useEffect } from 'react';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import { getUserNickname, createUser, getAccessToken } from '@/api/Auth';
import { KEY } from '@/assets/constants';
import { AxiosError } from 'axios';
import { ErrorResponse } from '@/utils/types';

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

export const useSignUpMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  return useMutation(createUser, {
    onSuccess: () => {
      successAction();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error?.response.data?.errorCode === 'U004') {
        errorAction('이미 사용중인 이메일 입니다');
      } else if (error?.response?.data?.errorCode === 'U003') {
        errorAction('이미 사용중인 닉네임 입니다');
      } else {
        errorAction('기타 에러가 발생하였습니다.');
      }
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
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error?.response.data?.errorCode === 'U001') {
        errorAction('존재하지 않는 계정입니다');
      } else if (error?.response?.data?.errorCode === 'U002') {
        errorAction('비밀번호를 다시 확인해주세요');
      } else {
        errorAction('기타 에러가 발생하였습니다.');
      }
    },
  });
};
