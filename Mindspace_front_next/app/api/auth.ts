import { baseFetch } from "./baseFetch";

interface CreateUserParams {
  userName: string;
  email: string;
  password: string;
}

export const createUser = async ({
  userName,
  email,
  password,
}: CreateUserParams) => {
  const endpoint = "user/signup";
  const body = JSON.stringify({
    nickname: userName,
    email: email,
    password: password,
  });

  await baseFetch(endpoint, {
    method: "POST",
    body: body,
  });
};

// TODO : 향후 응답 구조가 수정되면 맞춰서 처리해야합니다 (id가아니라 accessToken을 받아옴)
interface UserResponse {
  id: string;
  email: string;
  password: string;
  nickname: string;
}

interface GetAccessTokenParams {
  email: string;
  password: string;
}

export const getAccessToken = async ({
  email,
  password,
}: GetAccessTokenParams): Promise<string> => {
  const endpoint = "user/login";
  const body = JSON.stringify({
    email: email,
    password: password,
  });

  const response = await baseFetch<UserResponse>(endpoint, {
    method: "POST",
    body: body,
  });

  //TODO: 백엔드 업데이트에 따라서 "id"를 "accessToken"으로 수정해야합니다
  return response.id;
};

interface UserNicknameResponse {
  nickname: string;
}

export const getUserNickname = async (): Promise<string> => {
  const endpoint = "user/nickname";

  const response = await baseFetch<UserNicknameResponse>(endpoint, {
    method: "GET",
  });

  return response.nickname;
};
