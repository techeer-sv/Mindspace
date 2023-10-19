import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIErrorResponse } from "@/constants/types";
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPostListData,
  getPostData,
} from "@/api/post";

import { BOARD_QUERIES } from "@/constants/queryKeys";

export const useUserPostGetQuery = (
  id: number,
  isOpen: boolean,
  isActive: boolean,
) => {
  return useQuery([BOARD_QUERIES.USER_BOARD(id)], () => getPost(id), {
    enabled: isOpen && isActive,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeletePostMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  return useMutation(deletePost, {
    onSuccess: () => {
      successAction();
    },
    onError: (error: APIErrorResponse) => {
      errorAction(error.errorMessage);
    },
  });
};

export const useCreatePostMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation(createPost, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([BOARD_QUERIES.USER_BOARD(variables.id)]);
      successAction();
    },
    onError: (error: APIErrorResponse) => {
      errorAction(error.errorMessage);
    },
  });
};

export const useUpdatePostMutation = (successAction: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(updatePost, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([BOARD_QUERIES.USER_BOARD(variables.id)]);
      successAction();
    },
  });
};

export const usePostListGetQuery = (nodeId?: number) => {
  return useQuery(
    [BOARD_QUERIES.ALL_BOARD(nodeId!)],
    () => getPostListData(nodeId),
    {
      enabled: nodeId !== undefined,
    },
  );
};

export const usePostGetQuery = (boardId?: number) => {
  return useQuery(
    [BOARD_QUERIES.SINGLE_BOARD(boardId!)],
    () => getPostData(boardId),
    {
      enabled: boardId !== undefined,
    },
  );
};
