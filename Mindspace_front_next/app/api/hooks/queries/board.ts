import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { APIErrorResponse } from "@/constants/types";
import {
  createBoard,
  updateBoard,
  deleteBoard,
  getBoard,
  getBoardListData,
  getBoardData,
  uploadImage,
} from "@/api/board";

import { BOARD_QUERIES } from "@/constants/queryKeys";

export const useUserBoardGetQuery = (
  id: number,
  isOpen: boolean,
  isActive: boolean,
) => {
  return useQuery([BOARD_QUERIES.USER_BOARD(id)], () => getBoard(id), {
    enabled: isOpen && isActive,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDeleteBoardMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  return useMutation(deleteBoard, {
    onSuccess: () => {
      successAction();
    },
    onError: (error: APIErrorResponse) => {
      errorAction(error.message);
    },
  });
};

export const useCreateBoardMutation = (
  successAction: () => void,
  errorAction: (message: string) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation(createBoard, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([BOARD_QUERIES.USER_BOARD(variables.id)]);
      successAction();
    },
    onError: (error: APIErrorResponse) => {
      errorAction(error.message);
    },
  });
};

export const useUpdateBoardMutation = (successAction: () => void) => {
  const queryClient = useQueryClient();

  return useMutation(updateBoard, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries([BOARD_QUERIES.USER_BOARD(variables.id)]);
      successAction();
    },
  });
};

export const useBoardListGetQuery = (nodeId?: number, afterCursor?: string) => {
  return useQuery(
    [BOARD_QUERIES.ALL_BOARD(nodeId!)],
    () => getBoardListData(nodeId, afterCursor),
    {
      enabled: nodeId !== undefined,
    },
  );
};

export const useBoardGetQuery = (boardId?: number) => {
  return useQuery(
    [BOARD_QUERIES.SINGLE_BOARD(boardId!)],
    () => getBoardData(boardId),
    {
      enabled: boardId !== undefined,
    },
  );
};

export const useUploadImageMutation = () => {
  return useMutation(uploadImage);
};
