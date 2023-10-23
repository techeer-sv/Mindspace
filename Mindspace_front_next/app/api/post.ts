import { csrFetch } from "./utils/csrFetch";
import { CreatePostRequest } from "@/constants/types";
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

export const createPost = async ({ id, title, content }: CreatePostRequest) => {
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

export const updatePost = async ({ id, title, content }: CreatePostRequest) => {
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

export const uploadImage = async (file: File) => {
  const endpoint = `boards/image`;

  const formData = new FormData();
  formData.append("file", file);

  const data = await csrFetch(endpoint, {
    method: "POST",
    body: formData,
  });

  return data;
};
