import { csrFetch } from "./utils/csrFetch";
import { CreateBoardRequest } from "@/constants/types";
import { createQueryString } from "./utils/fetchUtils";

export const getBoard = async (id: number) => {
  const queryString = createQueryString({ node_id: id });
  const endpoint = `boards?${queryString}`;

  const data = await csrFetch(endpoint, {
    method: "GET",
  });

  return data;
};

export const deleteBoard = async (id: number) => {
  const queryString = createQueryString({ node_id: id });
  const endpoint = `boards?${queryString}`;

  await csrFetch(endpoint, {
    method: "DELETE",
  });
};

export const createBoard = async ({
  id,
  title,
  content,
}: CreateBoardRequest) => {
  const queryString = createQueryString({ node_id: id });
  const endpoint = `boards?${queryString}`;
  const body = JSON.stringify({
    title,
    content,
  });

  await csrFetch(endpoint, {
    method: "POST",
    body: body,
  });
};

export const updateBoard = async ({
  id,
  title,
  content,
}: CreateBoardRequest) => {
  const queryString = createQueryString({ node_id: id });
  const endpoint = `boards?${queryString}`;
  const body = JSON.stringify({
    title,
    content,
  });

  await csrFetch(endpoint, {
    method: "PUT",
    body: body,
  });
};

export const getBoardListData = async (id?: number, afterCursor?: string) => {
  const queryString = createQueryString({
    node_id: id,
    afterCursor: afterCursor,
  });
  const endpoint = `boards/all?${queryString}`;

  const data = await csrFetch(endpoint, {
    method: "GET",
  });

  return data;
};

export const getBoardData = async (id?: number) => {
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
