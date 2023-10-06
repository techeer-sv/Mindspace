import { useEffect } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
import { createUser, getAccessToken } from "@/api/auth";

// export const useUserNicknameQuery = (isLoggedIn: boolean) => {
//   return useQuery([KEY.USER_NICKNAME], getUserNickname, {
//     enabled: isLoggedIn,
//     staleTime: 1000 * 60 * 5,
//   });
// };

// export const useClearUserNicknameCache = (isLoggedIn: boolean) => {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     if (!isLoggedIn) {
//       queryClient.invalidateQueries(KEY.USER_NICKNAME);
//     }
//   }, [isLoggedIn, queryClient]);
// };

export const useSignUpMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  return useMutation(createUser, {
    onSuccess: () => {
      successAction();
    },
    onError: (error: any) => {
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
    onError: (error: any) => {
      errorAction(error.errorMessage);
    },
  });
};
