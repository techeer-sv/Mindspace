import { csrFetch } from "./utils/csrFetch";
import { CreateBoardRequest } from "@/constants/types";
export const getBoard = async (id: number) => {
  const endpoint = `boards?node_id=${id}`;

  const data = await csrFetch(endpoint, {
    method: "GET",
  });

  return data;
};

export const deleteBoard = async (id: number) => {
  const endpoint = `boards?node_id=${id}`;

  await csrFetch(endpoint, {
    method: "DELETE",
  });
};

export const createBoard = async ({
  id,
  title,
  content,
}: CreateBoardRequest) => {
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

export const updateBoard = async ({
  id,
  title,
  content,
}: CreateBoardRequest) => {
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

export const getBoardListData = async (id?: number, afterCursor?: string) => {
  const endpoint = `boards/all?node_id=${id}&afterCursor=${afterCursor}`;

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
