import {csrFetch} from "@/api/utils/csrFetch";

export const getComment = async (id: number) => {
    const endpoint = `comments?board_id=${id}`;

    const data = await csrFetch(endpoint, {
        method: "GET",
    });

    return data;
};