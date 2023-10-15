import { csrFetch } from "./utils/csrFetch";

export const getPost = async (id: number) => {
  const endpoint = `boards?node_id=${id}`;

  const data = await csrFetch(endpoint, {
    method: "GET",
  });

  return data;
};

export const deletePost = async (id: number) => {
  const endpoint = `boards?node_id=${id}`;

  await csrFetch(endpoint, {
    method: "DELETE",
  });
};

interface PostParams {
  id: number;
  title: string;
  content: string;
}

export const createPost = async ({ id, title, content }: PostParams) => {
  const endpoint = `boards?node_id=${id}`;
  const body = JSON.stringify({
    title,
    content,
  });

  await csrFetch(endpoint, {
    method: "POST",
    body: body,
  });
};

export const updatePost = async ({ id, title, content }: PostParams) => {
  const endpoint = `boards?node_id=${id}`;
  const body = JSON.stringify({
    title,
    content,
  });

  await csrFetch(endpoint, {
    method: "PUT",
    body: body,
  });
};

export const getPostListData = async (id?: number) => {
  const endpoint = `boards/all?node_id=${id}`;

  const data = await csrFetch(endpoint, {
    method: "GET",
  });

  return data;
};

export const getPostData = async (id?: number) => {
  if (id !== null) {
    const endpoint = `boards/${id}`;

    const data = await csrFetch(endpoint, {
      method: "GET",
    });

    return data;
  } else {
    return;
  }
};
