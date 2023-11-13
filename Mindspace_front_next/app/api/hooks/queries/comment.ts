import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {BOARD_QUERIES, COMMENT_QUERIES} from "@/constants/queryKeys";
import {createComment, getComment} from "@/api/comment";
import {createBoard} from "@/api/board";
import {APIErrorResponse} from "@/constants/types";

export const useBoardCommentGetQuery = (
    id: number | undefined,
) => {
    return useQuery([COMMENT_QUERIES.BOARD_COMMENT(id)], () => getComment(id))
}

export const useCreateCommentMutation = (
    successAction: () => void,
    errorAction: (message: string) => void,
) => {
    const queryClient = useQueryClient();

    return useMutation(createComment, {
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries([COMMENT_QUERIES.BOARD_COMMENT(variables.boardId)]);
            successAction();
        },
        onError: (error: APIErrorResponse) => {
            errorAction(error.errorMessage);
        },
    });
};