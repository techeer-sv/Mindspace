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

export const useUserPostGetQuery = (
  id: number,
  isOpen: boolean,
  isActive: boolean,
) => {
  return useQuery(["userPost", id], () => getPost(id), {
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
    onSuccess: () => {
      queryClient.invalidateQueries(["userPost"]);
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["userPost", variables.id]);
      successAction();
    },
  });
};

export const usePostListGetQuery = (id: number) => {
  return useQuery(["postList", id], () => getPostListData(id));
};

export const usePostGetQuery = (id: number) => {
  return useQuery(["postData", id], () => getPostData(id));
};
