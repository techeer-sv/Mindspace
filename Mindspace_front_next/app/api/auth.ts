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
