import { useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { createUser, getAccessToken, getUserNickname } from "@/api/auth";
import { USER_QUERIES } from "@/constants/queryKeys";
import { FIVE_MINUTES_IN_MILLISECONDS } from "@/constants/common";
import { APIErrorResponse } from "@/constants/types";

export const useUserNicknameQuery = (isLoggedIn: boolean) => {
  return useQuery([USER_QUERIES.NICKNAME], getUserNickname, {
    enabled: isLoggedIn,
    staleTime: FIVE_MINUTES_IN_MILLISECONDS,
  });
};

export const useClearUserNicknameCache = (isLoggedIn: boolean) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoggedIn) {
      queryClient.invalidateQueries(USER_QUERIES.NICKNAME);
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
    onError: (error: APIErrorResponse) => {
      errorAction(error.errorMessage);
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
    onError: (error: APIErrorResponse) => {
      errorAction(error.errorMessage);
    },
  });
};
