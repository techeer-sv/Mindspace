import { csrFetch } from "./utils/csrFetch";
import {
  NicknameResponse,
  SignInResponse,
  SignInRequest,
  SignUpReqeust,
} from "@/constants/types";

export const createUser = async ({
  userName,
  email,
  password,
}: SignUpReqeust) => {
  const endpoint = "users/signup";
  const body = JSON.stringify({
    nickname: userName,
    email: email,
    password: password,
  });

  await csrFetch(endpoint, {
    method: "POST",
    body: body,
  });
};

// TODO : 향후 응답 구조가 수정되면 맞춰서 처리해야합니다 (id가아니라 accessToken을 받아옴)

export const getAccessToken = async ({
  email,
  password,
}: SignInRequest): Promise<string> => {
  const endpoint = "users/login";
  const body = JSON.stringify({
    email: email,
    password: password,
  });

  const response = await csrFetch<SignInResponse>(endpoint, {
    method: "POST",
    body: body,
  });

  //TODO: 백엔드 업데이트에 따라서 "id"를 "accessToken"으로 수정해야합니다
  return response.id;
};

export const getUserNickname = async (): Promise<string> => {
  const endpoint = "users/nickname";

  const response = await csrFetch<NicknameResponse>(endpoint, {
    method: "GET",
  });

  return response.nickname;
};
