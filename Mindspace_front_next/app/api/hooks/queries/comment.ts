import {useQuery} from "@tanstack/react-query";
import {COMMENT_QUERIES} from "@/constants/queryKeys";
import {getComment} from "@/api/comment";

export const useBoardCommentGetQuery = (
    id: number | undefined,
) => {
    return useQuery([COMMENT_QUERIES.BOARD_COMMENT(id)], () => getComment(id))
}