import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '@/utils/types';
import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getPostListData,
  getPostData,
} from '@/api/Post';
import { AxiosError } from 'axios';

export const useUserPostGetQuery = (
  id: number,
  isOpen: boolean,
  isActive: boolean,
) => {
  return useQuery(['userPost', id], () => getPost(id), {
    enabled: isOpen && isActive,
  });
};

export const useDeletePostMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation(deletePost, {
    onSuccess: () => {
      queryClient.invalidateQueries(['userPost']);
      successAction();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error?.response.data?.errorCode === 'B005') {
        errorAction('삭제할 수 없는 글이거나 이미 삭제된 글입니다.');
      } else {
        errorAction('기타 에러가 발생하였습니다.');
      }
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
      queryClient.invalidateQueries(['userPost']);
      successAction();
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error?.response.data?.errorCode === 'B002') {
        errorAction('제목을 입력해주세요');
      } else if (error?.response?.data?.errorCode === 'B003') {
        errorAction('내용을 입력해주세요');
      } else if (error?.response?.data?.errorCode === 'B004') {
        errorAction('이미 작성된 노드에 대한 작성 요청입니다.');
      } else {
        errorAction('기타 에러가 발생하였습니다.');
      }
    },
  });
};

export const useUpdatePostMutation = (successAction: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(updatePost, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['userPost', variables.id]);
      successAction();
    },
  });
};

export const usePostListGetQuery = (id: number) => {
  return useQuery(['postList', id], () => getPostListData(id));
};

export const usePostGetQuery = (id: number) => {
  return useQuery(['postData', id], () => getPostData(id));
};
