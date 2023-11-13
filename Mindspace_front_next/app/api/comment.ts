import {csrFetch} from "@/api/utils/csrFetch";
import {CreateBoardRequest, CreateCommentRequest, UpdateCommentRequest} from "@/constants/types";

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

export const updateComment = async ({
                                        commentId,
                                        content,
                                        boardId,
                                    }: UpdateCommentRequest) => {
    const endpoint = `comments/${commentId}`;
    const body = JSON.stringify({
        content,
    });

    await csrFetch(endpoint, {
        method: "PUT",
        body: body,
    });
};

export const deleteComment = async (id: number) => {
    const endpoint = `comments/${id}`;

    await csrFetch(endpoint, {
        method: "DELETE",
    });
};