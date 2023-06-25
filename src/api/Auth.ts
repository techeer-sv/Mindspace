import axios from '@/utils/baseAxios';

/**
 * //TODO
 * React-query를 사용해 컴포넌트에서 직접 api를 호출하지 않도록 수정해야합니다.
 */

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
  await axios.post('user/signup', {
    nickname: userName,
    email: email,
    password: password,
  });
};

interface GetAccessTokenParams {
  email: string;
  password: string;
}

export const getAccessToken = async ({
  email,
  password,
}: GetAccessTokenParams) => {
  const response = await axios.post('user/login', {
    email: email,
    password: password,
  });

  /**
   * //FIXME
   * data.id값으로 받아오는 응답값을 향후 백엔드 업데이트에 맞춰 accessToken값으로 수정해야합니다.
   */

  const accessToken = response.data.id;
  return accessToken;
};

export const getUserNickname = async () => {
  const response = await axios.get('user/nickname');
  return response.data.nickname;
};
