import {csrFetch} from "@/api/utils/csrFetch";
import {CreateCommentRequest} from "@/constants/types";

export const getComment = async (id: number | undefined) => {
    const endpoint = `comments?board_id=${id}`;

    const data = await csrFetch(endpoint, {
        method: "GET",
    });

    return data;
};
export const createComment = async ({
                                        boardId,
                                        commentId,
                                        content,
                                    }: CreateCommentRequest) => {
    const endpoint = `comments?board_id=${boardId}${commentId ? `&comment_id=${commentId}` : ''}`;
    const body = JSON.stringify({
        content,
    });

    await csrFetch(endpoint, {
        method: "POST",
        body: body,
    });
};